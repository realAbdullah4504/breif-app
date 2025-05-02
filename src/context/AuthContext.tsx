import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { AuthService } from "../services/auth";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  signUp: (name:string,email: string, password: string, role: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const authService = new AuthService();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const { user, error } = await authService.signIn(email, password);

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error("Login failed");
    }

    setCurrentUser(user);
    return user;
  };

  const signUp = async (
    name:string,
    email: string,
    password: string,
    role: string
  ): Promise<User> => {
    const { user, error } = await authService.signUp(name,email, password, role);

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error("Signup failed");
    }

    setCurrentUser(user);
    return user;
  };

  const logout = async () => {
    const { error } = await authService.signOut();
    if (error) {
      throw error;
    }
    setCurrentUser(null);
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        signUp,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
