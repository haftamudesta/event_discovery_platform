import { ActivityIndicator, useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

import ThemedView from "./Themedview";

const ThemedLoader = () => {
  const themeScheme = useColorScheme();
  const theme = themeScheme ? Colors[themeScheme] : Colors.light;
  return (
    <ThemedView
      safe={false}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={theme.text} />;
    </ThemedView>
  );
};

export default ThemedLoader;
