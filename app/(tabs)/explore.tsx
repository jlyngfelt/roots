import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { getOtherUsersPlants } from "@/services/plantService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useAuth } from "../../contexts/AuthContext";


export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   interface Plant {
    id: string;
    name: string;
    description?: string;
    readyToAdopt: boolean;
    userId: string;
    categoryId?: string;
    imageUrl: string;
  }

  useEffect(() => {
    if (user?.uid) {
      async function fetchPlants() {
        try {
          setLoading(true);
          if (!user?.uid) return;
          const otherPlants = await getOtherUsersPlants(user.uid);
          setPlants(otherPlants);
        } catch (err: any) {
          setError(err.message);
          console.error("Error fetching plants:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchPlants();
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  return (
    <ScrollView>
      <Text style={{ fontSize: 50, padding: 40 }}>EXPLORE</Text>

      {/* {plants.map((plant) => (
          <View key={plant.id}>
            <Text>{plant.name}</Text>
            <Text>Ready to adopt: {plant.readyToAdopt ? "Yes" : "No"}</Text>
            <FavoriteButton userId={user?.uid!} plantId={plant.id} />
          <ReadyToAdopt readyToAdopt={plant.readyToAdopt} />
          </View>
        ))} */}

      <View style={styles.feed}>
        {plants.map((plant) => (
          <Pressable onPress={() => router.push("/view-plant/[plantId]")}>

          <ProductCard
          variant="big"
          key={plant.id}
          userId={user?.uid!}
          plantId={plant.id}
          name={plant.name}
          description={plant.description}
          image={plant.imageUrl}
          readyToAdopt={plant.readyToAdopt}
          />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  feed: {
    flexDirection: "column",
    marginBottom: 80,
  },
});
