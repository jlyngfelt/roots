import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { Colors, Spacing, Styles } from "@/constants/design-system";
import { db } from "@/firebaseConfig";
import { createChat, getChatBetweenUsers } from "@/services/chatService";
import { getPlantById } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GiveAwayPlant } from "../../../components/GiveAwayPlant";
import { useAuth } from "../../../contexts/AuthContext";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    setPlantName("");
    setDescription("");
    setReadyToAdopt(false);
    setId("");
    setImageUrl("");
    setImageUrls([]);
    setUserId("");
    setUserProfileName("");
    setUserProfileImageUrl("");
    setPlantOwnerLat(0);
    setPlantOwnerLon(0);
    setLoading(true);

    if (user?.uid && plantId) {
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
        setLoading(false);
      }
      fetchPlant();
    }
  }, [user?.uid, plantId]);

  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userProfile = docSnap.data();
        setUserProfileName(userProfile.username || "");
        setUserProfileImageUrl(userProfile.profileImageUrl || "");
        setPlantOwnerLat(userProfile.lat || 0);
        setPlantOwnerLon(userProfile.lon || 0);
      }
    });

    return () => unsubscribe();
  }, [userId, plantId]);

  useEffect(() => {
    if (user?.uid) {
      async function fetchProfile() {
        const profile = await getUserProfile(user?.uid!);
        if (profile) {
          setUserProfileLat(profile.lat || 0);
          setUserProfileLon(profile.lon || 0);
        }
      }
      fetchProfile();
    }
  }, [user?.uid]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const plant = await getPlantById(plantId);
        if (plant?.categoryId) {
          const categoryDoc = await getDoc(
            doc(db, "categories", plant.categoryId)
          );
          if (categoryDoc.exists()) {
            setCategoryName(categoryDoc.data().name);
          }
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    if (plantId) {
      fetchCategoryName();
    }
  }, [plantId]);

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

  if (loading) {
    return (
      <View
        style={[
          styles.bgColor,
          { justifyContent: "center", alignItems: "center", flex: 1 },
        ]}
      >
        <Text>Laddar...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.bgColor}>
      {error && <Text style={Styles.actionL}>{error}</Text>}
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
        categoryName={categoryName}
      />

      <View style={styles.buttonContainer}>
        <DefaultButton
          style={styles.button}
          onPress={
            userId === user?.uid
              ? () => router.push(`/edit-plant/${plantId}`)
              : handleContact
          }
        >
          {userId === user?.uid ? "Ändra" : "Kontakta"}
        </DefaultButton>
        {userId === user?.uid && id && plantName && user?.uid ? (
          <GiveAwayPlant
            plantId={id}
            plantName={plantName}
            userId={user?.uid!}
          />
        ) : (
          <DefaultButton
            onPress={() => router.push("/scanner")}
            variant="secondary"
          >
            Föreslå byte
          </DefaultButton>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: Colors.secondary,
  },
  button: {
    width: 136,
  },
  buttonContainer: {
    marginBottom: 100,
    marginTop: 24,
    width: "100%",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.xl,
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
});
