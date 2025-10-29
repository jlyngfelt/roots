import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { BorderRadius, Colors, Spacing, Styles } from "../../../constants/design-system";
import { ProductCardProps } from "../../../interfaces/index";
import { useProductCardLogic } from "./useProductCardLogic";
import { CardActions, CardInfo } from "./ProductCardContent";

export const ProductCardSmall = ({
  userId,
  plantId,
  name,
  description,
  image,
  readyToAdopt,
  plantOwnerLat = 0,
  plantOwnerLon = 0,
  userLat = 0,
  userLon = 0,
  imageUrls,
  onPress,
}: Omit<ProductCardProps, "variant">) => {
  const { showFavoriteButton, user } = useProductCardLogic({
    userId,
    userLat,
    userLon,
    plantOwnerLat,
    plantOwnerLon,
    image,
    imageUrls,
  });

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={{ width: "100%" }}>
        <Image style={styles.image} source={{ uri: image }} resizeMode="cover" />

        <CardActions
          showFavoriteButton={showFavoriteButton}
          userId={user?.uid}
          plantId={plantId}
          readyToAdopt={readyToAdopt || false}
          style={styles.icons}
        />

        <CardInfo
          name={name}
          headingStyle={[Styles.heading3, styles.plantName]}
          textContainerStyle={styles.cardInfo}
          numberOfLines={2}
        />

        {description && (
          <Text style={[styles.description, Styles.bodyS]}>{description}</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.secondary,
    width: "47%",
    padding: Spacing.s,
    borderRadius: BorderRadius.m,
    marginVertical: 5,
    marginHorizontal: 2,
  },
  image: {
    width: "95%",
    aspectRatio: 4 / 5,
    borderRadius: BorderRadius.xl,
    margin: Spacing.s,
    alignSelf: "center",
  },
  description: {
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  cardInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.xs,
    paddingTop: Spacing.s,
    width: "100%",
    gap: Spacing.s,
  },
  plantName: {
    minHeight: 20,
  },
  icons: {
    flexDirection: "row",
    gap: Spacing.s,
    alignItems: "flex-end",
    paddingHorizontal: Spacing.xs,
    width: "100%",
  },
});