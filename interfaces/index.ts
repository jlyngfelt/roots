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

export interface CredentialsStepProps {
  email: string;
  setEmail: (value: string) => void;
  password1: string;
  setPassword1: (value: string) => void;
  password2: string;
  setPassword2: (value: string) => void;
  error: string;
  setError: (value: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  setStep: (step: "verification") => void;
  router: any;
}
export interface VerificationStepProps {
  email: string;
  checkingVerification: boolean;
  setCheckingVerification: (value: boolean) => void;
  setStep: (step: "profile") => void;
}
export interface ProfileStepProps {
  user: any;
  username: string;
  setUsername: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
  profileImageUrl: string;
  setProfileImageUrl: (value: string) => void;
  error: string;
  setError: (value: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  uploading: boolean;
  setUploading: (value: boolean) => void;
  router: any;
}

export interface FilterState {
  readyToAdopt: boolean;
  categoryId: string;
}
export interface FilterSelectProps {
  value: FilterState;
  onValueChange: (value: FilterState) => void;
  placeholder?: string;
}

export interface CheckboxItemProps {
  checked: boolean;
  onPress: () => void;
  label: string;
}

export interface RadioItemProps {
  selected: boolean;
  onPress: () => void;
  label: string;
}