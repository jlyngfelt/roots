import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { BorderRadius, Spacing, Styles } from "@/constants/design-system";
import { getUserPlants } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function ViewProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [credits, setCredits] = useState(0);
  const [plants, setPlants] = useState<any[]>([]);
  const [readyToAdoptPlants, setReadyToAdoptPlants] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(true)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  useEffect(() => {
    if (userId) {
      async function fetchProfile() {
        try {
          setLoading(true);
          const userProfile: any = await getUserProfile(userId);
          if (userProfile) {
            setUsername(userProfile.username || "");
            setBio(userProfile.bio || "");
            setProfileImageUrl(userProfile.profileImageUrl || "");
            setCredits(userProfile.credits || 0);
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

          const readyPlants = userPlants.filter(plant => plant.readyToAdopt === true);
          setReadyToAdoptPlants(readyPlants);
        } catch (err) {
          console.error("Error fetching plants:", err);
        }
      }
      fetchPlants();
    }
  }, [userId]);



  return (
    <ScrollView>
      <View style={styles.profileInfo}>
        <Image style={styles.profileImage} source={{ uri: profileImageUrl }} />
        <View style={styles.profileWrapper}>
        <View style={styles.profileText}>
          <Text style={Styles.heading2}>{username}</Text>
          <Text style={Styles.bodyXL}>Credits: {credits}</Text>
          <Text style={Styles.bodyXS}>{bio}</Text>
        </View>
          <DefaultButton>Kontakta</DefaultButton>
          <DefaultButton
          onPress={() =>setShowAll(true)}>Alla plantor</DefaultButton>
          <DefaultButton onPress={() =>setShowAll(false)}>Redo att adopteras</DefaultButton>
        </View>
      </View>


{showAll ?
      <View style={styles.feed}>
        {plants.map((plant) => (
          <ProductCard
            key={plant.id}
            variant="small"
            userId={user?.uid!}
            plantId={plant.id}
            name={plant.name}
            description={plant.description}
            image={plant.imageUrl}
            readyToAdopt={plant.readyToAdopt}
            onPress={() => router.push(`/view-plant/${plant.id}`)}
          />
        ))}
      </View>
:
      <View style={styles.feed}>
        {readyToAdoptPlants.map((plant) => (
          <ProductCard
            key={plant.id}
            variant="small"
            userId={user?.uid!}
            plantId={plant.id}
            name={plant.name}
            description={plant.description}
            image={plant.imageUrl}
            readyToAdopt={plant.readyToAdopt}
            onPress={() => router.push(`/view-plant/${plant.id}`)}
          />
        ))}
      </View> }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  feed: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 80,
  },
  profileInfo: {
    flexDirection: "row",
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing["2xl"],
    gap: Spacing.m
  },
  profileImage: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: BorderRadius.xl,
  },
profileWrapper: {
    height: 240,
    gap: Spacing.m,
    justifyContent: "space-between"
},
  profileText: {
    gap: Spacing.m,
    justifyContent: "flex-start",
  },
});
