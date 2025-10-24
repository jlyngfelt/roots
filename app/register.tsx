import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { DefaultInput } from "@/components/ui/forms/DefaultInput";
import { DefaultTextArea } from "@/components/ui/forms/DefaultTextArea";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { Colors, Styles } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, Image, Linking } from "react-native";
import { Text } from "tamagui";
import { useAuth } from "../contexts/AuthContext";
import { signUp, checkEmailVerified } from "../auth";
import { pickAndUploadImage } from "@/services/imageService";
import { createUserProfile } from "@/services/userService";
import { getCoordinates } from "@/services/locationService";
import { ImagePickerPreview } from "@/components/ui/ImagePickerPreview";

type RegistrationStep = "credentials" | "verification" | "profile";

export default function RegisterScreen() {
  const router = useRouter();
   const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [step, setStep] = useState<RegistrationStep>("credentials");
  const [username, setUsername] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
   const [checkingVerification, setCheckingVerification] = useState(false);

     useEffect(() => {
    let interval: any = null;
    
    if (step === "verification") {
      interval = setInterval(async () => {
        const isVerified = await checkEmailVerified();
        if (isVerified) {
          setStep("profile");
          if (interval) clearInterval(interval);
        }
      }, 3000); // Kolla var 3:e sekund
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step]);

  useEffect(() => {
  if (user && user.emailVerified) {
    setStep("profile");
  }
}, [user]);

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
      setStep("verification")
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

  const handleManualVerificationCheck = async () => {
    setCheckingVerification(true);
    try {
      const isVerified = await checkEmailVerified();
      if (isVerified) {
        setStep("profile");
      } else {
        Alert.alert(
          "Inte verifierad än",
          "Din e-postadress är inte verifierad ännu. Kolla din inkorg och klicka på verifieringslänken."
        );
      }
    } finally {
      setCheckingVerification(false);
    }
  };

   async function handleImageUpload() {
      if (!user?.uid) return;
  
      try {
        setUploading(true);
        const downloadURL = await pickAndUploadImage("profiles", user.uid);
        if (downloadURL) {
          setProfileImageUrl(downloadURL);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUploading(false);
      }
    }
  const handleCreateProfile = async () => {
      setError("");
      if (!username.trim()) {
        setError("Användarnamn krävs");
        return;
      }
      if (!postalCode.trim()) {
        setError("Postnummer krävs");
        return;
      }
      if (!user) {
        setError("Ingen användare inloggad");
        return;
      }
      setLoading(true);
  
      try {
        const coordinates = await getCoordinates(postalCode.trim());
  
        if (!coordinates) {
          setError("Ogiltigt postnummer. Kontrollera och försök igen.");
          setLoading(false);
          return;
        }
        await createUserProfile(user.uid, {
          username: username.trim(),
          postalCode: postalCode.trim(),
          lat: coordinates.lat,
          lon: coordinates.lon,
          bio: bio.trim(),
          profileImageUrl: profileImageUrl,
        });
  
        router.replace("/(tabs)/explore");
      } catch (err) {
        console.error(err);
        setError("Kunde inte skapa profil");
      } finally {
        setLoading(false);
      }
    };

    if (step === "credentials") {
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

  // Steg 2: Väntar på email-verifikation
  if (step === "verification") {
    return (
      <FormLayout>
        <Image
          source={require("../assets/roots_logo.png")}
          style={{ height: 170, margin: 40 }}
          resizeMode="contain"
        />

        <Text >
          Verifiera din e-post
        </Text>

        <Text style={{ ...Styles.bodyM, textAlign: "center", marginBottom: 30 }}>
          Vi har skickat ett verifieringsmail till {email}. Klicka på länken i mailet för att fortsätta.
        </Text>

        <DefaultButton
          onPress={handleManualVerificationCheck}
          disabled={checkingVerification}
        >
          {checkingVerification ? "Kollar..." : "Jag har verifierat"}
        </DefaultButton>

        <DefaultButton
          onPress={() => Linking.openURL("message:")}
          variant="tertiary"
          textColor={Colors.details}
          borderBottomColor={Colors.details}
        >
          Öppna e-post
        </DefaultButton>

        <Text style={{ ...Styles.bodyS, textAlign: "center", marginTop: 20, color: Colors.details }}>
          Sidan uppdateras automatiskt när du har verifierat din e-post
        </Text>
      </FormLayout>
    );
  }
         return (
<FormLayout>
      <Image
        source={require("../assets/roots_logo.png")}
        style={{ height: 70, margin: 10 }}
        resizeMode="contain"
      />
      <ImagePickerPreview
        imageUrl={profileImageUrl}
        onPress={handleImageUpload}
        isUploading={uploading}
      />

      <DefaultButton
        onPress={handleImageUpload}
        variant="tertiary"
        textColor={Colors.details}
        borderBottomColor={Colors.details}
      >
        Ladda upp bild
      </DefaultButton>

      <DefaultInput
        value={username}
        onChangeText={setUsername}
        placeholder="Användarnamn"
        autoCapitalize="none"
      />

      <DefaultInput
        value={postalCode}
        onChangeText={setPostalCode}
        placeholder="Postnummer"
        autoCapitalize="characters"
        maxLength={5}
      />

      <DefaultTextArea
        value={bio}
        onChangeText={setBio}
        placeholder="Beskrivning..."
      />

      <Text style={Styles.actionL}>{error}</Text>

      <DefaultButton
        onPress={handleCreateProfile}
        disabled={loading || uploading}
      >
        {loading ? "Sparar..." : "Spara"}
      </DefaultButton>

      {/* <DefaultButton
        onPress={() => router.replace("/welcome")}
        variant="tertiary"
        textColor={Colors.primary}
        borderBottomColor={Colors.primary}
      >
        Tillbaka
      </DefaultButton> */}
    </FormLayout>
  );
}