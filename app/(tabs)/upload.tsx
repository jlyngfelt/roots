import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/input/DefaultInput";
import { DefaultTextArea } from "@/components/ui/input/DefaultTextArea";
import { MultiImagePicker } from "@/components/ui/MultiImagePicker";
import { DefaultSwitch } from "@/components/ui/switch/DefaultSwitch";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { Text } from "tamagui";
import { useAuth } from "../../contexts/AuthContext";
import { createPlant } from "../../services/plantService";

export default function UploadScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [readyToAdopt, setReadyToAdopt] = useState(false);
  const [plantImages, setPlantImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePlant = async () => {
    setError("");

    if (!plantName.trim()) {
      setError("Plantans namn krävs");
      return;
    }

    if (!description.trim()) {
      setError("Beskrivning krävs");
      return;
    }

    setLoading(true);

    try {
      await createPlant(user?.uid, {
        name: plantName.trim(),
        description: description.trim(),
        readyToAdopt: readyToAdopt,
        categoryId: "",
        imageUrl: plantImages[0] || "",
        imageUrls: plantImages,
      });

      setPlantName("");
      setDescription("");
      setReadyToAdopt(false);
      setPlantImages([]);

      router.replace("/(tabs)/explore");
    } catch (err) {
      console.error(err);
      setError("Kunde inte skapa planta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <MultiImagePicker
        images={plantImages}
        onImagesChange={setPlantImages}
        maxImages={5}
        folder="plants"
        fileNamePrefix={`plant_${user?.uid || "temp"}`}
      />

      <DefaultInput
        value={plantName}
        onChangeText={setPlantName}
        placeholder="Plantans namn"
      />

      <DefaultTextArea
        value={description}
        onChangeText={setDescription}
        placeholder="Beskrivning"
      />

      <DefaultSwitch checked={readyToAdopt} onCheckedChange={setReadyToAdopt} />

      {error ? <Text>{error}</Text> : null}

      <DefaultButton onPress={handleCreatePlant} disabled={loading}>
        {loading ? "Sparar..." : "Spara"}
      </DefaultButton>
    </ScrollView>
  );
}
