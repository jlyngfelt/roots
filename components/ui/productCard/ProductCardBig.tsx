import {  Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import {
  BorderRadius,
  Spacing,
  Styles,
} from "../../../constants/design-system";
import { ProductCardProps } from "../../../interfaces/index";
import { CardActions, CardInfo, ImageCarousel } from "./ProductCardContent";
import { useProductCardLogic } from "./useProductCardLogic";

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
          <ImageCarousel
            images={images}
            activeIndex={activeIndex}
            scrollViewRef={scrollViewRef}
            onScroll={handleScroll}
            imageStyle={styles.image}
            onPress={onPress}
          />
          <Pressable onPress={onPress} style={{ width: "100%" }}>
            <View style={styles.cardInfo}>
              <CardInfo
                name={name}
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
          </Pressable>
        </>
      ) : (
        <Pressable onPress={onPress} style={{ width: "100%" }}>
          <Image
            style={styles.image}
            source={{ uri: image }}
            resizeMode="cover"
            cachePolicy="memory-disk"
            
          />
          <View style={styles.cardInfo}>
            <CardInfo
              name={name}
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
    paddingHorizontal: Spacing.m,
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
