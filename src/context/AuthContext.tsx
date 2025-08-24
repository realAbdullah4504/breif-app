import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { AuthService, ExtendedUser } from "../services/auth";
import { toast } from "react-hot-toast";

interface AuthContextType {
  currentUser: ExtendedUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<ExtendedUser | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (name: string, email: string, password: string, role: string, organizationName?: string) => Promise<ExtendedUser>;
  login: (email: string, password: string) => Promise<ExtendedUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const authService = new AuthService();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing authentication...');
        const user = await authService.getCurrentUser();
        console.log('👤 Current user from auth service:', user);
        setCurrentUser(user);
        
        if (user) {
          console.log('✅ User authenticated successfully:', user.email, 'Role:', user.role);
        } else {
          console.log('❌ No authenticated user found');
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setCurrentUser(null);
      } finally {
        console.log('🏁 Auth initialization complete');
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<ExtendedUser> => {
    console.log('Login attempt for email:', email);
    const { user, error } = await authService.signIn(email, password);

    if (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      
      throw error;
    }

    if (!user) {
      console.error('Login failed - no user returned');
      throw new Error("Login failed");
    }

    console.log('Login successful, user:', user);
    setCurrentUser(user);
    toast.success(`Welcome back, ${user.name}!`);
    return user;
  }, [setCurrentUser]);

  const signUp = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: string,
    organizationName?: string
  ): Promise<ExtendedUser> => {
    const { user, error } = await authService.signUp(name, email, password, role, organizationName);

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error("Signup failed");
    }

    setCurrentUser(user);
    
    // Don't show success toast for members as they'll go through onboarding
    if (user.role === 'admin') {
      toast.success(`Welcome to Briefly, ${user.name}!`);
    }
    
    return user;
  }, [setCurrentUser]);

  const logout = useCallback(async () => {
    const { error } = await authService.signOut();
    if (error) {
      throw error;
    }
    setCurrentUser(null);
    toast.success('You have been signed out successfully.');
  }, [setCurrentUser]);

  const value = useMemo(() => ({
    currentUser,
    setCurrentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        signUp,
        login,
        logout,
      }),
    [currentUser, isLoading, signUp, login, logout],
    );

    return (
      <AuthContext.Provider value={value}>
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