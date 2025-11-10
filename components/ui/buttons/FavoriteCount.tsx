import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Styles } from "@/constants/design-system";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { FavoriteCountProps } from "@/interfaces";
import {
  getFavoriteCount
} from "../../../services/favoritesService";

export function FavoriteCount({ plantId, userId }: FavoriteCountProps) {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCount = async () => {
      try {
        setLoading(true);
        const count = await getFavoriteCount(plantId);
        setLikeCount(count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCount();
  }, [plantId]);

  return (
    <>
      <IconSymbol
        name="heart.fill"
        size={30}
        color={Colors.accent}
      />
      <Text style={styles.likeCount}>
        {loading ? "..." : likeCount}
      </Text>
    </>
  );
}


const styles = StyleSheet.create({
  likeCount: {
    ...Styles.bodyL,
    marginLeft:-7,
    alignSelf:"center",
    padding:0,
  },
});
