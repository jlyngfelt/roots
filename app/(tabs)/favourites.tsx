import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { Colors } from "@/constants/design-system";
import { getUserFavorites } from "@/services/favoritesService";
import { getPlantById } from "@/services/plantService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Plant } from "../../interfaces/index";

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
      <Text style={{ fontSize: 50, padding: 40 }}>FAVORITES</Text>

      <View style={styles.feed}>
        {plants.map((plant) => (
          <ProductCard
            variant="small"
            key={plant.id}
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
