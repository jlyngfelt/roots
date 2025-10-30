import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { DefaultInput } from "@/components/ui/inputs/DefaultInput";
import { Colors, Spacing, Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Image, Text } from "tamagui";
import { changeEmail } from "../auth";

export default function UpdateEmailScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    <FormLayout>
      <Image
        source={require("../assets/roots_logo.png")}
        style={{ width: 180, height: 180 }}
        resizeMode="contain"
      />
      <DefaultInput
        value={newEmail}
        onChangeText={setNewEmail}
        placeholder="Ny e-postadress"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <DefaultInput
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        placeholder="Bekräfta e-postadress"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <DefaultInput
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Lösenord"
        secureTextEntry={true}
      />

      <DefaultButton
        onPress={() =>
          handleEmailChange(currentPassword, newEmail, confirmEmail)
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

      <Text style={[Styles.bodyS, { color: Colors.warning }]}>{error}</Text>

      <Text style={[styles.success, Styles.actionM]}>
        {success
          ? "Verifieringsmail skickat, titta i din inkorg för att slutföra registrering!"
          : ""}
      </Text>
    </FormLayout>
  );
}

const styles = StyleSheet.create({
  success: {
    paddingVertical: Spacing.xl,
  },
});
