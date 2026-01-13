import {
  StyleSheet,
  useColorScheme,
  Image,
  ImageStyle,
  StyleProp,
  ImageProps,
} from "react-native";
import React from "react";
import logo from "@/assets/img/Discovery-Events-Logo.png";

interface ThemedLogoProps extends Omit<ImageProps, "source"> {
  style?: StyleProp<ImageStyle>;
  defaultTo?: "light" | "dark";
  size?: number | { width: number; height: number };
  forceTheme?: "light" | "dark";
}

const ThemedLogo: React.FC<ThemedLogoProps> = ({
  style,
  defaultTo = "light",
  size,
  forceTheme,
  ...props
}) => {
  const colorScheme = useColorScheme();

  const sizeStyle = size
    ? typeof size === "number"
      ? { width: size, height: size }
      : { width: size.width, height: size.height }
    : {};

  return (
    <Image
      source={logo}
      style={[styles.base, sizeStyle, style]}
      accessibilityLabel="App Logo"
      {...props}
    />
  );
};

export default ThemedLogo;

const styles = StyleSheet.create({
  base: {
    resizeMode: "contain",
  },
});
