import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultSwitch } from "@/components/ui/switch/DefaultSwitch";
import { getUserProfile } from "@/services/userService";
import { getUserPlants } from "@/services/plantService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import TabLayout from "./_layout";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(
    null
  );
  const [plants, setPlants] = useState<Plant[]>([]);
  

  useEffect(() => {
    if (user?.uid) {
      async function fetchPlants() {
        const userPlants = await getUserPlants(user?.uid);
        setPlants(userPlants);
      }
      fetchPlants();
    }
  }, [user?.uid]);

  interface UserProfile {
    id: string;
    username: string;
    postalCode: string;
    bio: string;
    profileImageUrl: string;
    credits: number;
    createdAt: any;
  }
  interface Plant {
  id: string;
  name: string;
  description: string;
  readyToAdopt: boolean;
  userId: string;
  categoryId: string;
  imageUrl: string;
}

  useEffect(() => {
    if (user?.uid) {
      async function fetchProfile() {
        const profile = await getUserProfile(user?.uid);
        if (profile) {
          setUserProfile(profile);
        }
      }
      fetchProfile();
    }
  }, [user?.uid]);

  return (
    <>
    <ScrollView>

      <Text style={{ fontSize: 50, padding: 40 }}>PROFIL</Text>
      <Text style={{ fontSize: 50, padding: 40 }}>Email: {user?.email}</Text>
      <Text style={{ fontSize: 20, padding: 40 }}>
        username: {userProfile?.username}
      </Text>
      <Text style={{ fontSize: 20, padding: 40 }}>
        postal: {userProfile?.postalCode}
      </Text>
      <Text style={{ fontSize: 20, padding: 40 }}>bio: {userProfile?.bio}</Text>
      <Text style={{ fontSize: 20, padding: 40 }}>
        credits: {userProfile?.credits}
      </Text>

            {plants.map((plant) => (
              <View key={plant.id}>
          <Text>{plant.name}</Text>
          <DefaultButton onPress={() => router.push(`/edit-plant/${plant.id}`)}>
            Redigera
          </DefaultButton>
        </View>
      ))}


      <TabLayout />
      <DefaultButton onPress={() => router.replace("/settings")}>
        {" "}
        Inställningar
      </DefaultButton>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({});
