import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/input/DefaultInput";
import { Colors, Spacing, Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Image, Text } from "tamagui";
import { changeEmail } from "../auth";


export default function UpdateEmailScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);

  const handleEmailChange = async (
    currentPassword: string,
    newEmail: string,
    confirmEmail: string
  ) => {
    try {
      if (newEmail !== confirmEmail) {
        throw new Error("E-mail matchar inte");
      }

      await changeEmail(currentPassword, newEmail);
      console.log("Email changed successfully!");
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
        value={newEmail}
        onChangeText={setNewEmail}
        placeholder="Ny mail"
        secureTextEntry={true}
        />
      <DefaultInput
      style={styles.input}
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        placeholder="Ny mail"
        secureTextEntry={true}
        />
      <DefaultInput
      style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Lösenord"
        secureTextEntry={true}
        />
        </View>

      <Text fontSize="$3">{error}</Text>

      <DefaultButton
        onPress={() =>
            handleEmailChange(currentPassword, newEmail, confirmEmail)
        }
        disabled={loading}
        >
        {loading ? "Skickar..." : "Spara"}
      </DefaultButton>

      <Text style={[styles.success, Styles.actionM]}>
        {success ? "Verifieringsmail skickat, titta i din inkorg för att slutföra registrering!" : ""}
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
    paddingVertical: Spacing.m,
    textAlign: "center"
  },
});
