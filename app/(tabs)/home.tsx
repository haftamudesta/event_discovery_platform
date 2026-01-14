import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import ThemedView from "@/components/Themedview";
import ThemedText from "@/components/Themedtext";
import Spacer from "@/components/Spacer";
import image from "@/assets/img/images_dis.jpg";
import { useAuth } from "@/hooks/useUser";
import { Colors } from "@/constants/colors";

const Home = () => {
  const router = useRouter();
  const { user } = useAuth();
  console.log(user);

  const handleNavigateToProfile = () => {
    router.push("/profile");
  };
  const handleNavigateToMainPage = () => {
    router.push("/");
  };

  return (
    <ThemedView safe={true} style={{ paddingLeft: 4, paddingRight: 4 }}>
      <Spacer height={40} />
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={styles.image}
          accessibilityLabel="App Logo"
          resizeMode="contain"
        />
      </View>
      <View style={styles.welcom_wrapper}>
        <Ionicons name={"hand-left"} size={24} color={Colors.greeting} />
        <Text style={styles.welcome}>Welcome {user?.name}</Text>
      </View>

      <View style={styles.links_wrapper}>
        <TouchableOpacity
          onPress={handleNavigateToProfile}
          activeOpacity={0.7}
          style={styles.linkButton}
        >
          <Text style={styles.links}>Navigate to your Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNavigateToMainPage}
          activeOpacity={0.7}
          style={styles.linkButton}
        >
          <Text style={styles.links}>Navigate to Main Page</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.introduction}>
        <ThemedText style={styles.introText}>
          📍Discover Amazing Events
        </ThemedText>
        <ThemedText style={styles.introText}>
          Find events that match your interests in the World
        </ThemedText>
      </View>
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
  welcom_wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginVertical: 8,
  },
  welcome: {
    color: Colors.greeting,
    fontWeight: "800",
    fontSize: 24,
  },
  links_wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 16,
    gap: 16,
  },
  linkButton: {
    flex: 1,
  },
  links: {
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 24,
    textAlign: "center",
    color: Colors.textInverse,
    fontWeight: "600",
  },
  introduction: {
    gap: 8,
    marginTop: 16,
  },
  introText: {
    fontSize: 16,
  },
});

export default Home;
