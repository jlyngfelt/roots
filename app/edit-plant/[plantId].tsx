import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/forms/DefaultInput";
import { DefaultTextArea } from "@/components/ui/forms/DefaultTextArea";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { DefaultSwitch } from "@/components/ui/switch/DefaultSwitch";
import { Colors, Styles } from "@/constants/design-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
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
  const [plantImages, setPlantImages] = useState<string[]>([]);

  useEffect(() => {
    if (user?.uid) {
      async function fetchPlant() {
        const plant: any = await getPlantById(plantId);
        if (plant) {
          setPlantName(plant.name || "");
          setDescription(plant.description || "");
          setReadyToAdopt(plant.readyToAdopt || false);
          setPlantImages(plant.imageUrls || [plant.imageUrl] || []);
        }
      }
      fetchPlant();
    }
  }, [user?.uid]);

  async function handleUpdatePlant() {
    setLoading(true);
    try {
      await updatePlant(plantId, {
        name: plantName,
        description: description,
        readyToAdopt: readyToAdopt,
        imageUrl: plantImages[0] || "",
        imageUrls: plantImages,
      });
      router.replace(`/view-plant/${plantId}`);
    } catch (err) {
      console.error(err);
      setError("Kunde inte uppdatera planta");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePlant() {
    try {
      await deletePlant(plantId);
      router.replace("/(tabs)");
    } catch (err) {
      console.error(err);
      setError("Kunde inte ta bort planta");
    }
  }

  return (
    <FormLayout>
      {/* <MultiImagePicker
        images={plantImages}
        onImagesChange={setPlantImages}
        maxImages={5}
        folder="plants"
        fileNamePrefix={`plant_${user?.uid || "temp"}_${plantId}`}
      /> */}
      <DefaultInput
        value={plantName}
        onChangeText={setPlantName}
        placeholder="Ex. Monstera"
      />

      <DefaultTextArea
        value={description}
        onChangeText={setDescription}
        placeholder="Beskrivning..."
      />

      <View
        style={{
          flexDirection: "column",
          width: "100%",
          justifyContent: "flex-start",
          gap: 8,
        }}
      >
        <Text style={Styles.heading4}>Redo att adopteras?</Text>
        <DefaultSwitch
          checked={readyToAdopt}
          onCheckedChange={setReadyToAdopt}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          gap: 16,
          marginTop: 16,
        }}
      >
        <DefaultButton onPress={handleUpdatePlant} disabled={loading}>
          {loading ? "Sparar..." : "Spara"}
        </DefaultButton>

        <DefaultButton onPress={handleDeletePlant} variant="secondary">
          Ta bort
        </DefaultButton>
      </View>
      <Text style={[Styles.bodyS, { color: Colors.warning }]}>{error}</Text>
    </FormLayout>
  );
}
