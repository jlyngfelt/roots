import { ImagePickerPreview } from "@/components/ui/ImagePickerPreview";
import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { DefaultInput } from "@/components/ui/inputs/DefaultInput";
import { DefaultTextArea } from "@/components/ui/inputs/DefaultTextArea";
import { Colors, Styles } from "@/constants/design-system";
import { useAuth } from "@/contexts/AuthContext";
import { pickAndUploadImage } from "@/services/imageService";
import { getCoordinates } from "@/services/locationService";
import { getUserProfile, updateUserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { OptimizationPresets } from "@/services/imageService";

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
      const downloadURL = await pickAndUploadImage("profiles", user?.uid, OptimizationPresets.profile );

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

     if (!newUsername.trim()) {
    setError("Du måste ange ett användarnamn");
    return;
  }
   if (!newPostalcode.trim()) {
    setError("Du måste ange ett giltligt postnummer");
    return;
  }


    try {
      setLoading(true);
      setError(""); 

      const coordinates = await getCoordinates(newPostalcode.trim());

      if (!coordinates) {
        setError("Ogiltigt postnummer. Kontrollera och försök igen.");
        setLoading(false);
        return;
      }

      await updateUserProfile(user?.uid!, {
        username: newUsername.trim(),
        postalCode: newPostalcode,
        lat: coordinates.lat,
        lon: coordinates.lon,
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
    <FormLayout>
      <ImagePickerPreview
        imageUrl={profileImageUrl}
        onPress={handleImageUpload}
        isUploading={isUploading}
      />

      <DefaultButton
        onPress={handleImageUpload}
        variant="tertiary"
        textColor={Colors.details}
        borderBottomColor={Colors.details}
        disabled={isUploading}
      >
        Ladda upp bild
      </DefaultButton>

      <DefaultInput
        value={newUsername}
        onChangeText={setNewUsername}
        placeholder="Användarnamn"
      />

      <DefaultInput
        value={newPostalcode}
        onChangeText={setNewPostalcode}
        placeholder="Postnummer"
        maxLength={5}
      />

      <DefaultTextArea
        value={newBio}
        onChangeText={setNewBio}
        placeholder="Beskrivning..."
      />

      <Text style={Styles.actionL}>{error}</Text>

      <DefaultButton onPress={handleSave} disabled={loading}>
        {loading ? "Sparar..." : "Spara"}
      </DefaultButton>
    </FormLayout>
  );
}
