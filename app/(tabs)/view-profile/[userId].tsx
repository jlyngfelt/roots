import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { FeedToggle } from "@/components/ui/profilePage/feedToggle";
import { ProfileFeed } from "@/components/ui/profilePage/profileFeed";
import { Colors, Styles } from "@/constants/design-system";
import { createChat, getChatBetweenUsers } from "@/services/chatService";
import { getUserPlants } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { ProfileCard } from "../../../components/ui/profilePage/profileCard";
import { useAuth } from "../../../contexts/AuthContext";
import { UserProfile } from "../../../interfaces/index";

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
          setError("Kunde inte ladda profil");
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
          setLoading(true);
          const userPlants: any[] = await getUserPlants(userId);
          setPlants(userPlants);

          const readyPlants = userPlants.filter(
            (plant) => plant.readyToAdopt === true
          );
          setReadyToAdoptPlants(readyPlants);
        } catch (err) {
          setError("Kunde inte hämta plantor");
          console.error("Error fetching plants:", err);
          setLoading(false);
        }
      }
      fetchPlants();
    }
  }, [userId]);

  const handleContact = async () => {
    if (!user?.uid || !userId) return;

    try {
      let existingChatId = await getChatBetweenUsers(user.uid, userId);

      if (!existingChatId) {
        existingChatId = await createChat(user.uid, userId);
      }

      router.push(`/conversation/${existingChatId}`);
    } catch (error) {
      setError("Kunde inte öppna chatten. Försök igen.");
      console.error("Error opening chat:", error);
    }
  };

  return (
    <ScrollView style={styles.bgColor}>
      <ProfileCard userProfile={userProfile} />

      <DefaultButton
        onPress={handleContact}
        variant="secondary"
        style={styles.fullWidthButton}
      >
        Kontakta
      </DefaultButton>

       {error && (
            <Text
            style={Styles.actionL}>
              {error}
            </Text>
          )}

      <FeedToggle showAll={showAll} onToggle={setShowAll} />
{loading ? (
      <Text style={[Styles.bodyXL, { textAlign: 'center' }]}>Laddar profil...</Text>
    ) : (
      showAll ? (
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
      )
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
