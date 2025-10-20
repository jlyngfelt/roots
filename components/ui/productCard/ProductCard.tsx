import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  Colors,
  Spacing,
  Styles,
} from "../../../constants/design-system";
import { FavoriteButton } from "../buttons/FavouriteButton";
import { ReadyToAdopt } from "../buttons/ReadyToAdopt";
import { ProductCardProps } from "../../../interfaces/index"

export const ProductCard = ({
  userId,
  plantId,
  name,
  description,
  image,
  readyToAdopt,
  variant = "big",
  onPress,
}: ProductCardProps) => {
  return (
    <View style={variant === "small" ? styles.cardSmall : styles.cardBig}>
      <Pressable onPress={onPress} style={{ width: "100%" }}>
        <Image
          style={[
            styles.image,
            variant === "small" ? styles.imageSmall : styles.imageBig,
          ]}
          source={{ uri: image }}
        />

        <View
          style={variant === "view" ? styles.viewCardInfo : styles.cardInfo}
        >
          <View style={styles.texts}>
            <Text
              style={variant === "small" ? Styles.heading2 : Styles.heading1}
            >
              {name}
            </Text>
          </View>

          <View style={variant === "view" ? styles.reverseIcons : styles.icons}>
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
});
