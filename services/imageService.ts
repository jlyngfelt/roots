import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Alert } from "react-native";
import { storage } from "../firebaseConfig";

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: SaveFormat;
}

export async function optimizeImage(
  imageUri: string,
  options: OptimizationOptions = {}
): Promise<string> {
  const { maxWidth = 1200, quality = 0.8, format = SaveFormat.JPEG } = options;

  try {
    const imageInfo = await manipulateAsync(imageUri, [], { compress: 1 });
    const { width, height } = imageInfo;

    const targetRatio = 4 / 5;
    const currentRatio = width / height;

    let cropWidth = width;
    let cropHeight = height;
    let originX = 0;
    let originY = 0;

    if (currentRatio > targetRatio) {
      cropWidth = height * targetRatio;
      originX = (width - cropWidth) / 2;
    } else {
      cropHeight = width / targetRatio;
      originY = (height - cropHeight) / 2;
    }

    const manipulateActions: any[] = [
      {
        crop: {
          originX,
          originY,
          width: cropWidth,
          height: cropHeight,
        },
      },
      {
        resize: {
          width: maxWidth,
        },
      },
    ];

    const manipulatedImage = await manipulateAsync(
      imageUri,
      manipulateActions,
      { compress: quality, format: format }
    );

    return manipulatedImage.uri;
  } catch (error) {
    console.error("Error optimizing image:", error);
    return imageUri;
  }
}

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

    console.log("📸 Launching image picker");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log("📸 Image picker result:", result);

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

export async function takePhoto(): Promise<string | null> {
  try {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Behörighet krävs", "Vi behöver tillgång till din kamera.");
      return null;
    }

    console.log("📸 Launching camera");

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    console.log("📸 Camera result:", result);

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

export const OptimizationPresets = {
  profile: { maxWidth: 800, quality: 0.8 },
  plant: { maxWidth: 1200, quality: 0.8 },
  thumbnail: { maxWidth: 400, quality: 0.7 },
};
