import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultSwitch } from "@/components/ui/switch/DefaultSwitch";
import { getUserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import TabLayout from "./_layout";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(
    null
  );

  interface UserProfile {
    id: string;
    username: string;
    postalCode: string;
    bio: string;
    profileImageUrl: string;
    credits: number;
    createdAt: any;
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

      <TabLayout />
      <DefaultButton onPress={() => router.replace("/settings")}>
        {" "}
        Inställningar
      </DefaultButton>
      <DefaultSwitch />
    </>
  );
}

const styles = StyleSheet.create({});
