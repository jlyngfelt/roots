import { FavoriteButton } from "@/components/ui/buttons/FavouriteButton";
import { getUserFavorites } from "@/services/favoritesService";
import { getPlantById } from "@/services/plantService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { ProductCard } from "@/components/ui/productCard/ProductCard";

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  interface Plant {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    categoryId?: string;
    readyToAdopt?: boolean;
    userId?: string;
    adoptedBy?: string | null;
    createdAt?: any;
  }

  useEffect(() => {
    if (user?.uid) {
      async function fetchFavorites() {
        try {
          setLoading(true);
          const favoritePlantIds = await getUserFavorites(user?.uid);
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
    <ScrollView>
      <Text style={{ fontSize: 50, padding: 40 }}>FAVORITES</Text>

<View style={styles.feed}>
        {plants.map((plant) => (
          <ProductCard
          key={plant.id}
          userId={user?.uid!}
          plantId={plant.id}
          name={plant.name}
          description={plant.description}
          image={plant.imageUrl}
          readyToAdopt={plant.readyToAdopt}
          />
        ))}
        </View>
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
});