import { FeedToggle } from "@/components/ui/profilePage/FeedToggle";
import { Colors } from "@/constants/design-system";
import { getUserPlants } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ProfileCard } from "../../components/ui/profilePage/ProfileCard";
import { ProfileFeed } from "../../components/ui/profilePage/ProfileFeed";
import { useAuth } from "../../contexts/AuthContext";
import { Plant, UserProfile } from "../../interfaces/index";
import TabLayout from "./_layout";

export default function ProfileScreen() {
  const router = useRouter();
  const [showAll, setShowAll] = useState(true);
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(
    null
  );
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    if (user?.uid) {
      async function fetchPlants() {
        if (!user?.uid) return;
        const userPlants = await getUserPlants(user?.uid);
        setPlants(userPlants);
      }
      fetchPlants();
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      async function fetchProfile() {
        const profile = await getUserProfile(user?.uid!);
        if (profile) {
          setUserProfile(profile);
        }
      }
      fetchProfile();
    }
  }, [user?.uid]);

  const displayedPlants = showAll
    ? plants
    : plants.filter((plant) => plant.readyToAdopt);

  return (
    <>
      <ScrollView style={styles.page}>
        <ProfileCard userProfile={userProfile} />
        <FeedToggle showAll={showAll} onToggle={setShowAll} />
        <TabLayout />
        <ProfileFeed
          plants={displayedPlants}
          userId={user?.uid!}
          onPlantPress={(plantId) => router.push(`/view-plant/${plantId}`)}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: Colors.secondary,
    paddingVertical: 40,
  },
});
