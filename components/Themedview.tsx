import { Colors } from "@/constants/colors";
import {
  useColorScheme,
  View,
  ViewStyle,
  StyleProp,
  ViewProps,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ThemedViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  safe: boolean;
}

const ThemedView: React.FC<ThemedViewProps> = ({
  style,
  safe = false,
  ...props
}) => {
  const colorScheme = useColorScheme();

  const theme = colorScheme ? Colors[colorScheme] : Colors.light;
  const insets = useSafeAreaInsets();

  if (!safe) {
    return (
      <View
        style={[
          {
            backgroundColor: theme.background,
          },
          style,
        ]}
        {...props}
      />
    );
  }
  return (
    <View
      style={[
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedView;
