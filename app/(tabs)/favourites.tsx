import { Colors } from "@/constants/design-system";
import { getUserFavorites } from "@/services/favoritesService";
import { getPlantById } from "@/services/plantService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Plant } from "../../interfaces/index";
import { ProfileFeed } from "@/components/ui/profilePage/profileFeed";

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const favoritePlantIds = await getUserFavorites(user.uid);
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
  };

  useEffect(() => {
    if (user?.uid) {
      fetchFavorites();
    }
  }, [user?.uid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  };

  return (

    <ScrollView
      style={styles.bgColor}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.accent]}
          tintColor={Colors.accent}
        />
      }

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
