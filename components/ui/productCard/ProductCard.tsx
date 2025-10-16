import { Image, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "tamagui";
import { Colors, Spacing, BorderRadius, Styles, Typography } from "../../../constants/design-system";
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
          <Image style={styles.image} source={{ uri: image }} />
       
        <View style={styles.cardInfo}>
          <View style={styles.texts}>
            <Text style={Styles.heading2}>{name}</Text>
          </View>

          <View style={styles.icons}>
            <ReadyToAdopt readyToAdopt={readyToAdopt || false} />
            <FavoriteButton userId={userId} plantId={plantId} />
          </View>
          </View>
            {description && (
                <Text style={[styles.description, Styles.bodyS]}>{description}</Text>
            )}
      </View>
    
  );
};

const styles = StyleSheet.create({

  card: {
    width: "47%",
    backgroundColor: Colors.secondary,
    padding: Spacing.s,
    borderRadius: BorderRadius.m,
    marginVertical: 5,
    marginHorizontal: 2,
  },
  image: {
    width: "95%",
    aspectRatio: 4/5,
    borderRadius: BorderRadius.xl,
    margin: Spacing.s,
    alignSelf: "center",
  },
  description: {
    marginVertical: Spacing.s,
    paddingHorizontal: Spacing.s,
  },
  cardInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: Spacing.s,
    width: "100%",
    gap: Spacing.s
  },
  texts: {
    flexDirection: "column",
  },
  icons: {
    flexDirection: "row",
    gap: Spacing.s,
    alignItems: "center"
  },
});
