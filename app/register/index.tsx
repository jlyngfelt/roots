import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { checkEmailVerified } from "../../auth";
import { useAuth } from "../../contexts/AuthContext";
import CredentialsStep from "./CredentialsStep";
import ProfileStep from "./ProfileStep";
import VerificationStep from "./VerificationStep";

type RegistrationStep = "credentials" | "verification" | "profile";

export default function RegisterScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams();

const [step, setStep] = useState<RegistrationStep>(() => {
  if (params.fromLogin === 'true') return "verification";
  if (user && user.emailVerified) return "profile";
  return "credentials";
});
    const [email, setEmail] = useState(
    typeof params.email === 'string' ? params.email : ""
  );
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);

useEffect(() => {
  let interval: any = null;

  if (step === "verification" && user) {
    interval = setInterval(async () => {
      try {
        const isVerified = await checkEmailVerified();
        if (isVerified) {
          setStep("profile");
          if (interval) clearInterval(interval);
        }
      } catch (error) {
        setError("Något gick fel i verifieringen, försök igen");
              }
    }, 3000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [step, user]);

  useEffect(() => {
    if (user && user.emailVerified) {
      setStep("profile");
    }
  }, [user]);

  return (
    <>
      {step === "credentials" && (
        <CredentialsStep
          email={email}
          setEmail={setEmail}
          password1={password1}
          setPassword1={setPassword1}
          password2={password2}
          setPassword2={setPassword2}
          error={error}
          setError={setError}
          loading={loading}
          setLoading={setLoading}
          setStep={setStep}
          router={router}
        />
      )}
      {step === "verification" && (
        <VerificationStep
          email={email}
          checkingVerification={checkingVerification}
          setCheckingVerification={setCheckingVerification}
          setStep={setStep}
        />
      )}
      {step === "profile" && (
        <ProfileStep
          user={user}
          username={username}
          setUsername={setUsername}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          bio={bio}
          setBio={setBio}
          profileImageUrl={profileImageUrl}
          setProfileImageUrl={setProfileImageUrl}
          error={error}
          setError={setError}
          loading={loading}
          setLoading={setLoading}
          uploading={uploading}
          setUploading={setUploading}
          router={router}
        />
      )}
    </>
  );
}
