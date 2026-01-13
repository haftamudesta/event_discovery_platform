import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";
import React from "react";

const ThemedButton = ({ ...props }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      {...props}
    />
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 24,
    width: "70%",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});
