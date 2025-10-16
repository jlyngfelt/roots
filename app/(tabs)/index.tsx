import { getUserPlants } from "@/services/plantService";
import { getUserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import TabLayout from "./_layout";
import { ProductCard } from "@/components/ui/productCard/ProductCard";
import { Spacing } from '../../constants/design-system'

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
        if (!user?.uid) return;
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
    description?: string;
    readyToAdopt: boolean;
    userId: string;
    categoryId?: string;
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
        <Text style={{ fontSize: 20, padding: 10 }}>PROFIL</Text>

        {/* Profile Image */}
        {userProfile?.profileImageUrl ? (
          <Image
            source={{ uri: userProfile.profileImageUrl }}
            style={{
              width: 240,
              height: 240,
              padding: 40,
              borderRadius: 16,
              alignSelf: "center",
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

        <Text style={{ fontSize: 20, padding: 10 }}>Email: {user?.email}</Text>
        <Text style={{ fontSize: 20, padding: 10 }}>
          username: {userProfile?.username}
        </Text>
        <Text style={{ fontSize: 20, padding: 10 }}>
          postal: {userProfile?.postalCode}
        </Text>
        <Text style={{ fontSize: 20, padding: 10 }}>
          bio: {userProfile?.bio}
        </Text>
        <Text style={{ fontSize: 20, padding: 10 }}>
          credits: {userProfile?.credits}
        </Text>
        <TabLayout />

        <View style={styles.feed}>
                {plants.map((plant) => (
                  <Pressable onPress={() => router.push("/view-plant/[plantId]")}>

                  <ProductCard
                  key={plant.id}
                  userId={user?.uid!}
                  plantId={plant.id}
                  name={plant.name}
                  description={plant.description}
                  image={plant.imageUrl}
                  readyToAdopt={plant.readyToAdopt}
                  />
                  </Pressable>
                ))}
                </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  feed: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 80,
  },

});
