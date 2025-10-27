import { Colors } from "@/constants/design-system";
import { getUserFavorites } from "@/services/favoritesService";
import { getPlantById } from "@/services/plantService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Plant } from "../../interfaces/index";
import { ProfileFeed } from "@/components/ui/profilePage/profileFeed";

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      async function fetchFavorites() {
        try {
          setLoading(true);
          const favoritePlantIds = await getUserFavorites(user?.uid!);
          const plantPromises = favoritePlantIds.map((plantId) =>
            getPlantById(plantId)
          );
          const plantData = await Promise.all(plantPromises);

          const validPlants = plantData.filter((plant) => plant !== null);

          setPlants(validPlants);
        } catch (err: any) {
          setError(err.message);
          console.error("Error fetching favorites:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchFavorites();
    }
  }, [user?.uid]);

  return (
    <ScrollView style={styles.bgColor}>
      <ProfileFeed
        plants={plants}
        userId={user?.uid!}
        onPlantPress={(plantId) => router.push(`/view-plant/${plantId}`)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bgColor: {
    backgroundColor: Colors.secondary,
  },
  feed: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 80,
  },
});
