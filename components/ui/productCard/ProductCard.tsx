import { Image, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "tamagui";
import { Colors, Spacing } from "../../../constants/design-system";
import { FavoriteButton } from "../buttons/FavouriteButton";
import { ReadyToAdopt } from "../buttons/ReadyToAdopt";

interface ProductCardProps {
  userId: string;
  plantId: string;
  name: string;
  description?: string;
  image?: string;
  readyToAdopt?: boolean;
  variant?: "big" | "small";
}

export const ProductCard = ({
  userId,
  plantId,
  name,
  description,
  image,
  readyToAdopt,
  variant = "small",
}: ProductCardProps) => {
  return (
    
      <View style={styles.card}>
        {image ? (
          <Image style={styles.image} source={{ uri: image }} />
        ) : (
          <View style={styles.noImage}>
            <Text style={{ color: "white" }}>Ingen bild</Text>
          </View>
        )}
        <View style={styles.cardInfo}>
          <View style={styles.texts}>
            <Text style={styles.name}>{name}</Text>
          </View>

          <View style={styles.icons}>
            <ReadyToAdopt readyToAdopt={readyToAdopt || false} />
            <FavoriteButton userId={userId} plantId={plantId} />
          </View>
          </View>
            {description && (
                <Text style={styles.description}>{description}</Text>
            )}
      </View>
    
  );
};

const styles = StyleSheet.create({

  card: {
    width: "47%",
    backgroundColor: Colors.primary,
    padding: Spacing.s,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 2,
  },
  image: {
    width: "95%",
    height: 100,
    borderRadius: 16,
    margin: Spacing.s,
    alignSelf: "center",
  },
  noImage: {
    width: 240,
    height: 240,
    padding: 40,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.s,
    width: "100%",
  },
  texts: {
    flexDirection: "column",
  },
  icons: {
    flexDirection: "row",
    gap: Spacing.s,
  },
});
