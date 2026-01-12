import {
  StyleSheet,
  TextInput,
  useColorScheme,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import React, { forwardRef } from "react";
import { Colors } from "@/constants/colors";

interface ThemedTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  placeholderTextColor?: string;
}

const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
  (props, ref) => {
    const themeScheme = useColorScheme();
    const theme = themeScheme ? Colors[themeScheme] : Colors.light;

    const {
      style,
      containerStyle,
      inputStyle,
      placeholderTextColor,
      placeholder = "Type here...",
      ...restProps
    } = props;

    // Default text colors for light/dark themes
    const defaultPlaceholderColor =
      themeScheme === "dark"
        ? theme.text + "80" // 50% opacity for dark
        : theme.text + "60"; // 40% opacity for light

    return (
      <TextInput
        ref={ref}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || defaultPlaceholderColor}
        style={[
          styles.input,
          {
            color: theme.text,
            backgroundColor: theme.uiBackground,
            borderColor: theme.text,
            padding: 20,
            borderRadius: 12,
          },
          style,
          inputStyle,
        ]}
        {...restProps}
      />
    );
  }
);

ThemedTextInput.displayName = "ThemedTextInput";

export default ThemedTextInput;

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 50,
  },
});
