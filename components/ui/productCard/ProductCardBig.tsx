import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { BorderRadius, Spacing, Styles } from "../../../constants/design-system";
import { ProductCardProps } from "../../../interfaces/index";
import { useProductCardLogic } from "./useProductCardLogic";
import { CardActions, CardInfo, ImageCarousel } from "./ProductCardContent";

export const ProductCardBig = ({
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
  const {
    images,
    hasMultipleImages,
    showFavoriteButton,
    activeIndex,
    handleScroll,
    scrollViewRef,
    user,
  } = useProductCardLogic({
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
      {hasMultipleImages ? (
        <>
        <Pressable onPress={onPress} style={{ width: "100%" }}>

          <ImageCarousel
            images={images}
            activeIndex={activeIndex}
            scrollViewRef={scrollViewRef}
            onScroll={handleScroll}
            imageStyle={styles.image}
            />

          <CardActions
            showFavoriteButton={showFavoriteButton}
            userId={user?.uid}
            plantId={plantId}
            readyToAdopt={readyToAdopt || false}
            style={styles.icons}
            />

          <CardInfo
            name={name}
            headingStyle={Styles.heading1}
            textContainerStyle={styles.cardInfo}
            />
            </Pressable>

          {description && (
            <Text style={[styles.description, Styles.bodyM]}>{description}</Text>
          )}
        </>
      ) : (
        <Pressable onPress={onPress} style={{ width: "100%" }}>
          <Image
            style={styles.image}
            source={{ uri: image }}
            resizeMode="cover"
          />

          <CardActions
            showFavoriteButton={showFavoriteButton}
            userId={user?.uid}
            plantId={plantId}
            readyToAdopt={readyToAdopt || false}
            style={styles.icons}
          />

          <CardInfo
            name={name}
            headingStyle={Styles.heading1}
            textContainerStyle={styles.cardInfo}
          />

          {description && (
            <Text style={[styles.description, Styles.bodyM]}>{description}</Text>
          )}
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.m,
    marginHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
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
  icons: {
    flexDirection: "row",
    gap: Spacing.s,
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
  },
});