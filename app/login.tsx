import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { DefaultInput } from "@/components/ui/inputs/DefaultInput";
import { Colors, Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Alert } from "react-native";
import { Text } from "tamagui";
import { signIn } from "../auth";
import { signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebaseConfig";


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendVerificationEmailAgain, setSendVerificationEmailAgain] = useState(false)

  const handleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)/explore");
    } catch (err: any) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/invalid-email"
      ) {
        setError("Fel e-postadress eller lösenord");
      } else if (err.code === "auth/too-many-requests") {
        setError("För många försök, försök igen senare");
      } else if (err.code === "auth/user-disabled") {
        setError("Kontot är inaktiverat");
      } else if (err.message === "EMAIL_NOT_VERIFIED") {
        setError("Du måste verifiera din email först. Kolla din inkorg!");
        setSendVerificationEmailAgain(true)
      } else {
        setError("Kunde inte logga in");
        console.error(err.code);
      }
    } finally {
      setLoading(false);
    }
  };

const handleResendEmail = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    
    await sendEmailVerification(userCredential.user);
    
    Alert.alert(
      "E-post skickad",
      "Vi har skickat ett nytt verifieringsmail till " + email
    );

    router.push({
      pathname: '/register',
      params: { fromLogin: 'true', email: email.trim() }
    });
  } catch (error) {
    Alert.alert(
      "Fel",
      "Kunde inte skicka e-post. Kontrollera att e-post och lösenord är rätt."
    );
  }
};

  return (
    <FormLayout>
      <Image
        source={require("../assets/roots_logo.png")}
        style={{ height: 170, margin: 40 }}
        resizeMode="contain"
      />

      <DefaultInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-postadress"
        keyboardType="email-address"
        autoCapitalize="none"
        color={Colors.warning}
      />

      <DefaultInput
        value={password}
        onChangeText={setPassword}
        placeholder="Lösenord"
        secureTextEntry={true}
        autoCapitalize="none"
      />
            <Text style={Styles.actionL}>{error}</Text>
    {sendVerificationEmailAgain ? <>
            <DefaultButton
            onPress={handleResendEmail}
            >
        Skicka nytt verifieringsmail
      </DefaultButton>
        </>
       : ""}

      <DefaultButton onPress={handleSignIn} disabled={loading}>
        {loading ? "Loggar in.." : "Logga in"}
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