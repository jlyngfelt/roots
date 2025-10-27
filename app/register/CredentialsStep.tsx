import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/forms/DefaultInput";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { Colors, Styles } from "@/constants/design-system";
import { Alert, Image, Linking } from "react-native";
import { Text } from "tamagui";
import { signUp } from "../../auth";
import { CredentialsStepProps } from "@/interfaces";

export default function CredentialsStep({
  email,
  setEmail,
  password1,
  setPassword1,
  password2,
  setPassword2,
  error,
  setError,
  loading,
  setLoading,
  setStep,
  router,
}: CredentialsStepProps) {
  const handleSignUp = async () => {
    setError("");

    if (password1 !== password2) {
      setError("Lösenorden matchar inte");
      return;
    }
    if (password1.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken");
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password1);
      setStep("verification");
      Alert.alert(
        "Verifiera din e-postadress",
        "Vi har skickat ett verifieringsmail till din e-postadress. Vänligen klicka på länken i mailet för att aktivera ditt konto och gå vidare.",
        [
          {
            text: "Öppna e-post",
            onPress: () => Linking.openURL("message:"),
          },
        ]
      );
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("E-postadressen används redan");
      } else if (err.code === "auth/invalid-email") {
        setError("Ogiltigt format på e-postadress");
      } else {
        setError("Något gick fel");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout>
      <Image
        source={require("../../assets/roots_logo.png")}
        style={{ height: 170, margin: 40 }}
        resizeMode="contain"
      />

      <DefaultInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-postadress"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <DefaultInput
        value={password1}
        onChangeText={setPassword1}
        placeholder="Lösenord"
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <DefaultInput
        value={password2}
        onChangeText={setPassword2}
        placeholder="Bekräfta lösenord"
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <Text style={Styles.actionL}>{error}</Text>

      <DefaultButton onPress={handleSignUp} disabled={loading}>
        {loading ? "Registrerar.." : "Registrera"}
      </DefaultButton>

      <DefaultButton
        onPress={() => router.replace("/welcome")}
        variant="tertiary"
        textColor={Colors.primary}
        borderBottomColor={Colors.primary}
      >
        Tillbaka
      </DefaultButton>
    </FormLayout>
  );
}
