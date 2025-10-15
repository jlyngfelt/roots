import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";

interface ImagePickerPreviewProps {
  imageUrl: string | null;
  onPress: () => void;
  isUploading: boolean;
  size?: number;
}

export function ImagePickerPreview({
  imageUrl,
  onPress,
  isUploading,
  size = 240,
}: ImagePickerPreviewProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={isUploading}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: size, height: size }}
        />
      ) : (
        <View style={{ width: size, height: size, backgroundColor: "#ccc" }} />
      )}
      {isUploading && (
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <ActivityIndicator />
        </View>
      )}
    </TouchableOpacity>
  );
}
