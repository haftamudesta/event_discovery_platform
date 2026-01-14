import { Text, View, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import ThemedView from "@/components/Themedview";
import Spacer from "@/components/Spacer";

export default function Home() {
  console.log("index");
  return (
    <ThemedView safe={true} style={styles.container}>
      <Spacer height={24} />
      <Text style={styles.title}>The Number 1</Text>
      <Text>Reading List App</Text>
      <Link href="/(auth)/sign_in">Sign In Page</Link>
      <Link href="/(auth)/sign_up">Sign Up Page</Link>
      <Link href="/explore">Explore Page</Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  img: {
    marginVertical: 20,
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
});
