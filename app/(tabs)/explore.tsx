import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { getOtherUsersPlants } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { getCategories } from "../../services/categoryService"
import { calculateDistance } from "@/utils/distanceCalculator";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Plant } from "../../interfaces/index";
import { XStack, Button, Text } from 'tamagui';
import { Coordinates, PlantWithDistance, Category} from "../../interfaces/index"
import { DefaultButton } from "@/components/ui/buttons/DefaultButton";

type SortOption = 'nameAsc' | 'nameDesc' | 'newest' | 'oldest' | 'distance';

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plants, setPlants] = useState<PlantWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<string>('all'); // LADE TILL DENNA!
  const [showOnlyReadyToAdopt, setShowOnlyReadyToAdopt] = useState(false);
  const [myCoordinates, setMyCoordinates] = useState<Coordinates | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Hämta kategorier
  useEffect(() => {
    async function fetchCategories() {
      const categories = await getCategories();
      setCategories(categories);
    }
    fetchCategories();
  }, []);

  // Hämta mina koordinater
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

  // Hämta plantor med distance
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

  // Filtreringsfunktion
  const getFilteredPlants = (
    plants: PlantWithDistance[], 
    categoryFilter: string,
    onlyReadyToAdopt: boolean
  ): PlantWithDistance[] => {
    let filtered = plants;

    if (onlyReadyToAdopt) {
      filtered = filtered.filter(plant => plant.readyToAdopt === true);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(plant => plant.categoryId === categoryFilter);
    }

    return filtered;
  };

  // Sorteringsfunktion
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

  // Filtrera och sortera
  const filteredPlants = getFilteredPlants(plants, filterBy, showOnlyReadyToAdopt);
  const sortedAndFilteredPlants = getSortedPlants(filteredPlants, sortBy);

  return (
    <ScrollView>
      <View>
        <Button 
          onPress={() => setShowOnlyReadyToAdopt(!showOnlyReadyToAdopt)}
          style={showOnlyReadyToAdopt ? styles.acitve : styles.inactive}
        >
          {showOnlyReadyToAdopt ? '✓ Redo att adopteras' : 'Redo att adopteras'}
        </Button>
      </View>

        <XStack gap="$2" padding="$2">
          <Button 
            size="$2"
            onPress={() => setFilterBy('all')}
            theme={filterBy === 'all' ? 'active' : undefined}
          >
            Alla
          </Button>
          {categories.map((category) => (
            <Button 
              key={category.id}
              size="$2"
              onPress={() => setFilterBy(category.id)}
              theme={filterBy === category.id ? 'active' : undefined}
            >
              {category.name}
            </Button>
          ))}
        </XStack>


      {/* Sorteringsknappar */}
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

      {/* Feed */}
      <View style={styles.feed}>
        {sortedAndFilteredPlants.map((plant) => (
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
  acitve: {
    backgroundColor: 'rgb(0, 128, 0)',
  },
  inactive: {
    backgroundColor: '#313170',
  }
});