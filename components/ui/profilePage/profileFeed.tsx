import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { StyleSheet, View } from "react-native";
import { Plant } from "../../../interfaces/index";

interface ProfileFeedProps {
  plants: Plant[];
  userId: string;
  onPlantPress: (plantId: string) => void;
}

export function ProfileFeed({
  plants,
  userId,
  onPlantPress,
}: ProfileFeedProps) {
  return (
    <View style={styles.feed}>
      {plants.map((plant) => (
        <ProductCard
          key={plant.id}
          variant="small" 
          userId={plant.userId}
          plantId={plant.id}
          name={plant.name}
          description={plant.description}
          image={plant.imageUrl}
          readyToAdopt={plant.readyToAdopt}
          onPress={() => onPlantPress(plant.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  feed: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 70
  },
});