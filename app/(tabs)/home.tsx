import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ThemedView from "@/components/Themedview";
import Spacer from "@/components/Spacer";
import image from "@/assets/img/images_dis.jpg";

const Home = () => {
  const router = useRouter();

  const handleNavigateToProfile = () => {
    router.push("/profile");
  };

  return (
    <ThemedView safe={true}>
      <Spacer height={40} />
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={styles.image}
          accessibilityLabel="App Logo"
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity onPress={handleNavigateToProfile} activeOpacity={0.7}>
        <Text>Go To Profile</Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default Home;
