import { DefualtInput } from "@/components/ui/input/DefaultInput";
import { DefualtTextArea } from "@/components/ui/input/DefaultTextArea";
import { DefaultSwitch } from "@/components/ui/switch/DefaultSwitch";
import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { createPlant } from '../../services/plantService'
import { useAuth } from '../../contexts/AuthContext'

export default function UploadScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [readyToAdopt, setReadyToAdopt] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


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
      imageUrl: "",
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

      <DefualtInput
              value={plantName}
        onChangeText={setPlantName}
        placeholder="Ex. Monstera"/>
      <DefualtTextArea value={description}
        onChangeText={setDescription}
        placeholder="Beskrivning"/>
      <DefaultSwitch 
      checked={readyToAdopt}
  onCheckedChange={setReadyToAdopt}/>

  <DefaultButton onPress={handleCreatePlant}>Spara</DefaultButton>
    </>
  );
}

const styles = StyleSheet.create({});
