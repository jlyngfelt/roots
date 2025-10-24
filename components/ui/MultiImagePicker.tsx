import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "@/constants/design-system";
import { chooseImageSource, uploadImage } from "@/services/imageService";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MultiImagePickerProps } from "../../interfaces/index";
import { IconSymbol } from "./icon-symbol";

export function MultiImagePicker({
  images,
  onImagesChange,
  maxImages = 5,
  folder,
  fileNamePrefix,
}: MultiImagePickerProps) {
  const [isUploading, setIsUploading] = useState(false);

  const addImage = async () => {
    if (images.length >= maxImages || isUploading) return;

    setIsUploading(true);
    try {
      const imageUri = await chooseImageSource();
      if (!imageUri) return;

      const fileName = `${fileNamePrefix}_${Date.now()}_${images.length}`;
      const downloadURL = await uploadImage(imageUri, folder, fileName);

      if (downloadURL) {
        onImagesChange([...images, downloadURL]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Fel", "Kunde inte ladda upp bilden");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    Alert.alert("Ta bort bild", "Är du säker?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Ta bort",
        style: "destructive",
        onPress: () => onImagesChange(images.filter((_, i) => i !== index)),
      },
    ]);
  };

  const moveImageLeft = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [
      newImages[index],
      newImages[index - 1],
    ];
    onImagesChange(newImages);
  };

  const moveImageRight = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [
      newImages[index + 1],
      newImages[index],
    ];
    onImagesChange(newImages);
  };

  return (
    <View style={styles.container}>
      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {images.map((imageUrl, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: imageUrl }} style={styles.image} />

              {index === 0 && (
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryText}>Huvudbild</Text>
                </View>
              )}

              <View style={styles.overlayButtons}>
                {index > 0 && (
                  <Pressable
                    onPress={() => moveImageLeft(index)}
                    style={({ pressed }) => [
                      styles.arrowButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <IconSymbol
                      name="chevron.left"
                      size={18}
                      color={Colors.light}
                    />
                  </Pressable>
                )}

                {index < images.length - 1 && (
                  <Pressable
                    onPress={() => moveImageRight(index)}
                    style={({ pressed }) => [
                      styles.arrowButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <IconSymbol
                      name="chevron.right"
                      size={18}
                      color={Colors.light}
                    />
                  </Pressable>
                )}

                <Pressable
                  onPress={() => removeImage(index)}
                  style={({ pressed }) => [
                    styles.removeButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <IconSymbol name="trash" size={18} color={Colors.light} />
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {images.length < maxImages && (
        <Pressable
          onPress={addImage}
          disabled={isUploading}
          style={({ pressed }) => [
            styles.addButton,
            isUploading && styles.addButtonDisabled,
            pressed && !isUploading && styles.addButtonPressed,
          ]}
        >
          {isUploading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <>
              <IconSymbol name="plus" size={28} color={Colors.primary} />
              <Text style={styles.addButtonSubtext}>
                Lägg till bild ({images.length}/{maxImages})
              </Text>
            </>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  scrollView: {
    marginBottom: Spacing.m,
  },
  scrollContent: {
    paddingRight: Spacing.m,
  },
  imageContainer: {
    marginRight: Spacing.m,
    borderRadius: BorderRadius.xl,
    position: "relative",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: BorderRadius.xl,
  },
  primaryBadge: {
    position: "absolute",
    top: Spacing.s,
    left: Spacing.s,
    backgroundColor: Colors.text,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xl,
  },
  primaryText: {
    color: Colors.light,
    fontSize: Typography.fontSize.s,
    fontWeight: Typography.fontWeight.semibold,
  },
  overlayButtons: {
    position: "absolute",
    top: Spacing.s,
    right: Spacing.s,
    flexDirection: "column",
    gap: Spacing.s,
  },
  arrowButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.details,
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.warning,
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  addButton: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.l,
    borderWidth: 1.5,
    borderColor: Colors.details,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.s,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonSubtext: {
    fontFamily: Typography.fontFamily.light,
    fontSize: Typography.fontSize.m,
    color: Colors.details,
  },
});
