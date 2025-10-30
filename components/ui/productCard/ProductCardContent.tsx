import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  CardActionsProps,
  CardInfoProps,
  ImageCarouselProps,
} from "@/interfaces";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BorderRadius,
  Colors,
  Spacing,
  Styles,
} from "../../../constants/design-system";
import { FavoriteButton } from "../buttons/FavouriteButton";
import { ReadyToAdopt } from "../buttons/ReadyToAdopt";

const { width } = Dimensions.get("window");

export const ImageCarousel = ({
  images,
  activeIndex,
  scrollViewRef,
  onScroll,
  imageStyle,
  onPress,
}: ImageCarouselProps) => (
  <View>
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      decelerationRate="fast"
      snapToInterval={width - Spacing.m * 2}
      snapToAlignment="center"
    >
      {images.map((imageUrl, index) => (
        <View key={index} style={styles.imageWrapper}>
          <Pressable onPress={onPress}>
            <Image
              style={[styles.image, imageStyle]}
              source={{ uri: imageUrl }}
              resizeMode="cover"
            />
          </Pressable>
        </View>
      ))}
    </ScrollView>

    <View style={styles.paginationContainer}>
      {images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  </View>
);

export const CardActions = ({
  showFavoriteButton,
  userId,
  plantId,
  readyToAdopt,
  style,
}: CardActionsProps) => (
  <View style={style}>
    {showFavoriteButton ? (
      <FavoriteButton userId={userId!} plantId={plantId} />
    ) : (
      <View />
    )}
    <ReadyToAdopt readyToAdopt={readyToAdopt} />
  </View>
);

export const CardInfo = ({
  name,
  distance,
  showLocation = false,
  headingStyle,
  textContainerStyle,
  numberOfLines,
}: CardInfoProps) => (
  <View style={textContainerStyle}>
    <View style={styles.texts}>
      <Text style={headingStyle} numberOfLines={numberOfLines}>
        {name}
      </Text>
      {showLocation && distance !== undefined && (
        <View style={styles.locationRow}>
          <IconSymbol size={20} name="mappin" color={Colors.primary} />
          <Text style={Styles.bodyS}>
            Denna planta bor {distance} km från dig
          </Text>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  texts: {
    flexDirection: "column",
    gap: Spacing.xs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
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
