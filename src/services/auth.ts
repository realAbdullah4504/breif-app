import { supabase } from "../lib/supabase";
import { AuthError, User } from "@supabase/supabase-js";

interface AuthResponse {
  user: ExtendedUser | null;
  error: AuthError | null;
}

export interface ExtendedUser extends User {
  role: string;
  name: string;
  avatar_url: string | null;
}

export class AuthService {
  async signUp(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<AuthResponse> {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });
    if (user) {
      await supabase.from("users").insert({
        id: user.id,
        name,
        email: user.email,
        role,
      });
    }
    return { user, error };
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    const { data } = await supabase
      .from("users")
      .select("role,name,avatar_url")
      .eq("id", user?.id)
      .single();
    const role = data?.role;
    const name = data?.name;
    const avatar_url = data?.avatar_url;
    const userWithRole = { ...user, role, name, avatar_url } as ExtendedUser;
    return { user: userWithRole, error };
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  }

  async getCurrentUser(): Promise<ExtendedUser | null> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return null;
      }

      const { data, error: roleError } = await supabase
        .from("users")
        .select("role,name,avatar_url")
        .eq("id", user.id)
        .single();

      if (roleError || !data) {
        console.error("Error fetching user role:", roleError);
        return user as ExtendedUser;
      }

      return {
        ...user,
        role: data.role,
        name: data.name,
        avatar_url: data.avatar_url,
      } as ExtendedUser;
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      return null;
    }
  }
  async updatePassword(
    newPassword: string
  ): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  }
}
