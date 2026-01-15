import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  PressableProps,
} from "react-native";
import { Colors } from "@/constants/colors";

interface ThemedButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  children,
  style,
  textStyle,
  disabled = false,
  onPress,
  variant = "primary",
  size = "medium",
  ...props
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: Colors.secondary || "#6c757d",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: Colors.primary,
        };
      case "primary":
      default:
        return {
          backgroundColor: Colors.primary,
        };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "small":
        return {
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 16,
        };
      case "large":
        return {
          paddingVertical: 18,
          paddingHorizontal: 32,
          borderRadius: 28,
        };
      case "medium":
      default:
        return {
          paddingVertical: 15,
          paddingHorizontal: 25,
          borderRadius: 24,
        };
    }
  };

  const getTextVariantStyle = (): TextStyle => {
    switch (variant) {
      case "outline":
        return {
          color: Colors.primary,
        };
      case "secondary":
        return {
          color: Colors.white || "#FFFFFF",
        };
      case "primary":
      default:
        return {
          color: Colors.white || "#FFFFFF",
        };
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        getVariantStyle(),
        getSizeStyle(),
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, getTextVariantStyle(), textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
