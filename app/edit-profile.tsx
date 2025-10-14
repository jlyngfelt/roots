// här ändrar man ex sin bio, sin profilbild och kanske mer. När man trycker på spara = (router.replace('/(tabs)'))

import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { TextInput, View } from "react-native";
import { Text } from "tamagui";
import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefualtInput } from "@/components/ui/input/DefaultInput";
import { DefualtTextArea } from "@/components/ui/input/DefaultTextArea";
import { updateUserProfile, getUserProfile } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const [newPostalcode, setNewPostalcode] = useState("");
  const [newBio, setNewBio] = useState("");


  
  useEffect(() => {
    if (user?.uid) {
      async function fetchProfile() {
        const profile: any = await getUserProfile(user?.uid);
        if (profile) {
          setNewUsername(profile.username || "");
          setNewPostalcode(profile.postalCode || "");
          setNewBio(profile.bio || "");
        }
      }
      fetchProfile();
    }
  }, [user?.uid]);


  async function handleSave() {
    await updateUserProfile(user?.uid, { 
      username: newUsername,
      postalCode: newPostalcode,
      bio: newBio
    });
    router.replace('/(tabs)');
  }

  return (
    <View
      style={{
        height: 300,
        backgroundColor: "blue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
{/* Här ska sedan finnas ett state om bild ej finns skriv ladda upp */}
<DefaultButton variant="tertiary">{"Ändra profilbild"}</DefaultButton> 

      <DefualtInput 
        value={newUsername}
        onChangeText={setNewUsername}
        placeholder="Användarnamn"
      />
      <DefualtInput 
        value={newPostalcode}
        onChangeText={setNewPostalcode}
        placeholder="Postnummer"
      />
      <DefualtTextArea 
        value={newBio}
        onChangeText={setNewBio}
        placeholder="Bio"
      />
      <DefaultButton onPress={handleSave}>Spara</DefaultButton>

    </View>
  );
}
