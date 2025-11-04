import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/design-system";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { FavoriteButtonProps } from "../../../interfaces/index";
import {
  addToFavorites,
  isPlantFavorited,
  removeFromFavorites,
} from "../../../services/favoritesService";

export const FavoriteButton = ({
  userId,
  plantId,
  onFavoriteChange,
}: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !plantId) return;

    checkFavoriteStatus();
  }, [userId, plantId]);

  const checkFavoriteStatus = async () => {
    try {
      setLoading(true);
      const favorited = await isPlantFavorited(userId, plantId);
      setIsFavorited(favorited);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorited) {
        await removeFromFavorites(userId, plantId);
        setIsFavorited(false);
      } else {
        await addToFavorites(userId, plantId);
        setIsFavorited(true);
      }

      if (onFavoriteChange) {
        onFavoriteChange(plantId, !isFavorited);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        testID="loading-indicator"
        size="small"
        color={Colors.accent}
      />
    );
  }

  return (
    <Pressable
      testID="favorite-button"
      onPress={handleToggleFavorite}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <IconSymbol
        name={isFavorited ? "heart.fill" : "heart"}
        size={26}
        color={isFavorited ? Colors.accent : Colors.text}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
});
