import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import React from "react";

import image from "@/assets/img/avator.jpg";
import ThemedView from "@/components/Themedview";
import Spacer from "@/components/Spacer";
import { useAuth } from "@/hooks/useUser";
import ThemedText from "@/components/Themedtext";
import { Colors } from "@/constants/colors";

interface EventItem {
  id: string;
  title: string;
}

const EventCard = ({ title }: { title: string }) => (
  <View style={styles.eventCard}>
    <ThemedText style={styles.eventText}>{title}</ThemedText>
  </View>
);

const eventsData: EventItem[] = [
  { id: "1", title: "Tech" },
  { id: "2", title: "Music" },
  { id: "3", title: "Game" },
  { id: "4", title: "Sports" },
  { id: "5", title: "Drama" },
];

const Profile = () => {
  const { user } = useAuth();

  const capitalizeFirstLetter = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  const firstName = user?.name
    ? capitalizeFirstLetter(user.name.split(" ")[0])
    : "";

  return (
    <ThemedView safe={true} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <Spacer height={20} />
        <View style={styles.imageContainer}>
          <Image
            source={image}
            style={styles.image}
            accessibilityLabel="App Logo"
            resizeMode="cover"
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.welcomeText}>
            Welcome to Event discovery {firstName}
          </ThemedText>
          <ThemedText style={styles.emailText}>
            You have logged in as{"\n"}
            <ThemedText style={styles.emailAddress}>{user?.email}</ThemedText>
          </ThemedText>
        </View>

        <View style={styles.status}>
          <View style={styles.status_content}>
            <View style={styles.dashedCircle}>
              <ThemedText style={styles.dashedText}>0</ThemedText>
            </View>
            <ThemedText style={styles.statusLabel}>Events</ThemedText>
          </View>
          <View style={styles.status_content}>
            <View style={styles.dashedCircle}>
              <ThemedText style={styles.dashedText}>0</ThemedText>
            </View>
            <ThemedText style={styles.statusLabel}>Saved</ThemedText>
          </View>
          <View style={styles.status_content}>
            <View style={styles.dashedCircle}>
              <ThemedText style={styles.dashedText}>0</ThemedText>
            </View>
            <ThemedText style={styles.statusLabel}>Following</ThemedText>
          </View>
        </View>
        <View style={styles.my_events}>
          <View style={styles.my_events_top_section}>
            <ThemedText>My Events</ThemedText>
            <ThemedText>All Events</ThemedText>
          </View>
          <View style={styles.my_events_bottom_section}>
            <View style={styles.gridContainer}>
              {eventsData.map((event) => (
                <EventCard key={event.id} title={event.title} />
              ))}
            </View>
          </View>
        </View>
        <View style={styles.my_events}>
          <View style={styles.my_events_top_section}>
            <ThemedText>Interests</ThemedText>
            <ThemedText>Edit</ThemedText>
          </View>
          <View style={styles.my_events_bottom_section}>
            <View></View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  imageContainer: {
    height: 200,
    width: 200,
    backgroundColor: Colors.sky[400],
    alignSelf: "center",
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emailText: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: "center",
    lineHeight: 22,
  },
  emailAddress: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[800],
    marginTop: 4,
  },
  status: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  status_content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dashedCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.gray[400],
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  dashedText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray[700],
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    fontWeight: "500",
  },
  my_events: {
    display: "flex",
    marginTop: 12,
    paddingHorizontal: 20,
  },
  my_events_top_section: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  my_events_bottom_section: {
    width: "100%",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  eventCard: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: Colors.sky[100],
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.gray[200],
  },
  eventText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray[800],
    textAlign: "center",
  },
});
