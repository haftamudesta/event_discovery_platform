import {
  StyleSheet,
  useColorScheme,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Colors } from "@/constants/colors";

interface ThemedCardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
}

const ThemedCard = ({ children, style, ...props }: ThemedCardProps) => {
  const themeScheme = useColorScheme();
  const theme = themeScheme ? Colors[themeScheme] : Colors.light;

  return (
    <View
      style={[{ backgroundColor: theme.uiBackground }, styles.card, style]}
      {...props}
    >
      {children}
    </View>
  );
};

export default ThemedCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
  },
});
