import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";

interface TagTypes {
  text: string;
  selected: boolean;
  onPress: () => void;
  dashed?: boolean;
  style?: ViewStyle;
}

const Tag = ({ text, selected, onPress, dashed, style }: TagTypes) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected ? styles.selected : styles.unselected,
        dashed && styles.dashed,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          selected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  unselected: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
  },
  selected: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  dashed: {
    borderStyle: "dashed",
    borderColor: "#bdbdbd",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  unselectedText: {
    color: "#424242",
  },
  selectedText: {
    color: "#ffffff",
  },
});

export default Tag;
