import { chooseImageSource, uploadImage } from "@/services/imageService";
import { useState } from "react";
import { Alert, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { MultiImagePickerProps } from "../../interfaces/index"

export function MultiImagePicker({
  images,
  onImagesChange,
  maxImages = 5,
  folder,
  fileNamePrefix,
}: MultiImagePickerProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleAddImage = async () => {
    if (images.length >= maxImages) {
      return;
    }

    try {
      setUploadingIndex(images.length);
      const imageUri = await chooseImageSource();

      if (!imageUri) {
        setUploadingIndex(null);
        return;
      }

      const fileName = `${fileNamePrefix}_${Date.now()}_${images.length}`;
      const downloadURL = await uploadImage(imageUri, folder, fileName);

      if (downloadURL) {
        onImagesChange([...images, downloadURL]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    Alert.alert("", "", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Ta bort",
        onPress: () => {
          const newImages = images.filter((_, i) => i !== index);
          onImagesChange(newImages);
        },
      },
    ]);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;

    const newImages = [...images];
    const [primaryImage] = newImages.splice(index, 1);
    newImages.unshift(primaryImage);
    onImagesChange(newImages);
  };

  return (
    <ScrollView horizontal>
      {images.map((imageUrl, index) => (
        <View key={index}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: 120, height: 120 }}
          />
          <View>
            {index !== 0 && (
              <TouchableOpacity onPress={() => handleSetPrimary(index)}>
                <View
                  style={{ width: 30, height: 30, backgroundColor: "#000" }}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handleRemoveImage(index)}>
              <View
                style={{ width: 30, height: 30, backgroundColor: "#f00" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {images.length < maxImages && (
        <TouchableOpacity
          onPress={handleAddImage}
          disabled={uploadingIndex !== null}
        >
          <View style={{ width: 120, height: 120, backgroundColor: "#ccc" }} />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
