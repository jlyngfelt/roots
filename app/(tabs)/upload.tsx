import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/input/DefaultInput";
import { DefaultTextArea } from "@/components/ui/input/DefaultTextArea";
import { DefaultSwitch } from "@/components/ui/switch/DefaultSwitch";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { pickAndUploadImage } from "../../services/imageService";
import { createPlant } from "../../services/plantService";

export default function UploadScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [readyToAdopt, setReadyToAdopt] = useState(false);
  const [plantImageUrl, setPlantImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function handleImageUpload() {
    if (!user?.uid) {
      Alert.alert("Fel", "Du måste vara inloggad");
      return;
    }

    try {
      setIsUploading(true);
      // Use a temporary ID for the plant image
      const tempId = `temp_${Date.now()}`;
      const downloadURL = await pickAndUploadImage("plants", tempId);

      if (downloadURL) {
        setPlantImageUrl(downloadURL);
        Alert.alert("Klart!", "Plantbild uppladdad!");
      }
    } catch (err) {
      Alert.alert("Fel", "Kunde inte ladda upp bild. Försök igen.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  const handleCreatePlant = async () => {
    setError("");

    if (!plantName.trim()) {
      setError("Plant name is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    setLoading(true);

    try {
      await createPlant(user?.uid, {
        name: plantName.trim(),
        description: description.trim(),
        readyToAdopt: readyToAdopt,
        categoryId: "", // Lägg till categoryId-hantering
        imageUrl: plantImageUrl,
      });

      console.log("Plant created successfully!");
      router.replace("/(tabs)/explore"); // här ska man redirectas till plantas sida
    } catch (err) {
      console.error("Error creating plant:", err);
      setError("Failed to create plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text style={{ fontSize: 50, padding: 40 }}>UPLOAD</Text>

      {/* Plant Image Preview */}
      {plantImageUrl ? (
        <Image
          source={{ uri: plantImageUrl }}
          style={{
            width: 240,
            height: 240,
            padding: 40,
            borderRadius: 16,
            marginBottom: 24,
            alignSelf: "center",
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
          <Text>Ingen bild</Text>
        </View>
      )}

      <DefaultButton
        variant="secondary"
        onPress={handleImageUpload}
        disabled={isUploading}
      >
        {isUploading
          ? "Laddar upp..."
          : plantImageUrl
          ? "Ändra bild"
          : "Ladda upp bild"}
      </DefaultButton>

      {isUploading && <ActivityIndicator size="small" color="#0000ff" />}

      <DefaultInput
        value={plantName}
        onChangeText={setPlantName}
        placeholder="Ex. Monstera"
      />
      <DefaultTextArea
        value={description}
        onChangeText={setDescription}
        placeholder="Beskrivning"
      />
      <DefaultSwitch checked={readyToAdopt} onCheckedChange={setReadyToAdopt} />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <DefaultButton
        onPress={handleCreatePlant}
        disabled={loading || isUploading}
      >
        {loading ? "Sparar..." : "Spara"}
      </DefaultButton>
    </>
  );
}

const styles = StyleSheet.create({});
