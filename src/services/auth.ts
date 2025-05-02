import { supabase } from "../lib/supabase";
import { AuthError, User } from "@supabase/supabase-js";

interface AuthResponse {
  user: User | null;
  error: AuthError | null;
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
    const { data} = await supabase
      .from("users")
      .select("role")
      .eq("id", user?.id)
      .single();
    const role = data?.role;
    const userWithRole = { ...user, role } as User;
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

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user?.id)
      .single();
    const role = data?.role;
    return { ...user, role } as User;
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
