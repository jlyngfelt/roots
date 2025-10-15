import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { ImagePickerPreview } from "@/components/ui/ImagePickerPreview";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Input, Text, TextArea } from "tamagui";
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

    if (!user) {
      setError("Ingen användare inloggad");
      return;
    }

    setLoading(true);

    try {
      await createUserProfile(user.uid, {
        username: username.trim(),
        postalCode: postalCode.trim(),
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <ImagePickerPreview
          imageUrl={profileImageUrl}
          onPress={handleImageUpload}
          isUploading={uploading}
          size={200}
        />

        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="Användarnamn"
          autoCapitalize="none"
        />

        <Input
          value={postalCode}
          onChangeText={setPostalCode}
          placeholder="Postnummer"
          autoCapitalize="characters"
        />

        <TextArea
          value={bio}
          onChangeText={setBio}
          placeholder="Beskrivning"
          multiline
          numberOfLines={3}
        />

        {error ? <Text>{error}</Text> : null}

        <DefaultButton
          onPress={handleCreateProfile}
          disabled={loading || uploading}
        >
          {loading ? "Sparar..." : "Spara"}
        </DefaultButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
