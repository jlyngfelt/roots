import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/input/DefaultInput";
import { Colors, Spacing, Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Image, Text } from "tamagui";
import { changePassword } from "../auth";


export default function UpdatePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = async (
    currentPassword: string,
    newPassword1: string,
    newPassword2: string
  ) => {
    try {
      if (newPassword1 !== newPassword2) {
        throw new Error("Lösenorden matchar inte");
      }
      if (currentPassword === newPassword1) {
        throw new Error("Lösenordet får inte vara samma som tidigare");
      }

      await changePassword(currentPassword, newPassword1);
      console.log("Password changed successfully!");
      setSuccess(true);
    } catch (error) {
      throw error;
    }
  };

  return (
    <ScrollView style={styles.feed}>
    <View style={styles.form}>

      <Image
        source={require("../assets/roots_logo.png")}
        style={{ width: 300 }}
        resizeMode="contain"
        />
    <View style={styles.inputfields}>

      <DefaultInput
      style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Nuvarande lösenord"
        secureTextEntry={true}
        />
      <DefaultInput
      style={styles.input}
        value={newPassword1}
        onChangeText={setNewPassword1}
        placeholder="Nytt lösenord"
        secureTextEntry={true}
        />
      <DefaultInput
      style={styles.input}
        value={newPassword2}
        onChangeText={setNewPassword2}
        placeholder="Nytt lösenord"
        secureTextEntry={true}
        
        />
        </View>

      <Text fontSize="$3">{error}</Text>

      <DefaultButton
        onPress={() =>
            handlePasswordChange(currentPassword, newPassword1, newPassword2)
        }
        disabled={loading}
        >
        {loading ? "Skickar..." : "Spara"}
      </DefaultButton>

      <Text style={[styles.success, Styles.actionM]}>
        {success ? "Lösenordet uppdaterat!" : ""}
      </Text>

      <DefaultButton
        onPress={() => router.replace("/welcome")}
        variant="tertiary"
        >
        Tillbaka
      </DefaultButton>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  feed: {
    marginBottom: 80,
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputfields: {
    gap: Spacing.s
  },
  input: {
    width: 200
  },
  success: {
    paddingVertical: Spacing.m
  },
});
