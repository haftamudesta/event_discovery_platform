import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useUser";
import GuestOnly from "@/components/auth/GuestOnly";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;
  const { user } = useAuth();
  console.log("current iser", user);
  return (
    <GuestOnly>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      ></Stack>
    </GuestOnly>
  );
}
