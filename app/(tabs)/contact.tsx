import { DefaultButton } from "@/components/ui/buttons/DefaultButton";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Spacing, Styles, Typography } from "@/constants/design-system";
import { useRouter } from "expo-router";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ContactPage() {
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL("mailto:support@roots.se");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.innerContainer}>
        <Image
          source={require("../../assets/roots_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={[Styles.heading1, styles.heading]}>
          Behöver du kontakta oss?
        </Text>

        <Text style={[Styles.bodyM, styles.text]}>
          Är det något som krånglar i appen, har du ett förslag på en ny
          kategori, har du inte fått credits efter ett byte eller vill du bara
          skriva och säga hur mycket du älskar ROOTS?
        </Text>

        <Text style={[Styles.bodyM, styles.text]}>
          Tveka inte på att höra av dig till oss oavsett vad ärendet gäller! 🩷
          🌱
        </Text>

        <DefaultButton onPress={handleEmailPress} style={styles.button}>
          <View style={styles.buttonContent}>
            <IconSymbol name="envelope" size={20} color={Colors.light} />
            <Text style={[Styles.actionL, styles.buttonText]}>
              Skicka ett mejl
            </Text>
          </View>
        </DefaultButton>

        <Text style={[Styles.bodyS, styles.footer]}>
          Funkar inte knappen? Släng iväg ett mejl till:
        </Text>
        <Text style={[Styles.bodyS, styles.email]}>support@roots.se</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  innerContainer: {
    alignItems: "center",
    maxWidth: 500,
  },
  logo: {
    width: 250,
    height: 100,
    marginBottom: Spacing.l,
  },
  heading: {
    textAlign: "center",
    marginBottom: Spacing.l,
  },
  text: {
    textAlign: "center",
    marginBottom: Spacing.m,
    lineHeight: 22,
  },
  button: {
    marginVertical: Spacing.m,
    paddingHorizontal: Spacing.xl,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s,
  },
  buttonText: {
    color: Colors.light,
  },
  footer: {
    textAlign: "center",
    color: Colors.details,
  },
  email: {
    textAlign: "center",
    color: Colors.details,
    fontFamily: Typography.fontFamily.bold, // Use your font family
    marginTop: Spacing.xs,
  },
});
