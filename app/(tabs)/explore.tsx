import { FavoriteButton } from "@/components/ui/buttons/FavouriteButton";
import { getOtherUsersPlants } from "@/services/plantService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { ReadyToAdopt } from "@/components/ui/buttons/ReadyToAdopt";

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
    // fyll på här med resten av våra fält
  }


  useEffect(() => {
    if (user?.uid) {
      async function fetchPlants() {
        try {
          setLoading(true);
          const otherPlants = await getOtherUsersPlants(user?.uid);
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
    <>
      <ScrollView>
        <Text style={{ fontSize: 50, padding: 40 }}>EXPLORE</Text>

        {plants.map((plant) => (
          <View key={plant.id}>
            <Text>{plant.name}</Text>
            <Text>Ready to adopt: {plant.readyToAdopt ? "Yes" : "No"}</Text>
            <FavoriteButton userId={user?.uid!} plantId={plant.id} />
          <ReadyToAdopt readyToAdopt={plant.readyToAdopt} />
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
