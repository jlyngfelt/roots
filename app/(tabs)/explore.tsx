import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { getOtherUsersPlants } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { calculateDistance } from "@/utils/distanceCalculator";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Plant } from "../../interfaces/index";
import { XStack, Button, Text } from 'tamagui';
import { Coordinates, PlantWithDistance} from "../../interfaces/index"


type SortOption = 'nameAsc' | 'nameDesc' | 'newest' | 'oldest' | 'distance';

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plants, setPlants] = useState<PlantWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [myCoordinates, setMyCoordinates] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    async function fetchMyCoordinates() {
      const profile = await getUserProfile(user?.uid!);
      if (profile?.lat && profile?.lon) {
        setMyCoordinates({
          lat: profile.lat,
          lon: profile.lon
        });
      }
    }
    fetchMyCoordinates();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || !myCoordinates) return;

    async function fetchPlantsWithDistance() {
      try {
        setLoading(true);
        const allPlants = await getOtherUsersPlants(user?.uid!);

        const plantsWithDistance: PlantWithDistance[] = await Promise.all(
          allPlants.map(async (plant) => {
            const ownerProfile = await getUserProfile(plant.userId);
            
            const distance = (ownerProfile?.lat && ownerProfile?.lon)
              ? calculateDistance(
                  myCoordinates!.lat,
                  myCoordinates!.lon,
                  ownerProfile.lat,
                  ownerProfile.lon
                )
              : null;
            
            return { ...plant, distance };
          })
        );
        
        setPlants(plantsWithDistance);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching plants:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPlantsWithDistance();
  }, [user?.uid, myCoordinates]);

  const getSortedPlants = (
    plants: PlantWithDistance[], 
    sortOption: SortOption
  ): PlantWithDistance[] => {
    const sorted = [...plants];

    switch (sortOption) {
      case 'nameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'nameDesc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      
      case 'newest':
        return sorted.sort((a, b) => 
          (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
        );
      
      case 'oldest':
        return sorted.sort((a, b) => 
          (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
        );
      
      case 'distance':
        return sorted.sort((a, b) => 
          (a.distance || Infinity) - (b.distance || Infinity)
        );
      
      default:
        return sorted;
    }
  };

  const sortedPlants = getSortedPlants(plants, sortBy);

  return (
    <ScrollView>
      
      <XStack gap="$2" flexWrap="wrap" padding="$2">
        <Button 
          size="$3"
          onPress={() => setSortBy('distance')}
          theme={sortBy === 'distance' ? 'active' : undefined}
        >
          Närmast
        </Button>
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