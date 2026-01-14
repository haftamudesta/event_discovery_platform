import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const profile = () => {
  return (
    <View>
      <Link href="/home">Go To Home</Link>
      <Text>profile</Text>
    </View>
  );
};

export default profile;
