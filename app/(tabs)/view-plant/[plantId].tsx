import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { ProductCard } from "@/components/ui/productCard/ProductCard";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "@/constants/design-system";
import { db } from "@/firebaseConfig";
import { createChat, getChatBetweenUsers } from "@/services/chatService";
import { getPlantById } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { GiveAwayPlant } from "../../../components/GiveAwayPlant"

export default function ViewPlantScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [readyToAdopt, setReadyToAdopt] = useState(false);
  const [id, setId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [userId, setUserId] = useState("");
  const [userProfileName, setUserProfileName] = useState("");
  const [userProfileImageUrl, setUserProfileImageUrl] = useState("");
  const [userProfileLat, setUserProfileLat] = useState<number>(0);
  const [userProfileLon, setUserProfileLon] = useState<number>(0);
  const [plantOwnerLat, setPlantOwnerLat] = useState<number>(0);
  const [plantOwnerLon, setPlantOwnerLon] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      async function fetchPlant() {
        const plant: any = await getPlantById(plantId);
        if (plant) {
          setPlantName(plant.name || "");
          setDescription(plant.description || "");
          setReadyToAdopt(plant.readyToAdopt || false);
          setId(plant.id || "");
          setImageUrl(plant.imageUrl || "");
          setImageUrls(plant.imageUrls || [plant.imageUrl] || []);
          setUserId(plant.userId || "");
        }
      }
      fetchPlant();
    }
  }, [user?.uid, plantId]);

  //Hämta plantans ägares koordinater
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userProfile = docSnap.data();
        setUserProfileName(userProfile.username || "");
        setUserProfileImageUrl(userProfile.profileImageUrl || "");
        setPlantOwnerLat(userProfile.lat || "");
        setPlantOwnerLon(userProfile.lon || "");
      }
    });

    return () => unsubscribe();
  }, [userId]);

  //Hämta mina kordinater
  useEffect(() => {
    if (user?.uid) {
      async function fetchProfile() {
        const profile = await getUserProfile(user?.uid!);
        if (profile) {
          setUserProfileLat(profile.latitude || "");
          setUserProfileLon(profile.longitude || "");
        }
      }
      fetchProfile();
    }
  }, [user?.uid]);

  const handleContact = async () => {
    if (!user?.uid || !userId) return;

    try {
      let existingChatId = await getChatBetweenUsers(user.uid, userId);

      if (!existingChatId) {
        existingChatId = await createChat(user.uid, userId);
      }

      router.push(`/conversation/${existingChatId}`);
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };

  return (
    <ScrollView style={styles.bgColor}>
      <ProductCard
        variant="view"
        userId={userId}
        plantId={id}
        name={plantName}
        description={description}
        image={imageUrl}
        imageUrls={imageUrls}
        readyToAdopt={readyToAdopt}
        userLat={userProfileLat}
        userLon={userProfileLon}
        plantOwnerLat={plantOwnerLat}
        plantOwnerLon={plantOwnerLon}
      ></ProductCard>

      <View style={styles.buttonContainer}>
        <DefaultButton
          onPress={
            userId === user?.uid
              ? () => router.push(`/edit-plant/${plantId}`)
              : handleContact
          }
        >
          {userId === user?.uid ? "Ändra" : "Kontakta"}
        </DefaultButton>
      </View>

      {userId !== user?.uid ? (
        <View style={styles.uploaderInfo}>
          <Image
            style={styles.profileImage}
            source={
              userProfileImageUrl
                ? { uri: userProfileImageUrl }
                : require("../../../assets/profilePicture.png")
            }
          />
          <Pressable onPress={() => router.push(`/view-profile/${userId}`)}>
            <Text style={styles.uploaderName}>{userProfileName}</Text>
          </Pressable>
        </View>
      ) : null}
{userId === user?.uid && id && plantName && user?.uid && (
      <GiveAwayPlant 
  plantId={id} 
  plantName={plantName} 
  userId={user?.uid!} 
/>
 )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: Colors.secondary,
    marginBottom: 60,
  },
  buttonContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.xl,
  },
  uploaderInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.l,
    marginVertical: Spacing.s,
  },
  uploaderName: {
    fontSize: Typography.fontSize.l,
    textDecorationLine: "underline",
    fontWeight: Typography.fontWeight.semibold,
  },
  profileImage: {
    width: 40,
    aspectRatio: 1,
    borderRadius: BorderRadius.full,
    margin: Spacing.s,
    alignSelf: "center",
  },
});
