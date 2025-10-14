//Här skapar man sin profil, man blir hitskickad efter Register för att fylla i sin användarinformation och skickas sedan vidare till (tabs)explore
import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { Button, Input, Text, TextArea } from "tamagui";
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
    if (!user?.uid) {
      Alert.alert("Fel", "Du måste vara inloggad");
      return;
    }

    try {
      setUploading(true);
      const downloadURL = await pickAndUploadImage("profiles", user.uid);

      if (downloadURL) {
        setProfileImageUrl(downloadURL);
        Alert.alert("Klart!", "Profilbild uppladdad!");
      }
    } catch (error) {
      Alert.alert("Fel", "Kunde inte ladda upp bild. Försök igen.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  const handleCreateProfile = async () => {
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!user) {
      setError("No user logged in");
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

      console.log("Profile created successfully!");
      router.replace("/(tabs)/explore");
    } catch (err) {
      console.error("Error creating profile:", err);
      setError("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: "blue",
        }}
      >
        <Text style={{ fontSize: 20, color: "green", marginBottom: 20 }}>
          Skapa din profil
        </Text>

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
              backgroundColor: "gray",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Ingen bild</Text>
          </View>
        )}

        <DefaultButton
          variant="secondary"
          onPress={handleImageUpload}
          disabled={uploading}
        >
          {uploading
            ? "Laddar upp..."
            : profileImageUrl
            ? "Ändra bild"
            : "Ladda upp profilbild"}
        </DefaultButton>

        {uploading && <ActivityIndicator size="small" color="#0000ff" />}

        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="Användarnamn"
          autoCapitalize="none"
          size="$4"
          marginVertical="10"
          width="80%"
        />

        <Input
          value={postalCode}
          onChangeText={setPostalCode}
          placeholder="Postnummer"
          autoCapitalize="characters"
          size="$4"
          marginVertical="10"
          width="80%"
        />

        <TextArea
          value={bio}
          onChangeText={setBio}
          placeholder="Beskrivning..."
          multiline
          numberOfLines={3}
          size="$4"
          marginVertical="10"
          width="80%"
        />

        {error ? (
          <Text fontSize="$3" color="red" marginVertical="10">
            {error}
          </Text>
        ) : null}

        <Button
          onPress={handleCreateProfile}
          color="#841584"
          size="$4"
          marginVertical="10"
          disabled={loading || uploading}
        >
          {loading ? "Sparar..." : "Spara"}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
