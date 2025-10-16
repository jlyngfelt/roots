import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { getPlantById } from "@/services/plantService";

export default function ViewPlantScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { plantId } = useLocalSearchParams<{ plantId: string }>();;
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

  return (
    <>
      <ScrollView>
        <Text style={{ fontSize: 50, padding: 40 }}>PROFIL</Text>
        <Text style={{ fontSize: 30, padding: 40 }}>{plantName}</Text>
        <Text style={{ fontSize: 30, padding: 40 }}>{description}</Text>
        <Text style={{ fontSize: 30, padding: 40 }}>{readyToAdopt ? "Ready to adopt" : "not ready to adopt yet"}</Text>

            <DefaultButton
              onPress={() => router.push(`/edit-plant/${plantId}`)}
            >
              Redigera
            </DefaultButton>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
