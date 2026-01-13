import { useAuth } from "@/hooks/useUser";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text } from "react-native";
import ThemedLoader from "../ThemedLoader";

interface UserOnlyProps {
  children: React.ReactNode;
}

const UserOnly: React.FC<UserOnlyProps> = ({ children }) => {
  const { user, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && user === null) {
      router.replace("/sign_in");
    }
  }, [user, authChecked]);
  if (!authChecked || !user) {
    return <ThemedLoader />;
  }
  return children;
};

export default UserOnly;
