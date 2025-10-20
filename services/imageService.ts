import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Alert } from "react-native";
import { storage } from "../firebaseConfig";


export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: SaveFormat;
}

/**
 * Optimizes an image by resizing and compressing it
 */
export async function optimizeImage(
  imageUri: string,
  options: OptimizationOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.7,
    format = SaveFormat.JPEG,
  } = options;

  try {
    const manipulatedImage = await manipulateAsync(
      imageUri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: quality, format: format }
    );
    return manipulatedImage.uri;
  } catch (error) {
    console.error("Error optimizing image:", error);
    return imageUri;
  }
}

/**
 * Shows alert to choose between camera or gallery
 */
export async function chooseImageSource(): Promise<string | null> {
  return new Promise((resolve) => {
    Alert.alert(
      "Välj bild",
      "Hur vill du lägga till en bild?",
      [
        {
          text: "Ta foto",
          onPress: async () => {
            const uri = await takePhoto();
            resolve(uri);
          },
        },
        {
          text: "Välj från galleri",
          onPress: async () => {
            const uri = await pickImageFromLibrary();
            resolve(uri);
          },
        },
        {
          text: "Avbryt",
          style: "cancel",
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    );
  });
}

/**
 * Picks an image from library
 */
export async function pickImageFromLibrary(): Promise<string | null> {
  try {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Behörighet krävs",
        "Vi behöver tillgång till ditt fotobibliotek."
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error("Error picking image:", error);
    Alert.alert("Fel", "Kunde inte välja bild.");
    throw error;
  }
}

/**
 * Takes a photo with camera
 */
export async function takePhoto(): Promise<string | null> {
  try {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Behörighet krävs", "Vi behöver tillgång till din kamera.");
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error("Error taking photo:", error);
    Alert.alert("Fel", "Kunde inte ta foto.");
    throw error;
  }
}

/**
 * Uploads image to Firebase Storage
 */
export async function uploadImage(
  imageUri: string,
  folder: string,
  fileName: string,
  optimizationOptions: OptimizationOptions = {}
): Promise<string> {
  try {
    const optimizedUri = await optimizeImage(imageUri, optimizationOptions);
    const response = await fetch(optimizedUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `${folder}/${fileName}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    Alert.alert("Fel", "Kunde inte ladda upp bild.");
    throw error;
  }
}

/**
 * Complete flow: choose source and upload
 */
export async function pickAndUploadImage(
  folder: string,
  fileName: string,
  optimizationOptions: OptimizationOptions = {}
): Promise<string | null> {
  try {
    const imageUri = await chooseImageSource();
    if (!imageUri) return null;

    const downloadURL = await uploadImage(
      imageUri,
      folder,
      fileName,
      optimizationOptions
    );
    return downloadURL;
  } catch (error) {
    console.error("Error in pickAndUploadImage:", error);
    throw error;
  }
}

/**
 * Optimization presets
 */
export const OptimizationPresets = {
  profile: { maxWidth: 800, maxHeight: 800, quality: 0.8 },
  plant: { maxWidth: 1200, maxHeight: 1200, quality: 0.75 },
  thumbnail: { maxWidth: 400, maxHeight: 400, quality: 0.7 },
};
