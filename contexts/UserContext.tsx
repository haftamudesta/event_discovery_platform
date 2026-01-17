import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import {
  account,
  databases,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import {
  CustomUser,
  AuthUserType,
  SignupDto,
  UserRole,
  UserInterest,
} from "@/types/user";

export interface AuthContextType {
  user: AuthUserType;
  loading: boolean;
  error: string | null;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  signUp: (signupData: SignupDto) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  authChecked: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUserType>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const mapToCustomUser = (appwriteUser: any): CustomUser => {
    return {
      $id: appwriteUser.$id,
      id: appwriteUser.id || appwriteUser.$id,
      $createdAt: appwriteUser.$createdAt,
      $updatedAt: appwriteUser.$updatedAt,
      $collectionId: appwriteUser.$collectionId,
      $databaseId: appwriteUser.$databaseId,
      $permissions: appwriteUser.$permissions,
      name: appwriteUser.name,
      email: appwriteUser.email,
      password: appwriteUser.password || "",
      location: appwriteUser.location,
      profilePicture: appwriteUser.profilePicture,
      interests: appwriteUser.interests || [],
      role: appwriteUser.role || UserRole.USER,
      createdAt: appwriteUser.createdAt || appwriteUser.$createdAt,
      updatedAt: appwriteUser.updatedAt || appwriteUser.$updatedAt,
      phoneNumber: appwriteUser.phoneNumber,
      bio: appwriteUser.bio,
      dateOfBirth: appwriteUser.dateOfBirth,
      gender: appwriteUser.gender,
      isEmailVerified: appwriteUser.emailVerification || false,
      isActive: appwriteUser.isActive !== false,
      lastLoginAt: appwriteUser.lastLoginAt,
      loginCount: appwriteUser.loginCount || 0,
      socialProfiles: appwriteUser.socialProfiles,
      preferences: appwriteUser.preferences,
      stats: appwriteUser.stats,
    };
  };

  const fetchCustomUserData = async (
    appwriteUserId: string,
  ): Promise<CustomUser | null> => {
    try {
      console.log("Fetching user data for ID:", appwriteUserId);
      console.log("Database ID:", DATABASE_ID);
      console.log("Collection ID:", USERS_COLLECTION_ID);

      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal("$id", appwriteUserId)],
      );

      if (response.documents.length > 0) {
        return mapToCustomUser(response.documents[0]);
      }
      return await createCustomUserDocument(appwriteUserId);
    } catch (error) {
      console.error("Error fetching custom user data:", error);
      return null;
    }
  };

  const createCustomUserDocument = async (
    appwriteUserId: string,
  ): Promise<CustomUser | null> => {
    try {
      console.log("Creating custom user document for:", appwriteUserId);

      const appwriteUser = await account.get();

      const userData = {
        $id: appwriteUserId,
        id: appwriteUserId,
        name: appwriteUser.name,
        email: appwriteUser.email,
        emailVerification: appwriteUser.emailVerification,
        role: UserRole.USER,
        interests: [] as UserInterest[],
        isActive: true,
        loginCount: 1,
        lastLoginAt: new Date().toISOString(),
        createdAt: appwriteUser.$createdAt,
        updatedAt: new Date().toISOString(),
      };

      console.log("Creating document with data:", userData);

      const response = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        userData,
      );

      console.log("Document created successfully:", response.$id);
      return mapToCustomUser(response);
    } catch (error) {
      console.error("Error creating custom user document:", error);
      return null;
    }
  };

  const updateLoginStats = async (userId: string): Promise<void> => {
    try {
      await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, {
        loginCount: user?.loginCount ? user.loginCount + 1 : 1,
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating login stats:", error);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log("Checking user session...");

      const appwriteUser = await account.get();
      console.log("Appwrite user found:", appwriteUser.$id);

      const customUser = await fetchCustomUserData(appwriteUser.$id);

      if (customUser) {
        console.log("Custom user found:", customUser.email);
        setUser(customUser);
        await updateLoginStats(appwriteUser.$id);
      } else {
        console.log("No custom user found");
        setUser(null);
      }
    } catch (error: any) {
      console.log("No active session found (guest user)");
      setUser(null);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const signIn = async (
    email: string,
    password: string,
    rememberMe?: boolean,
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      console.log("Signing in with email:", email);
      await account.createEmailPasswordSession(email, password);

      const appwriteUser = await account.get();
      const customUser = await fetchCustomUserData(appwriteUser.$id);

      if (customUser) {
        setUser(customUser);
        await updateLoginStats(appwriteUser.$id);
      } else {
        throw new Error("Failed to load user data");
      }
    } catch (error: any) {
      const message = error.message || "Login failed";
      setError(message);
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (signupData: SignupDto): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      console.log("Starting signup process...");
      console.log("Signup data:", {
        name: signupData.name,
        email: signupData.email,
        passwordLength: signupData.password?.length || 0,
        confirmPasswordLength: signupData.confirmPassword?.length || 0,
        acceptTerms: signupData.acceptTerms,
      });

      // Validate required fields
      if (!signupData.email || !signupData.password || !signupData.name) {
        throw new Error("Missing required fields: email, password, or name");
      }

      if (!signupData.acceptTerms) {
        throw new Error("You must accept the terms and conditions");
      }

      // Create Appwrite account
      console.log("Creating Appwrite account...");
      await account.create(
        ID.unique(),
        signupData.email,
        signupData.password,
        signupData.name,
      );
      console.log("Appwrite account created");

      // Create session
      console.log("Creating session...");
      await account.createEmailPasswordSession(
        signupData.email,
        signupData.password,
      );

      // Get the created user
      const appwriteUser = await account.get();
      console.log("Appwrite user ID:", appwriteUser.$id);

      const userData = {
        $id: appwriteUser.$id,
        id: appwriteUser.$id,
        name: signupData.name,
        email: signupData.email,
        emailVerification: false,
        role: signupData.role || UserRole.USER,
        interests: signupData.interests || [],
        location: signupData.location,
        phoneNumber: signupData.phoneNumber,
        bio: signupData.bio,
        dateOfBirth: signupData.dateOfBirth,
        gender: signupData.gender,
        isActive: true,
        loginCount: 1,
        lastLoginAt: new Date().toISOString(),
        createdAt: appwriteUser.$createdAt,
        updatedAt: new Date().toISOString(),
        stats: {
          eventsCount: 0,
          savedEventsCount: 0,
          followersCount: 0,
          followingCount: 0,
        },
      };

      console.log("Creating user document in database...");
      console.log("Database:", DATABASE_ID);
      console.log("Collection:", USERS_COLLECTION_ID);

      const customUserDoc = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        userData,
      );

      console.log("User document created successfully:", customUserDoc.$id);

      setUser(mapToCustomUser(customUserDoc));
    } catch (error: any) {
      console.error("Sign up error details:", error);
      const message = error.message || "Sign up failed";
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: any): Promise<void> => {
    try {
      if (!user) throw new Error("No user logged in");

      setLoading(true);
      setError(null);

      const updatedUser = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
        {
          ...userData,
          updatedAt: new Date().toISOString(),
        },
      );

      setUser(mapToCustomUser(updatedUser));
    } catch (error: any) {
      const message = error.message || "Failed to update user";
      setError(message);
      console.error("Update user error:", error);
      throw error;
    } finally {
      setLoading(false);
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

  const deleteAccount = async (): Promise<void> => {
    try {
      if (!user) throw new Error("No user logged in");

      setLoading(true);
      setError(null);

      await databases.deleteDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
      );
      await signOut();
    } catch (error: any) {
      const message = error.message || "Failed to delete account";
      setError(message);
      console.error("Delete account error:", error);
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
      updateUser,
      deleteAccount,
      isAuthenticated: !!user,
      clearError,
      refreshUser: checkUserSession,
      authChecked,
    }),
    [user, loading, error, authChecked],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
