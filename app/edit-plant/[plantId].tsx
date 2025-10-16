import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/input/DefaultInput";
import { DefaultTextArea } from "@/components/ui/input/DefaultTextArea";
import { DefaultSwitch } from "@/components/ui/switch/DefaultSwitch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  deletePlant,
  getPlantById,
  updatePlant,
} from "../../services/plantService";

export default function EditPlantScreen() {
  const { plantId } = useLocalSearchParams<{ plantId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [readyToAdopt, setReadyToAdopt] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      async function fetchPlant() {
        const plant: any = await getPlantById(plantId); 
        if (plant) {
          setPlantName(plant.name || "");
          setDescription(plant.description || "");
          setReadyToAdopt(plant.readyToAdopt || false);
        }
      }
      fetchPlant();
    }
  }, [user?.uid]);

  async function handleUpdatePlant() {
    await updatePlant(plantId, {
      name: plantName,
      description: description,
      readyToAdopt: readyToAdopt,
    });
    router.replace(`/view-plant/${plantId}`)
  }

  async function handleDeletePlant() {
    await deletePlant(plantId);
    router.replace("/(tabs)");
  }

  return (
    <>
      <Text style={{ fontSize: 50, padding: 40 }}>UPLOAD</Text>

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

      <DefaultButton onPress={handleUpdatePlant}>Spara</DefaultButton>
      <DefaultButton onPress={handleDeletePlant}>Ta Bort</DefaultButton>
    </>
  );
}

const styles = StyleSheet.create({});
