import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { CategorySelect } from "@/components/ui/selects/CategorySelect";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { DefaultInput } from "@/components/ui/inputs/DefaultInput";
import { DefaultTextArea } from "@/components/ui/inputs/DefaultTextArea";
import { MultiImagePicker } from "@/components/ui/MultiImagePicker";
import { DefaultSwitch } from "@/components/ui/switch/DefaultSwitch";
import { Colors, Spacing, Styles } from "@/constants/design-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
  const [categoryId, setCategoryId] = useState("");
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
        categoryId: categoryId,
        imageUrl: plantImages[0] || "",
        imageUrls: plantImages,
      });
      router.replace("/(tabs)");
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
    <FormLayout centered={false}>
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
        placeholder="Ex. Monstera"
        maxLength={20}
      />

      <DefaultTextArea
        value={description}
        onChangeText={setDescription}
        placeholder="Beskrivning..."
      />

      <CategorySelect
        value={categoryId}
        onValueChange={(newValue) => {
          setCategoryId(newValue);
          console.log("Vald kategori:", newValue);
        }}
        placeholder="Välj kategori"
      />

      <View style={styles.adoptWrapper}>
        <Text style={Styles.heading4}>Redo att adopteras?</Text>
        <DefaultSwitch
          checked={readyToAdopt}
          onCheckedChange={setReadyToAdopt}
        />
      </View>

      <View style={styles.buttonWrapper}>
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

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: Spacing.l,
    marginTop: Spacing.l,
  },
  adoptWrapper: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
    gap: Spacing.m,
  },
});
