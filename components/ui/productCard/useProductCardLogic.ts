import { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { Spacing } from "../../../constants/design-system";
import { useAuth } from "../../../contexts/AuthContext";
import { calculateDistance } from "../../../utils/distanceCalculator";

const { width } = Dimensions.get("window");

export const useProductCardLogic = ({
  userId,
  userLat,
  userLon,
  plantOwnerLat,
  plantOwnerLon,
  image,
  imageUrls,
}: {
  userId: string;
  userLat: number;
  userLon: number;
  plantOwnerLat: number;
  plantOwnerLon: number;
  image?: string;
  imageUrls?: string[];
}) => {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const distance = calculateDistance(
    userLat,
    userLon,
    plantOwnerLat,
    plantOwnerLon
  );

  const images: string[] =
    imageUrls && imageUrls.length > 0 ? imageUrls : [image || ""];

  const hasMultipleImages = images.length > 1;
  const showFavoriteButton = userId !== user?.uid;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - Spacing.m * 2));
    setActiveIndex(index);
  };

  return {
    distance,
    images,
    hasMultipleImages,
    showFavoriteButton,
    activeIndex,
    handleScroll,
    scrollViewRef,
    user,
  };
};
