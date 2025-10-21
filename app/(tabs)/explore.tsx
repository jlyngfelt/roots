import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { getOtherUsersPlants } from "@/services/plantService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {Plant} from "../../interfaces/index"
import { Select, XStack, Button } from 'tamagui';


export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  type SortOption = 'nameAsc' | 'nameDesc' | 'newest' | 'oldest' | 'distance';

  const getSortedPlants = (plants: Plant[], sortOption: SortOption) => {
  const sorted = [...plants];

  switch (sortOption) {
    case 'nameAsc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'nameDesc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    
    case 'newest':
      return sorted.sort((a, b) => 
        b.createdAt?.toMillis() - a.createdAt?.toMillis()
      );
    
    case 'oldest':
      return sorted.sort((a, b) => 
        a.createdAt?.toMillis() - b.createdAt?.toMillis()
      );
    
    // case 'distance':
    //   return sorted.sort((a, b) => 
    //     (a.distance || Infinity) - (b.distance || Infinity)
    //   );
    
    default:
      return sorted;
  }
};

const sortedPlants = getSortedPlants(plants, sortBy);

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

<XStack gap="$2" flexWrap="wrap" padding="$2">
  <Button 
    size="$3"
    onPress={() => setSortBy('newest')}
    theme={sortBy === 'newest' ? 'active' : undefined}
  >
    Senaste
  </Button>
  <Button 
    size="$3"
    onPress={() => setSortBy('oldest')}
    theme={sortBy === 'oldest' ? 'active' : undefined}
  >
    Äldsta
  </Button>
  <Button 
    size="$3"
    onPress={() => setSortBy('nameAsc')}
    theme={sortBy === 'nameAsc' ? 'active' : undefined}
  >
    A-Ö
  </Button>
  <Button 
    size="$3"
    onPress={() => setSortBy('nameDesc')}
    theme={sortBy === 'nameDesc' ? 'active' : undefined}
  >
    Ö-A
  </Button>

</XStack>



      <View style={styles.feed}>
        {sortedPlants.map((plant) => (
          <ProductCard
          key={plant.id}
          variant="big"
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
  feed: {
    flexDirection: "column",
    marginBottom: 80,
  },
});
