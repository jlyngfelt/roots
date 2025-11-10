import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { DefaultSelect } from "@/components/ui/selects/DefaultSelect";
import { FilterSelect } from "@/components/ui/selects/FilterSelect";
import { Colors, Styles } from "@/constants/design-system";
import { db } from "@/firebaseConfig";
import { getOtherUsersPlants } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { calculateDistance } from "@/utils/distanceCalculator";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SearchInput } from "../../components/ui/inputs/SearchInput";
import { useAuth } from "../../contexts/AuthContext";
import {
  Category,
  Coordinates,
  PlantWithDistance,
} from "../../interfaces/index";
import { getCategories } from "../../services/categoryService";

type SortOption = "nameAsc" | "nameDesc" | "newest" | "oldest" | "distance";

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plants, setPlants] = useState<PlantWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filter, setFilter] = useState({
    readyToAdopt: false,
    categoryId: "all",
  });
  const [myCoordinates, setMyCoordinates] = useState<Coordinates | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPlantsWithDistanceAndUser = async () => {
    if (!user?.uid || !myCoordinates) return;

    try {
      setLoading(true);
      const allPlants = await getOtherUsersPlants(user.uid);

      const plantsWithDistanceAndUser: PlantWithDistance[] = await Promise.all(
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

          let categoryName = "";
          if (plant.categoryId) {
            const categoryDoc = await getDoc(
              doc(db, "categories", plant.categoryId)
            );
            if (categoryDoc.exists()) {
              categoryName = categoryDoc.data().name;
            }
          }

          return {
            ...plant,
            distance,
            username: ownerProfile?.username,
            ownerProfileImageUrl: ownerProfile?.profileImageUrl || "",
            categoryName,
          };
        })
      );

      setPlants(plantsWithDistanceAndUser);
    } catch (err: any) {
      setError("Fel vid hämtande av plantor");
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
    fetchPlantsWithDistanceAndUser();
  }, [user?.uid, myCoordinates]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlantsWithDistanceAndUser();
    setRefreshing(false);
  };

  const getSearchedPlants = (plants: PlantWithDistance[], query: string) => {
    if (!query.trim()) return plants;

    const lowerQuery = query.toLowerCase();

    return plants.filter((plant) => {
      const nameMatch = plant.name.toLowerCase().includes(lowerQuery);
      const usernameMatch = plant.username?.toLowerCase().includes(lowerQuery);

      return nameMatch || usernameMatch;
    });
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

  const searchedPlants = getSearchedPlants(plants, searchQuery);

  const filteredPlants = getFilteredPlants(
    searchedPlants,
    filter.categoryId,
    filter.readyToAdopt
  );
  const finalPlants = getSortedPlants(filteredPlants, sortBy);

  const sortData = [
    { label: "Närmast", value: "distance" },
    { label: "Senaste", value: "newest" },
    { label: "Äldsta", value: "oldest" },
    { label: "A-Ö", value: "nameAsc" },
    { label: "Ö-A", value: "nameDesc" },
  ];

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
      {error && (
        <Text style={[Styles.actionL, { textAlign: "center", marginTop: 10 }]}>
          {error}
        </Text>
      )}

      {loading ? (
        <Text style={[Styles.bodyXL, { textAlign: "center", marginTop: 20 }]}>
          Laddar flöde...
        </Text>
      ) : (
        <>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Sök plantor eller användare..."
          />

          <View style={styles.filterAndSort}>
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
          </View>

          <View style={styles.feed}>
            {finalPlants.map((plant) => (
              <ProductCard
                key={plant.id}
                variant="big"
                userId={plant.userId}
                plantId={plant.id}
                name={plant.name}
                description={plant.description}
                image={plant.imageUrl}
                imageUrls={plant.imageUrls}
                categoryName={plant.categoryName}
                readyToAdopt={plant.readyToAdopt}
                onPress={() => router.push(`/view-plant/${plant.id}`)}
              />
            ))}
          </View>
        </>
      )}
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
  filterAndSort: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 15,
    gap: 20,
  },
});
