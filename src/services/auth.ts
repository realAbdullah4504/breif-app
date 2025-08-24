import { supabase, isMockMode, mockSignUp } from "../lib/supabase";
import { AuthError, User } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";

interface AuthResponse {
  user: ExtendedUser | null;
  error: AuthError | null;
}

export interface ExtendedUser extends User {
  role: string;
  name: string;
  avatar_url: string | null;
  invited_by?: string;
}


export class AuthService {
  async signUp(
    name: string,
    email: string,
    password: string,
    role: string,
    organizationName?: string
  ): Promise<AuthResponse> {
    try {
      // Use mock authentication if Supabase is not configured
      if (isMockMode) {
        console.warn('Supabase not configured - using mock authentication for development');
        console.warn('To use real authentication, please:');
        console.warn('1. Set up a Supabase project');
        console.warn('2. Update your .env file with correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        console.warn('3. Start Supabase locally with: npx supabase start');
        
        const mockResult = await mockSignUp(email, password, name, role);
        const extendedUser = { 
          ...mockResult.user, 
          role, 
          name,
          avatar_url: null 
        } as ExtendedUser;
        toast.success('Account created successfully! You can now sign in.');
        return { user: extendedUser, error: null };
      }

      // Use the create-user edge function to handle user creation with proper permissions
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          organizationName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const customError = new Error(errorData.error || 'Failed to create account') as AuthError;
        return { user: null, error: customError };
      }
      const { profile } = await response.json();
      
      // Now sign in the user
      const signInResult = await this.signIn(email, password);
      if (signInResult.error) {
        return signInResult;
      }

      toast.success('Account created successfully!');
      return signInResult;
    } catch (networkError) {
      console.error('Network error during signup:', networkError);
      const customError = new Error('Unable to connect to authentication service. Please check your internet connection and try again.') as AuthError;
      return { user: null, error: customError };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // Use mock authentication if Supabase is not configured
      if (isMockMode) {
        console.warn('Supabase not configured - using mock authentication for development');
        console.warn('To use real authentication, please:');
        console.warn('1. Set up a Supabase project');
        console.warn('2. Update your .env file with correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        console.warn('3. Start Supabase locally with: npx supabase start');
        
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
          const userData = JSON.parse(mockUser);
          if (userData.email === email) {
            localStorage.setItem('userEmail', email);
            return { user: userData as ExtendedUser, error: null };
          }
        }
        throw new Error('Invalid email or password');
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      const { data } = await supabase
        .from("users")
        .select("role,name,avatar_url,invited_by")
        .eq("id", user?.id)
        .maybeSingle();

      if (!data) {
        console.error('No user profile found in database for:', user?.email);
        // Create a basic profile for users who exist in auth but not in users table
        const basicProfile = {
          id: user?.id,
          name: user?.email?.split('@')[0] || 'User',
          email: user?.email,
          role: 'admin', // Default role for new signups
          avatar_url: null,
          invited_by: null
        };
        
        // Try to insert the basic profile
        try {
          await supabase.from('users').insert(basicProfile);
          console.log('Created basic user profile');
        } catch (insertError) {
          console.error('Failed to create user profile:', insertError);
        }
        
        const userWithRole = { ...user, ...basicProfile } as ExtendedUser;
        return { user: userWithRole, error: null };
      }

      const userWithRole = { 
        ...user, 
        role: data.role, 
        name: data.name, 
        avatar_url: data.avatar_url, 
        invited_by: data.invited_by 
      } as ExtendedUser;
      return { user: userWithRole, error };
    } catch (networkError) {
      console.error('Network error during signin:', networkError);
      const customError = new Error('Unable to connect to authentication service. Please check your internet connection and try again.') as AuthError;
      return { user: null, error: customError };
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      // Handle mock authentication logout
      if (isMockMode) {
        console.warn('Using mock authentication - signing out locally');
        localStorage.removeItem('mockUser');
        localStorage.removeItem('userEmail');
        return { error: null };
      }

      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (networkError) {
      console.error('Network error during signout:', networkError);
      const customError = new Error('Unable to connect to authentication service.') as AuthError;
      return { error: customError };
    }
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      // Handle mock password reset
      if (isMockMode) {
        console.warn('Using mock authentication - password reset simulated');
        toast.success('Password reset email sent! (Mock mode)');
        return { error: null };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://my.brieflyapp.co/auth/set-password',
      });
      return { error };
    } catch (networkError) {
      console.error('Network error during password reset:', networkError);
      const customError = new Error('Unable to connect to authentication service.') as AuthError;
      return { error: customError };
    }
  }

  async getCurrentUser(): Promise<ExtendedUser | null> {
    try {
      // Check if we're in mock mode first
      if (isMockMode) {
        return getMockCurrentUser();
      }
      
      if (!supabase) {
        return getMockCurrentUser();
      }
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        // Clear invalid session data
        await supabase.auth.signOut();
        return null;
      }
      
      if (!session?.user) {
        // No valid session, clear any stored data
        await supabase.auth.signOut();
        return null;
      }

      const { data, error: roleError } = await supabase
        .from("users")
        .select("role,name,avatar_url,invited_by")
        .eq("id", session.user.id)
        .maybeSingle();

      if (roleError || !data) {
        console.error("Error fetching user role:", roleError);
        // Get user metadata from auth session
        const userMetadata = session.user.user_metadata || {};
        const role = userMetadata.role || 'member';
        const name = userMetadata.name || session.user.email?.split('@')[0] || 'User';
        
        const basicUser = {
          ...session.user,
          role,
          name,
          avatar_url: null,
          invited_by: userMetadata.invited_by || null
        } as ExtendedUser;
        return basicUser;
      }

      return {
        ...session.user,
        role: data.role,
        name: data.name,
        avatar_url: data.avatar_url,
        invited_by: data.invited_by
      } as ExtendedUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      // Clear any corrupted session on error
      if (supabase) {
        await supabase.auth.signOut();
      }
      return null;
    }
  }

  async updatePassword(
    newPassword: string
  ): Promise<{ error: AuthError | null }> {
    try {
      // Handle mock password update
      if (isMockMode) {
        console.warn('Using mock authentication - password update simulated');
        toast.success('Password updated successfully! (Mock mode)');
        return { error: null };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (networkError) {
      console.error('Network error during password update:', networkError);
      const customError = new Error('Unable to connect to authentication service.') as AuthError;
      return { error: customError };
    }
  }
}