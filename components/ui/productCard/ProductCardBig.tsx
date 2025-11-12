import { db } from "@/firebaseConfig";
import { Image } from "expo-image";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
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
  categoryName,
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

  const [userProfileName, setUserProfileName] = useState("");
  const [userProfileImageUrl, setUserProfileImageUrl] = useState("");

  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userProfile = docSnap.data();
        setUserProfileName(userProfile.username || "");
        setUserProfileImageUrl(userProfile.profileImageUrl || "");
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <View>
      <View style={styles.container}>
        <Image
          style={styles.profileImage}
          source={
            userProfileImageUrl
              ? { uri: userProfileImageUrl }
              : require("../../../assets/profilePicture.png")
          }
          cachePolicy="memory-disk"
        />
        <Text style={styles.username}>{userProfileName}</Text>
      </View>
      {hasMultipleImages ? (
        <>
          <View style={styles.imageContainer}>
            <ImageCarousel
              images={images}
              activeIndex={activeIndex}
              scrollViewRef={scrollViewRef}
              onScroll={handleScroll}
              imageStyle={styles.image}
              onPress={onPress}
            />
            {categoryName && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{categoryName}</Text>
              </View>
            )}
          </View>

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
  container: {
    backgroundColor: "#d9dfc9",
    height: 48,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  username: {
    ...Styles.actionL,
    paddingLeft: Spacing.s,
    textTransform: "lowercase",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 5,
    marginBottom: Spacing.s,
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
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.s,
  },
});
