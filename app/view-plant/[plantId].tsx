import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { BorderRadius, Spacing, Typography, Colors } from "@/constants/design-system";
import { getPlantById } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
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

  useEffect(() => {
    if (userId) {
      async function fetchProfile() {
        const userProfile: any = await getUserProfile(userId);
        if (userProfile) {
          setUserProfileName(userProfile.username || "");
          setUserProfileImageUrl(userProfile.profileImageUrl || "");
        }
      }
      fetchProfile();
    }
  }, [userId]);

  return (
    <>
      <ScrollView>
        <ProductCard
          variant="view"
          userId={user?.uid!}
          plantId={id}
          name={plantName}
          description={description}
          image={imageUrl}
          readyToAdopt={readyToAdopt}
        ></ProductCard>
        <View style={styles.buttonContainer}>
          <DefaultButton onPress={() => router.push(`/edit-plant/${plantId}`)}>
            {userId === user?.uid ? "Ändra" : "Kontakta"}
          </DefaultButton>
        </View>
{userId !== user?.uid ?
        <View style={styles.uploaderInfo}>
          <Image
            style={styles.profileImage}
            source={{ uri: userProfileImageUrl }}
          />
          <Text style={styles.uploaderName}>{userProfileName}</Text>
        </View> : " "}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.xl,
  },
  uploaderInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.l,
    marginVertical: Spacing.s
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
