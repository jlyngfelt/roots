import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { FeedToggle } from "@/components/ui/profilePage/feedToggle";
import { ProfileFeed } from "@/components/ui/profilePage/profileFeed";
import { Colors } from "@/constants/design-system";
import { getUserPlants } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ProfileCard } from "../../components/ui/profilePage/profileCard";
import { useAuth } from "../../contexts/AuthContext";
import { UserProfile } from "../../interfaces/index";

export default function ViewProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(
    null
  );
  const [plants, setPlants] = useState<any[]>([]);
  const [readyToAdoptPlants, setReadyToAdoptPlants] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      async function fetchProfile() {
        try {
          setLoading(true);
          const profile: any = await getUserProfile(userId);
          if (profile) {
            setUserProfile(profile);
          }
        } catch (err) {
          setError("Could not load profile");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      fetchProfile();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      async function fetchPlants() {
        try {
          const userPlants: any[] = await getUserPlants(userId);
          setPlants(userPlants);

          const readyPlants = userPlants.filter(
            (plant) => plant.readyToAdopt === true
          );
          setReadyToAdoptPlants(readyPlants);
        } catch (err) {
          console.error("Error fetching plants:", err);
        }
      }
      fetchPlants();
    }
  }, [userId]);

  return (
    <ScrollView style={styles.bgColor}>
      <ProfileCard userProfile={userProfile} />

      <DefaultButton variant="secondary" style={styles.fullWidthButton}>
        Kontakta
      </DefaultButton>

      <FeedToggle showAll={showAll} onToggle={setShowAll} />

      {showAll ? (
        <ProfileFeed
          plants={plants}
          userId={user?.uid!}
          onPlantPress={(plantId) => router.push(`/view-plant/${plantId}`)}
        />
      ) : (
        <ProfileFeed
          plants={readyToAdoptPlants}
          userId={user?.uid!}
          onPlantPress={(plantId) => router.push(`/view-plant/${plantId}`)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: Colors.secondary,
  },
  fullWidthButton: {
    alignSelf: "stretch",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  feed: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 80,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 96,
    marginVertical: 24,
  },
});
