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
    
      <View style={[variant === "big" ? styles.cardBig : styles.cardSmall]}>
          <Image style={[styles.image, variant === "big" ? styles.imageBig : styles.imageSmall]} source={{ uri: image }} />
       
        <View style={styles.cardInfo}>
          <View style={styles.texts}>
            <Text style={variant === "big" ? Styles.heading1 : Styles.heading2}>{name}</Text>
          </View>

          <View style={styles.icons}>
            <ReadyToAdopt readyToAdopt={readyToAdopt || false} />
            <FavoriteButton userId={userId} plantId={plantId} />
          </View>
          </View>
            {description && (
                <Text style={[styles.description, variant === "big" ? Styles.bodyM : Styles.bodyS]}>{description}</Text>
            )}
      </View>
    
  );
};

const styles = StyleSheet.create({
cardBig: {
    marginVertical: Spacing.m,
    marginHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl
},
cardSmall: {
        backgroundColor: Colors.secondary,
        width: "47%",
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
  imageBig: {},
  imageSmall: {},
  description: {
    marginVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
  },
  cardInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
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
