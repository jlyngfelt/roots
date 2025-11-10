import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  Colors,
  Spacing,
  Styles,
  Typography,
} from "../../../constants/design-system";
import { ProductCardProps } from "../../../interfaces/index";
import { CardActions, CardInfo, ImageCarousel } from "./ProductCardContent";
import { useProductCardLogic } from "./useProductCardLogic";

export const ProductCardView = ({
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
  categoryName,
  onPress,
}: Omit<ProductCardProps, "variant"> & { categoryName?: string }) => {
  const {
    distance,
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
          <View style={styles.imageContainer}>
            <ImageCarousel
              images={images}
              activeIndex={activeIndex}
              scrollViewRef={scrollViewRef}
              onScroll={handleScroll}
              imageStyle={styles.image}
            />
            {categoryName && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{categoryName}</Text>
              </View>
            )}
          </View>

          <View style={styles.cardInfo}>
            <CardInfo
              name={name}
              distance={distance}
              showLocation={true}
              headingStyle={Styles.heading1}
              textContainerStyle={{ flex: 1 }}
            />

            <CardActions
              showFavoriteButton={showFavoriteButton}
              userId={user?.uid}
              plantId={plantId}
              readyToAdopt={readyToAdopt || false}
              style={styles.icons}
            />
          </View>

          {description && (
            <Text style={[styles.description, Styles.bodyM]}>
              {description}
            </Text>
          )}
        </>
      ) : (
        <>
          <Pressable onPress={onPress} style={{ width: "100%" }}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: image }}
                resizeMode="cover"
                cachePolicy="memory-disk"
              />
              {categoryName && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{categoryName}</Text>
                </View>
              )}
            </View>
          </Pressable>

          <View style={styles.cardInfo}>
            <CardInfo
              name={name}
              distance={distance}
              showLocation={true}
              headingStyle={Styles.heading1}
              textContainerStyle={{ flex: 1 }}
            />

            <CardActions
              showFavoriteButton={showFavoriteButton}
              userId={user?.uid}
              plantId={plantId}
              readyToAdopt={readyToAdopt || false}
              style={styles.icons}
            />
          </View>

          {description && (
            <Text style={[styles.description, Styles.bodyM]}>
              {description}
            </Text>
          )}
        </>
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
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "95%",
    aspectRatio: 4 / 5,
    borderRadius: BorderRadius.xl,
    margin: Spacing.s,
    alignSelf: "center",
  },
  categoryBadge: {
    position: "absolute",
    top: Spacing.l,
    left: Spacing.l,
    backgroundColor: "#627146",
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.l,
  },
  categoryText: {
    color: Colors.light,
    fontSize: Typography.fontSize.s,
    fontFamily: Typography.fontFamily.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    width: "100%",
    gap: Spacing.s,
  },
  icons: {
    flexDirection: "row-reverse",
    gap: Spacing.s,
    alignItems: "center",
  },
});
