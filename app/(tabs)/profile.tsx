import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import React, { useState } from "react";

import image from "@/assets/img/avator.jpg";
import ThemedView from "@/components/Themedview";
import Spacer from "@/components/Spacer";
import { useAuth } from "@/hooks/useUser";
import ThemedText from "@/components/Themedtext";
import { Colors } from "@/constants/colors";
import { preDefinedInterests } from "@/constants/profile";
import Tag from "@/components/Tag";
import ThemedButton from "@/components/ThemedButton";

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
  { id: "1", title: "Tech Conference" },
  { id: "2", title: "Music Festival" },
  { id: "3", title: "Gaming Tournament" },
  { id: "4", title: "Sports Event" },
  { id: "5", title: "Drama Play" },
  { id: "6", title: "Art Exhibition" },
];

const Profile = () => {
  const { user } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  // useState<string[]>(user?.interests || []);
  const [editing, setEditing] = useState(false);

  const toggleSelection = (item: string) => {
    if (!editing) return;
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const capitalizeFirstLetter = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const firstName = user?.name
    ? capitalizeFirstLetter(user.name.split(" ")[0])
    : "";

  const renderInterestItem = ({ item }: { item: string }) => (
    <Tag
      text={item}
      selected={selectedInterests.includes(item)}
      onPress={() => toggleSelection(item)}
      dashed={editing}
      style={styles.tagItem}
    />
  );

  return (
    <ThemedView safe={true} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Spacer height={20} />
        <View style={styles.imageContainer}>
          <Image
            source={image}
            style={styles.image}
            accessibilityLabel="User Profile"
            resizeMode="cover"
          />
        </View>

        <View style={styles.textContainer}>
          <ThemedText style={styles.welcomeText}>
            Welcome to Event Discovery{firstName ? `, ${firstName}` : ""}!
          </ThemedText>
          <ThemedText style={styles.emailText}>
            You have logged in as{"\n"}
            <ThemedText style={styles.emailAddress}>{user?.email}</ThemedText>
          </ThemedText>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusContent}>
            <View style={styles.dashedCircle}>
              <ThemedText style={styles.dashedText}>0</ThemedText>
            </View>
            <ThemedText style={styles.statusLabel}>Events</ThemedText>
          </View>
          <View style={styles.statusContent}>
            <View style={styles.dashedCircle}>
              <ThemedText style={styles.dashedText}>0</ThemedText>
            </View>
            <ThemedText style={styles.statusLabel}>Saved</ThemedText>
          </View>
          <View style={styles.statusContent}>
            <View style={styles.dashedCircle}>
              <ThemedText style={styles.dashedText}>0</ThemedText>
            </View>
            <ThemedText style={styles.statusLabel}>Following</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>My Events</ThemedText>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </View>
          <View style={styles.eventsGrid}>
            {eventsData.slice(0, 4).map((event) => (
              <EventCard key={event.id} title={event.title} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Interests</ThemedText>
            <ThemedButton
              onPress={handleEditToggle}
              variant={editing ? "primary" : "outline"}
              size="small"
            >
              {editing ? "Done" : "Edit"}
            </ThemedButton>
          </View>

          <View style={styles.interestsContent}>
            <ThemedText style={styles.interestsSubtitle}>
              I am looking to
            </ThemedText>
            <ThemedText style={styles.interestsDescription}>
              Select why you're here in Event Discovery
            </ThemedText>

            <FlatList
              data={preDefinedInterests}
              keyExtractor={(item) => item}
              renderItem={renderInterestItem}
              numColumns={2}
              columnWrapperStyle={styles.interestsRow}
              scrollEnabled={false}
              contentContainerStyle={styles.interestsList}
            />

            {editing && selectedInterests.length > 0 && (
              <View style={styles.selectedCountContainer}>
                <ThemedText style={styles.selectedCountText}>
                  {selectedInterests.length} interest
                  {selectedInterests.length !== 1 ? "s" : ""} selected
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <Spacer height={40} />
      </ScrollView>
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  imageContainer: {
    height: 160,
    width: 160,
    backgroundColor: Colors.sky[400],
    alignSelf: "center",
    borderRadius: 80,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: Colors.gray[900],
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
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  statusContent: {
    alignItems: "center",
    gap: 8,
  },
  dashedCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.gray[400],
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  dashedText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.gray[700],
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.gray[600],
    fontWeight: "500",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray[900],
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  eventsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  eventCard: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: Colors.sky[50],
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray[800],
    textAlign: "center",
  },
  interestsContent: {
    width: "100%",
  },
  interestsSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 4,
  },
  interestsDescription: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 16,
  },
  interestsList: {
    paddingBottom: 8,
  },
  interestsRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tagItem: {
    width: "48%",
    marginBottom: 12,
  },
  selectedCountContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.sky[50],
    borderRadius: 8,
    alignItems: "center",
  },
  selectedCountText: {
    fontSize: 14,
    color: Colors.gray[700],
    fontWeight: "500",
  },
});
