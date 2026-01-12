import {
  Text,
  useColorScheme,
  TextStyle,
  StyleProp,
  TextProps,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/colors";

type TextVariant =
  | "default"
  | "title"
  | "heading"
  | "subtitle"
  | "caption"
  | "label";

interface ThemedTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
  variant?: TextVariant;
  color?: keyof typeof Colors.light;
  bold?: boolean;
  italic?: boolean;
  center?: boolean;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  variant = "default",
  color,
  bold = false,
  italic = false,
  center = false,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;

  const textColor = color
    ? theme[color]
    : variant === "title" || variant === "heading"
    ? theme.title
    : theme.text;

  const getFontSize = (): number => {
    switch (variant) {
      case "heading":
        return 32;
      case "title":
        return 24;
      case "subtitle":
        return 18;
      case "caption":
        return 12;
      case "label":
        return 14;
      default:
        return 16;
    }
  };

  const getFontWeight = (): TextStyle["fontWeight"] => {
    if (bold) return "bold";
    switch (variant) {
      case "heading":
      case "title":
      case "label":
        return "600";
      default:
        return "400";
    }
  };

  return (
    <Text
      style={[
        {
          color: textColor,
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
          fontStyle: italic ? "italic" : "normal",
          textAlign: center ? "center" : "left",
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedText;
