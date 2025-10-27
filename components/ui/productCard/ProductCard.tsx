import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useState, useRef } from "react";
import {
  BorderRadius,
  Colors,
  Spacing,
  Styles,
} from "../../../constants/design-system";
import { FavoriteButton } from "../buttons/FavouriteButton";
import { ReadyToAdopt } from "../buttons/ReadyToAdopt";
import { ProductCardProps } from "../../../interfaces/index";
import { calculateDistance } from "../../../utils/distanceCalculator";

const { width } = Dimensions.get("window");

export const ProductCard = ({
  userId,
  plantId,
  name,
  description,
  image,
  readyToAdopt,
  variant = "big",
  plantOwnerLat,
  plantOwnerLon,
  userLat,
  userLon,
  imageUrls,
  onPress,
}: ProductCardProps) => {
  const distance = calculateDistance(
    userLat,
    userLon,
    plantOwnerLat,
    plantOwnerLon
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Use imageUrls if available, otherwise fall back to single image
  const images: string[] =
    imageUrls && imageUrls.length > 0 ? imageUrls : [image || ""];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - Spacing.m * 2));
    setActiveIndex(index);
  };

  return (
    <View style={variant === "small" ? styles.cardSmall : styles.cardBig}>
      {variant === "view" && images.length > 1 ? (
        <>
          <View>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={width - Spacing.m * 2}
              snapToAlignment="center"
            >
              {images.map((imageUrl, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    style={[styles.image, styles.imageBig]}
                    source={{ uri: imageUrl }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === activeIndex
                      ? styles.activeDot
                      : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.viewCardInfo}>
            <View style={styles.texts}>
              <Text>Denna planta bor {distance} km från dig</Text>
              <Text style={Styles.heading1}>{name}</Text>
            </View>

            <View style={styles.reverseIcons}>
              <FavoriteButton userId={userId} plantId={plantId} />
              <ReadyToAdopt readyToAdopt={readyToAdopt || false} />
            </View>
          </View>

          {description && (
            <Text style={[styles.description, Styles.bodyM]}>
              {description}
            </Text>
          )}
        </>
      ) : (
        <Pressable onPress={onPress} style={{ width: "100%" }}>
          <Image
            style={[
              styles.image,
              variant === "small" ? styles.imageSmall : styles.imageBig,
            ]}
            source={{ uri: image }}
            resizeMode="cover"
          />

          <View
            style={variant === "view" ? styles.viewCardInfo : styles.cardInfo}
          >
            <View style={styles.texts}>
              {variant === "view" ? (
                <Text>Denna planta bor {distance} km från dig</Text>
              ) : (
                ""
              )}
              <Text
                style={variant === "small" ? Styles.heading2 : Styles.heading1}
              >
                {name}
              </Text>
            </View>

            <View
              style={variant === "view" ? styles.reverseIcons : styles.icons}
            >
              <FavoriteButton userId={userId} plantId={plantId} />
              <ReadyToAdopt readyToAdopt={readyToAdopt || false} />
            </View>
          </View>
          {description && (
            <Text
              style={[
                styles.description,
                variant === "small" ? Styles.bodyS : Styles.bodyM,
              ]}
            >
              {description}
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardBig: {
    marginVertical: Spacing.m,
    marginHorizontal: Spacing.m,
    borderRadius: BorderRadius.xl,
  },
  cardSmall: {
    backgroundColor: Colors.secondary,
    width: "47%",
    padding: Spacing.s,
    borderRadius: BorderRadius.m,
    marginVertical: 5,
    marginHorizontal: 2,
  },
  imageWrapper: {
    width: width - Spacing.m * 2,
    alignItems: "center",
  },
  image: {
    width: "95%",
    aspectRatio: 4 / 5,
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
    gap: Spacing.s,
  },
  viewCardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    width: "100%",
    gap: Spacing.s,
  },
  texts: {
    flexDirection: "column",
  },
  icons: {
    flexDirection: "row",
    gap: Spacing.s,
    alignItems: "center",
  },
  reverseIcons: {
    flexDirection: "row-reverse",
    gap: Spacing.s,
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: Spacing.m,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.accent,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inactiveDot: {
    backgroundColor: Colors.grey,
  },
});
