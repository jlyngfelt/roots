import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { FormLayout } from "@/components/ui/forms/FormLayoutComponent";
import { Colors, Styles } from "@/constants/design-system";
import { Alert, Image, Linking } from "react-native";
import { Text } from "tamagui";
import { checkEmailVerified } from "../../auth";
import { VerificationStepProps } from "@/interfaces";


export default function VerificationStep({
  email,
  checkingVerification,
  setCheckingVerification,
  setStep,
}: VerificationStepProps) {
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

  return (
    <FormLayout>
      <Image
        source={require("../../assets/roots_logo.png")}
        style={{ height: 170, margin: 40 }}
        resizeMode="contain"
      />

      <Text
      style={Styles.heading2}
      >Verifiera din e-post</Text>

      <Text style={{ ...Styles.bodyM, textAlign: "center", marginBottom: 30 }}>
        Vi har skickat ett verifieringsmail till {email}. Klicka på länken i
        mailet för att fortsätta.
      </Text>

      <DefaultButton
        onPress={handleManualVerificationCheck}
        disabled={checkingVerification}
      >
        {checkingVerification ? "Kollar..." : "Jag har verifierat"}
      </DefaultButton>

      {/* <DefaultButton
        onPress={handleResendEmail}
        disabled={checkingVerification}
      >
        Skicka nytt verifieringsmail
      </DefaultButton> */}

      <DefaultButton
        onPress={() => Linking.openURL("message:")}
        variant="tertiary"
        textColor={Colors.primary}
        borderBottomColor={Colors.primary}
      >
        Öppna e-post
      </DefaultButton>

      <Text
        style={{
          ...Styles.bodyS,
          textAlign: "center",
          marginTop: 20,
          color: Colors.details,
        }}
      >
        Sidan uppdateras automatiskt när du har verifierat din e-post
      </Text>
    </FormLayout>
  );
}
