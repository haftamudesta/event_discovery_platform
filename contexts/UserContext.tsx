import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import { account } from "@/lib/appwrite";
import { ID, Models } from "appwrite";
// import { CustomUser, AuthUserType, SigninDto, SignupDto,UserRole} from "@/types/user";

export type AuthUserType = Models.User<Models.Preferences> | null;

export interface AuthContextType {
  user: AuthUserType;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  authChecked: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUserType>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await account.get();
      setUser(response);
    } catch (error: any) {
      setUser(null);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await account.createEmailPasswordSession(email, password);

      const response = await account.get();
      setUser(response);
    } catch (error: any) {
      const message = error.message || "Login failed";
      setError(message);
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await account.create(ID.unique(), email, password, name);
      await signIn(email, password);
    } catch (error: any) {
      const message = error.message || "Sign up failed";
      setError(message);
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await account.deleteSession("current");
      setUser(null);
    } catch (error: any) {
      const message = error.message || "Sign out failed";
      setError(message);
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      error,
      signIn,
      signUp,
      signOut,
      isAuthenticated: !!user,
      clearError,
      refreshUser: checkUserSession,
      authChecked: authChecked,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
