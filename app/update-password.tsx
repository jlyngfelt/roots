import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { DefaultInput } from "@/components/ui/inputs/DefaultInput";
import { Colors, Spacing, Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Image } from "tamagui";
import { changePassword } from "../auth";

export default function UpdatePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      if (newPassword !== confirmPassword) {
        setError("Lösenorden matchar inte");
      }
      if (currentPassword && currentPassword === newPassword) {
        setError("Lösenordet får inte vara samma som tidigare");
      }

      await changePassword(currentPassword, newPassword);
      console.log("Password changed successfully!");
      setSuccess(true);
    } catch (error) {
      setError("Något gick fel")
    }
  };

  return (
    <FormLayout>
      <Image
        source={require("../assets/roots_logo.png")}
        style={{ width: 180, height: 180 }}
        resizeMode="contain"
      />
      <DefaultInput
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Nuvarande lösenord"
        secureTextEntry={true}
      />
      <DefaultInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Nytt lösenord"
        secureTextEntry={true}
      />
      <DefaultInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Nytt lösenord"
        secureTextEntry={true}
      />

      <DefaultButton
        onPress={() =>
          handlePasswordChange(currentPassword, newPassword, confirmPassword)
        }
        disabled={loading}
      >
        {loading ? "Skickar..." : "Spara"}
      </DefaultButton>

      <DefaultButton
        onPress={() => router.replace("/welcome")}
        variant="tertiary"
        textColor={Colors.primary}
        borderBottomColor={Colors.primary}
      >
        Tillbaka
      </DefaultButton>

      {error && <Text style={[Styles.actionL]}>{error}</Text>}

      <Text style={[styles.success, Styles.actionM]}>
        {success ? "Lösenordet uppdaterat!" : ""}
      </Text>
    </FormLayout>
  );
}

const styles = StyleSheet.create({
  success: {
    paddingVertical: Spacing.xl,
  },
});
