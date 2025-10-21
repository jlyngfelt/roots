// här ändrar man ex sin bio, sin profilbild och kanske mer. När man trycker på spara = (router.replace('/(tabs)'))

import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/forms/DefaultInput";
import { DefaultTextArea } from "@/components/ui/forms/DefaultTextArea";
import { useAuth } from "@/contexts/AuthContext";
import { pickAndUploadImage } from "@/services/imageService";
import { getCoordinates } from "@/services/locationService";
import { getUserProfile, updateUserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, View } from "react-native";
import { Text } from "tamagui";
import { Colors } from "../../constants/design-system";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const [newPostalcode, setNewPostalcode] = useState("");
  const [newBio, setNewBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      async function fetchProfile() {
        if (!user?.uid) return;
        const profile: any = await getUserProfile(user?.uid);
        if (profile) {
          setNewUsername(profile.username || "");
          setNewPostalcode(profile.postalCode || "");
          setNewBio(profile.bio || "");
          setProfileImageUrl(profile.profileImageUrl || "");
        }
      }
      fetchProfile();
    }
  }, [user?.uid]);

  async function handleImageUpload() {
    if (!user?.uid) {
      Alert.alert("Fel", "Du måste vara inloggad");
      return;
    }
    try {
      setIsUploading(true);
      // Upload image to 'profiles' folder with user's ID as filename
      const downloadURL = await pickAndUploadImage("profiles", user?.uid);

      if (downloadURL) {
        setProfileImageUrl(downloadURL);
        Alert.alert("Klart!", "Profilbild uppladdad!");
      }
    } catch (error) {
      Alert.alert("Fel", "Kunde inte ladda upp bild. Försök igen.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSave() {
    if (!user?.uid) return;
    try {
      setLoading(true);

      const coordinates = await getCoordinates(newPostalcode.trim());

      if (!coordinates) {
        setError("Ogiltigt postnummer. Kontrollera och försök igen.");
        setLoading(false);
        return;
      }

      await updateUserProfile(user?.uid!, {
        username: newUsername,
        postalCode: newPostalcode,
        latitude: coordinates.lat,
        longitude: coordinates.lon,
        bio: newBio,
        profileImageUrl: profileImageUrl,
      });

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Kunde inte uppdatera profil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.secondary,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {/* Profile Image Preview */}
      {profileImageUrl ? (
        <Image
          source={{ uri: profileImageUrl }}
          style={{
            width: 240,
            height: 240,
            padding: 40,
            borderRadius: 16,
            marginBottom: 24,
          }}
        />
      ) : (
        <View
          style={{
            width: 240,
            height: 240,
            padding: 40,
            borderRadius: 16,
            marginBottom: 24,
            backgroundColor: Colors.grey,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: Colors.light }}>Ingen bild</Text>
        </View>
      )}

      <DefaultButton
        variant="primary"
        onPress={handleImageUpload}
        disabled={isUploading}
      >
        {isUploading
          ? "Väntar"
          : profileImageUrl
          ? "Ändra profilbild"
          : "Ladda upp profilbild"}
      </DefaultButton>

      {isUploading && <ActivityIndicator size="small" />}

      <DefaultInput
        value={newUsername}
        onChangeText={setNewUsername}
        placeholder="Användarnamn"
      />
      <DefaultInput
        value={newPostalcode}
        onChangeText={setNewPostalcode}
        placeholder="Postnummer"
      />
      <DefaultTextArea
        value={newBio}
        onChangeText={setNewBio}
        placeholder="Bio"
      />
      <DefaultButton onPress={handleSave}>Spara</DefaultButton>
    </View>
  );
}
