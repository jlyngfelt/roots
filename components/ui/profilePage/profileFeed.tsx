import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { StyleSheet, View, useWindowDimensions } from "react-native";
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
            <View style={styles.filler} />
      <View style={styles.filler} />
    </View>
  );
}

const styles = StyleSheet.create({
  feed: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 70,
    paddingHorizontal: 10,
  },
    filler: {
    width: "45%", 
    height: 0,
  },
});