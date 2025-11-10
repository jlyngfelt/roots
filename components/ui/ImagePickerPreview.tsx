import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { ImagePickerPreviewProps } from "../../interfaces/index";

export function ImagePickerPreview({
  imageUrl,
  onPress,
  isUploading,
  size = 300,
}: ImagePickerPreviewProps) {
  const height = size;

  return (
    <TouchableOpacity onPress={onPress} disabled={isUploading}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: size, height: height, borderRadius: 16 }}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={require("../../assets/profilePicture.png")}
          style={{ width: size, height: height, borderRadius: 16 }}
          resizeMode="cover"
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
