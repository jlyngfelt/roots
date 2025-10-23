import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { BorderRadius, Spacing, Typography } from "@/constants/design-system";
import { db } from "@/firebaseConfig";
import { getPlantById } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/design-system";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function ViewPlantScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [readyToAdopt, setReadyToAdopt] = useState(false);
  const [id, setId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userId, setUserId] = useState("");
  const [userProfileName, setUserProfileName] = useState("");
  const [userProfileImageUrl, setUserProfileImageUrl] = useState("");
  const [userProfileLat, setUserProfileLat] = useState("");
  const [userProfileLon, setUserProfileLon] = useState("");
  const [plantOwnerLat, setPlantOwnerLat] = useState("");
  const [plantOwnerLon, setPlantOwnerLon] = useState("");
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
          setUserId(plant.userId || "");
        }
      }
      fetchPlant();
    }
  }, [user?.uid]);

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

  return (
    <>
      <ScrollView style={styles.bgColor}>
        <ProductCard
          variant="view"
          userId={user?.uid!}
          plantId={id}
          name={plantName}
          description={description}
          image={imageUrl}
          readyToAdopt={readyToAdopt}
          userLat={userProfileLat}
          userLon={userProfileLon}
          plantOwnerLat={plantOwnerLat}
          plantOwnerLon={plantOwnerLon}
        ></ProductCard>
        <View style={styles.buttonContainer}>
          <DefaultButton onPress={() => router.push(`/edit-plant/${plantId}`)}>
            {userId === user?.uid ? "Ändra" : "Kontakta"}
          </DefaultButton>
        </View>
        {userId !== user?.uid ? (
          <View style={styles.uploaderInfo}>
            <Image
              style={styles.profileImage}
              source={{ uri: userProfileImageUrl }}
            />
            <Pressable onPress={() => router.push(`/view-profile/${userId}`)}>
              <Text style={styles.uploaderName}>{userProfileName}</Text>
            </Pressable>
          </View>
        ) : (
          " "
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: Colors.secondary,
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
