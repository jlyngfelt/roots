import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { useRouter } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import TabLayout from "./_layout";
import { DefaultSwitch } from "@/components/ui/switch/DefaultSwitch";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  return (
    <>
      <Text style={{ fontSize: 50, padding: 40 }}>PROFIL</Text>
      <Text style={{ fontSize: 50, padding: 40 }}>Email: {user?.email}</Text>

      <TabLayout />
      <DefaultButton onPress={() => router.replace("/edit-profile")}>
        {" "}
        Redigera profil
      </DefaultButton>
      <DefaultSwitch />
    </>
  );
}

const styles = StyleSheet.create({});
