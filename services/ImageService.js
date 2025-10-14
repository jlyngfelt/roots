import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

/**
 * Picks an image from the device's library
 * Returns the selected image URI or null if cancelled
 */
export async function pickImageFromLibrary() {
  try {
    // Request permission to access media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return null;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square crop for profile pictures
      quality: 0.7, // Compress to 70% quality to save storage
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error("Error picking image:", error);
    throw error;
  }
}

/**
 * Takes a photo using the device's camera
 * Returns the photo URI or null if cancelled
 */
export async function takePhoto() {
  try {
    // Request permission to access camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return null;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error("Error taking photo:", error);
    throw error;
  }
}

/**
 * Uploads an image to Firebase Storage
 * @param {string} imageUri - The local URI of the image
 * @param {string} folder - The folder in storage ('profiles' or 'plants')
 * @param {string} fileName - The name for the file (e.g., userId or plantId)
 * @returns {Promise<string>} The download URL of the uploaded image
 */
export async function uploadImage(imageUri, folder, fileName) {
  try {
    // Convert the image URI to a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create a reference to where we want to store the file
    const storageRef = ref(storage, `${folder}/${fileName}.jpg`);

    // Upload the file
    await uploadBytes(storageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

/**
 * Complete flow: Pick image and upload it
 * @param {string} folder - The folder in storage ('profiles' or 'plants')
 * @param {string} fileName - The name for the file (e.g., userId or plantId)
 * @returns {Promise<string|null>} The download URL or null if cancelled
 */
export async function pickAndUploadImage(folder, fileName) {
  try {
    const imageUri = await pickImageFromLibrary();
    if (!imageUri) return null;

    const downloadURL = await uploadImage(imageUri, folder, fileName);
    return downloadURL;
  } catch (error) {
    console.error("Error in pickAndUploadImage:", error);
    throw error;
  }
}

/**
 * Complete flow: Take photo and upload it
 * @param {string} folder - The folder in storage ('profiles' or 'plants')
 * @param {string} fileName - The name for the file (e.g., userId or plantId)
 * @returns {Promise<string|null>} The download URL or null if cancelled
 */
export async function takeAndUploadPhoto(folder, fileName) {
  try {
    const imageUri = await takePhoto();
    if (!imageUri) return null;

    const downloadURL = await uploadImage(imageUri, folder, fileName);
    return downloadURL;
  } catch (error) {
    console.error("Error in takeAndUploadPhoto:", error);
    throw error;
  }
}
