import { Colors } from "@/constants/design-system";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { ImagePickerPreviewProps } from "../../interfaces/index";

export function ImagePickerPreview({
  imageUrl,
  onPress,
  isUploading,
  size = 240,
}: ImagePickerPreviewProps) {
  // Calculate height based on 4:5 aspect ratio
  const height = size * 1.25;

  return (
    <TouchableOpacity onPress={onPress} disabled={isUploading}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: size, height: height }}
        />
      ) : (
        <View
          style={{
            width: size,
            height: height,
            backgroundColor: Colors.grey,
            borderRadius: 16,
          }}
        />
      )}
      {isUploading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator />
        </View>
      )}
    </TouchableOpacity>
  );
}
