import { useEffect, useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity } from "react-native";
import {
  addToFavorites,
  isPlantFavorited,
  removeFromFavorites,
} from "../../../services/favoritesService";

const heartFilled = require("../../../assets/icons/likeFilled.png");
const heartUnfilled = require("../../../assets/icons/likeUnfilled.png");

interface FavoriteButtonProps {
  userId: string;
  plantId: string;
  onFavoriteChange?: (plantId: string, isFavorited: boolean) => void;
}

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
    return <ActivityIndicator size="small" color="#ff6b6b" />;
  }

  return (
    <TouchableOpacity onPress={handleToggleFavorite}>
      <Image
        source={isFavorited ? heartFilled : heartUnfilled}
        style={{ width: 30, height: 28 }}
      />
    </TouchableOpacity>
  );
};
