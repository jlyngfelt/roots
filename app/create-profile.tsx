import { ImagePickerPreview } from "@/components/ui/ImagePickerPreview";
import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/forms/DefaultInput";
import { DefaultTextArea } from "@/components/ui/forms/DefaultTextArea";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { Colors, Styles } from "@/constants/design-system";
import { getCoordinates } from "@/services/locationService";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { pickAndUploadImage } from "../services/imageService";
import { createUserProfile } from "../services/userService";

export default function CreateProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload() {
    if (!user?.uid) return;

    try {
      setUploading(true);
      const downloadURL = await pickAndUploadImage("profiles", user.uid);
      if (downloadURL) {
        setProfileImageUrl(downloadURL);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  const handleCreateProfile = async () => {
    setError("");
    if (!username.trim()) {
      setError("Användarnamn krävs");
      return;
    }
    if (!postalCode.trim()) {
      setError("Postnummer krävs");
      return;
    }
    if (!user) {
      setError("Ingen användare inloggad");
      return;
    }
    setLoading(true);

    try {
      const coordinates = await getCoordinates(postalCode.trim());

      if (!coordinates) {
        setError("Ogiltigt postnummer. Kontrollera och försök igen.");
        setLoading(false);
        return;
      }
      await createUserProfile(user.uid, {
        username: username.trim(),
        postalCode: postalCode.trim(),
        latitude: coordinates.lat,
        longitude: coordinates.lon,
        bio: bio.trim(),
        profileImageUrl: profileImageUrl,
      });

      router.replace("/(tabs)/explore");
    } catch (err) {
      console.error(err);
      setError("Kunde inte skapa profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout>
      <Image
        source={require("../assets/roots_logo.png")}
        style={{ height: 70, margin: 10 }}
        resizeMode="contain"
      />
      <ImagePickerPreview
        imageUrl={profileImageUrl}
        onPress={handleImageUpload}
        isUploading={uploading}
      />

      <DefaultButton
        onPress={handleImageUpload}
        variant="tertiary"
        textColor={Colors.details}
        borderBottomColor={Colors.details}
      >
        Ladda upp bild
      </DefaultButton>

      <DefaultInput
        value={username}
        onChangeText={setUsername}
        placeholder="Användarnamn"
        autoCapitalize="none"
      />

      <DefaultInput
        value={postalCode}
        onChangeText={setPostalCode}
        placeholder="Postnummer"
        autoCapitalize="characters"
      />

      <DefaultTextArea
        value={bio}
        onChangeText={setBio}
        placeholder="Beskrivning..."
      />

      <Text style={Styles.actionL}>{error}</Text>

      <DefaultButton
        onPress={handleCreateProfile}
        disabled={loading || uploading}
      >
        {loading ? "Sparar..." : "Spara"}
      </DefaultButton>

      {/* <DefaultButton
        onPress={() => router.replace("/welcome")}
        variant="tertiary"
        textColor={Colors.primary}
        borderBottomColor={Colors.primary}
      >
        Tillbaka
      </DefaultButton> */}
    </FormLayout>
  );
}
