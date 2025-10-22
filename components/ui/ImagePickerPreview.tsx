import { Colors } from "@/constants/design-system";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { ImagePickerPreviewProps } from "../../interfaces/index";

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
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: Colors.grey,
            borderRadius: 16,
          }}
        />
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
