import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView, // Add this import
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import ThemedView from "@/components/Themedview";
import ThemedText from "@/components/Themedtext";
import ThemedCard from "@/components/ThemedCard";
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
    <ThemedView safe={true} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
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
          <Text style={styles.headings}>Welcome {user?.name}</Text>
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
        {/* Cards Section */}
        <View style={styles.cardsContainer}>
          <ThemedCard style={styles.card}>
            <ThemedText style={styles.cardTitle}>FEATURED EVENT</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Check out today's highlight!
            </ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.card}>
            <ThemedText style={styles.cardTitle}>BROWSE CATEGORIES</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Music, Sports, Tech & more
            </ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.card}>
            <ThemedText style={styles.cardTitle}>UPCOMING THIS WEEK</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Don't miss these events
            </ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.card}>
            <ThemedText style={styles.cardTitle}>TRENDING NOW</ThemedText>
            <ThemedText style={styles.cardDescription}>
              What everyone's talking about
            </ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.card}>
            <ThemedText style={styles.cardTitle}>
              RECOMMENDED FOR YOU
            </ThemedText>
            <ThemedText style={styles.cardDescription}>
              Personalized just for you
            </ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.card}>
            <ThemedText style={styles.cardTitle}>QUICK ACTIONS</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Book, Save, Share
            </ThemedText>
          </ThemedCard>
        </View>
        <Spacer height={40} /> {/* Add some bottom padding */}
      </ScrollView>
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
    marginVertical: 16,
  },
  headings: {
    color: Colors.greeting,
    fontWeight: "800",
    fontSize: 24,
  },
  links_wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 24,
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
    marginBottom: 24,
  },
  introText: {
    fontSize: 16,
  },
  cardsContainer: {
    gap: 16,
    marginTop: 8,
  },
  card: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default Home;
