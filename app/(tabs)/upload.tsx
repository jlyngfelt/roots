import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { DefaultInput } from "@/components/ui/inputs/DefaultInput";
import { DefaultTextArea } from "@/components/ui/inputs/DefaultTextArea";
import { MultiImagePicker } from "@/components/ui/MultiImagePicker";
import { CategorySelect } from "@/components/ui/selects/CategorySelect";
import { DefaultSwitch } from "@/components/ui/switch/DefaultSwitch";
import { Colors, Spacing, Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { createPlant } from "../../services/plantService";

export default function UploadScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [readyToAdopt, setReadyToAdopt] = useState(false);
  const [plantImages, setPlantImages] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState("");
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

    if (!categoryId) {
      setError("Kategori krävs");
      return;
    }

    setLoading(true);

    try {
      if (!user?.uid) return;
      await createPlant(user?.uid, {
        name: plantName.trim(),
        description: description.trim(),
        readyToAdopt: readyToAdopt,
        categoryId: categoryId,
        imageUrl: plantImages[0] || "",
        imageUrls: plantImages,
      });

      setPlantName("");
      setDescription("");
      setReadyToAdopt(false);
      setCategoryId("");
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
        placeholder="Plantans namn"
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

 {error && <Text style={[Styles.actionL, { textAlign: "center" }]}>{error}</Text>} 
      <DefaultButton
        onPress={handleCreatePlant}
        disabled={loading}
        style={styles.padding}
      >
        {loading ? "Sparar..." : "Spara"}
      </DefaultButton>

    </FormLayout>
  );
}

const styles = StyleSheet.create({
  adoptWrapper: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-start",
    gap: Spacing.m,
  },
  padding: {
    marginBottom: Spacing["4xl"],
  },
});
