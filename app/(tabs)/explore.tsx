import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { Colors } from "@/constants/design-system";
import { getOtherUsersPlants } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { calculateDistance } from "@/utils/distanceCalculator";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { Button, XStack } from "tamagui";
import { useAuth } from "../../contexts/AuthContext";
import {
  Category,
  Coordinates,
  PlantWithDistance,
} from "../../interfaces/index";
import { getCategories } from "../../services/categoryService";
import { DefaultSelect } from "@/components/ui/forms/DefaultSelect";
import { FilterSelect } from "@/components/ui/forms/FilterSelect";

type SortOption = "nameAsc" | "nameDesc" | "newest" | "oldest" | "distance";

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plants, setPlants] = useState<PlantWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [showOnlyReadyToAdopt, setShowOnlyReadyToAdopt] = useState(false);
  const [myCoordinates, setMyCoordinates] = useState<Coordinates | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  
  const fetchPlantsWithDistance = async () => {
    if (!user?.uid || !myCoordinates) return;

    try {
      setLoading(true);
      const allPlants = await getOtherUsersPlants(user.uid);

      const plantsWithDistance: PlantWithDistance[] = await Promise.all(
        allPlants.map(async (plant) => {
          const ownerProfile = await getUserProfile(plant.userId);

          const distance =
            ownerProfile?.lat && ownerProfile?.lon
              ? calculateDistance(
                  myCoordinates.lat,
                  myCoordinates.lon,
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
  };


  useEffect(() => {
    async function fetchCategories() {
      const categories = await getCategories();
      setCategories(categories);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    async function fetchMyCoordinates() {
      const profile = await getUserProfile(user?.uid!);
      if (profile?.lat && profile?.lon) {
        setMyCoordinates({
          lat: profile.lat,
          lon: profile.lon,
        });
      }
    }
    fetchMyCoordinates();
  }, [user?.uid]);

  useEffect(() => {
    fetchPlantsWithDistance();
  }, [user?.uid, myCoordinates]);


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlantsWithDistance();
    setRefreshing(false);
  };

  
  const getFilteredPlants = (
    plants: PlantWithDistance[],
    categoryFilter: string,
    onlyReadyToAdopt: boolean
  ): PlantWithDistance[] => {
    let filtered = plants;

    if (onlyReadyToAdopt) {
      filtered = filtered.filter((plant) => plant.readyToAdopt === true);
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (plant) => plant.categoryId === categoryFilter
      );
    }

    return filtered;
  };


  const getSortedPlants = (
    plants: PlantWithDistance[],
    sortOption: SortOption
  ): PlantWithDistance[] => {
    const sorted = [...plants];

    switch (sortOption) {
      case "nameAsc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));

      case "nameDesc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));

      case "newest":
        return sorted.sort(
          (a, b) =>
            (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
        );

      case "oldest":
        return sorted.sort(
          (a, b) =>
            (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0)
        );

      case "distance":
        return sorted.sort(
          (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
        );

      default:
        return sorted;
    }
  };

  // Filtrera och sortera
  const filteredPlants = getFilteredPlants(
    plants,
    filterBy,
    showOnlyReadyToAdopt
  );
  const sortedAndFilteredPlants = getSortedPlants(filteredPlants, sortBy);


  const sortData = [
  { label: "Närmast", value: "distance" },
  { label: "Senaste", value: "newest" },
  { label: "Äldsta", value: "oldest" },
  { label: "A-Ö", value: "nameAsc" },
  { label: "Ö-A", value: "nameDesc" },
];

const [filter, setFilter] = useState({
  readyToAdopt: false,
  categoryId: "all"
});
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
    >

<FilterSelect 
  value={filter}
  onValueChange={setFilter}
  placeholder="Filtrera"
/>

<DefaultSelect 
  value={sortBy} 
  onValueChange={(value) => setSortBy(value as SortOption)}
  data={sortData}
/>

      {/* Feed */}
      <View style={styles.feed}>
        {sortedAndFilteredPlants.map((plant) => (
          <ProductCard
            key={plant.id}
            variant="big"
            userId={plant.userId}
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
    flexDirection: "column",
    marginBottom: 80,
    backgroundColor: Colors.secondary,
  },
  acitve: {
    backgroundColor: "rgb(0, 128, 0)",
  },
  inactive: {
    backgroundColor: "#313170",
  },
});