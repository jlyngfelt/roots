import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { DefaultInput } from "@/components/ui/inputs/DefaultInput";
import { Colors, Spacing, Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Image } from "tamagui";
import { changeEmail } from "../auth";
import { useAuth } from "@/contexts/AuthContext"; 

export default function UpdateEmailScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

    const handleEmailChange = async () => {
    setError("");
    setSuccess(false);

    // Validering
    if (!currentPassword.trim()) {
      setError("Ange ditt nuvarande lösenord");
      return;
    }

    if (!newEmail.trim() || !confirmEmail.trim()) {
      setError("Fyll i alla fält");
      return;
    }

    if (newEmail !== confirmEmail) {
      setError("E-postadresserna matchar inte");
      return;
    }

    if (newEmail === user?.email!) {
      setError("Detta är redan din nuvarande e-postadress");
      return;
    }

    try {
      setLoading(true);
      await changeEmail(currentPassword, newEmail);
      console.log("Email changed successfully!");
      setSuccess(true);
      setCurrentPassword("");
      setNewEmail("");
      setConfirmEmail("");
    } catch (error: any) {
      console.error("Error changing email:", error);
      
      if (error.code === "auth/wrong-password") {
        setError("Fel lösenord");
      } else if (error.code === "auth/invalid-email") {
        setError("Ogiltig e-postadress");
      } else if (error.code === "auth/email-already-in-use") {
        setError("E-postadressen används redan");
      } else if (error.code === "auth/too-many-requests") {
        setError("För många försök. Försök igen senare");
      } else {
        setError("Något gick fel. Försök igen");
      }
    } finally {
      setLoading(false);
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
        onPress={() => handleEmailChange() }
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
