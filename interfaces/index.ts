export interface Plant {
  id: string;
  name: string;
  description?: string;
  readyToAdopt: boolean;
  userId: string;
  categoryId?: string;
  categoryName?: string;
  imageUrl: string;
  createdAt?: any;
  adoptedBy?: string | null;
  imageUrls?: string[];
}

export interface PlantData {
  name: string;
  description?: string;
  readyToAdopt?: boolean;
  categoryId: string;
  imageUrl?: string;
  imageUrls?: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  postalCode: string;
  bio: string;
  profileImageUrl: string;
  credits: number;
  createdAt: any;
}

export interface FavoriteButtonProps {
  userId: string;
  plantId: string;
  onFavoriteChange?: (plantId: string, isFavorited: boolean) => void;
}

export interface UserData {
  username: string;
  postalCode?: string;
  bio?: string;
  profileImageUrl?: string;
  lon?: number;
  lat?: number;
}

export interface ReadyToAdoptProps {
  readyToAdopt: boolean;
}

export interface ProductCardProps {
  userId: string;
  plantId: string;
  name: string;
  description?: string;
  image?: string;
  readyToAdopt?: boolean;
  variant?: "big" | "small" | "view";
  plantOwnerLat?: string;
  plantOwnerLon?: string;
  userLat?: string;
  userLon?: string;
  imageUrls?: string[];
  onPress?: () => void;
}

export interface ImagePickerPreviewProps {
  imageUrl: string | null;
  onPress: () => void;
  isUploading: boolean;
  size?: number;
}

export interface MultiImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  folder: string;
  fileNamePrefix: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface PlantWithDistance extends Plant {
  distance: number | null;
}

export interface Category {
  id: string;
  name: string;
}
