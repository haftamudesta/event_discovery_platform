import { ActivityIndicator, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

interface LoadingSpinnerProps {
  size?: "small" | "large" | number;
  color?: string;
}

const ThemedLoader = ({ size = "small", color }: LoadingSpinnerProps) => {
  const themeScheme = useColorScheme();
  const theme = themeScheme ? Colors[themeScheme] : Colors.light;

  return <ActivityIndicator size={size} color={color || theme.text} />;
};

export default ThemedLoader;
