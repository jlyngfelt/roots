import { Text, View, Image } from 'react-native';
import { FavoriteButton } from '../buttons/FavouriteButton';
import { ReadyToAdopt } from '../buttons/ReadyToAdopt';

interface ProductCardProps {
  userId: string;
  plantId: string;
  name: string;
  description?: string;
  image?: string;
  readyToAdopt?: boolean;
  variant?: "big" | "small";
}

export const ProductCard = ({
  userId,
  plantId,
  name,
  description,
  image,
  readyToAdopt,
  variant = "small",
}: ProductCardProps) => {  
  return (
    <View>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{
                  width: 240,
                  height: 240,
                  padding: 40,
                  borderRadius: 16,
                  marginBottom: 24,
                }}
              />
            ) : (
              <View
                style={{
                  width: 240,
                  height: 240,
                  padding: 40,
                  borderRadius: 16,
                  marginBottom: 24,
                  backgroundColor: "gray",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>Ingen bild</Text>
              </View>
            )}
      <Text>{name}</Text>
      {description && <Text>{description}</Text>}
      <ReadyToAdopt readyToAdopt={readyToAdopt || false} />
      <FavoriteButton userId={userId} plantId={plantId} />
    </View>
  );
};