import { Colors, Spacing, Styles } from "@/constants/design-system";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AboutAppScreen() {
  const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
    <View style={styles.faqItem}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.answer}>{answer}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainHeading}>Om Roots  🌱</Text>
      
      <Text style={styles.intro}>
        Välkommen till Roots - där människors växtintresse får gro, utan att dess plånböcker krymper! 
        Vi tror på att gröna hem är vackrare och att detta ska delas, en planta i taget.
      </Text>

      <View style={styles.divider} />

      <Text style={styles.sectionHeading}>Vanliga frågor</Text>

      <FAQItem
        question="Vad är Roots?"
        answer="Roots är en app för dig som älskar växter! Här kan du ge bort eller byta sticklingar, helt gratis. Perfekt när dina växter har vuxit ifrån dig, eller när du längtar efter något nytt utan att betala dyra pengar på blomsteraffären."
      />

      <FAQItem
        question="Hur fungerar det?"
        answer="Det är superenkelt! Ladda upp en bild på din planta, beskriv den kort, och markera om den är redo att adoptera. Andra användare i ditt område kan då hitta och kontakta dig via chatten. När ni kommit överens möts ni upp för att byta."
      />

      <FAQItem
        question="Kostar det något?"
        answer="Nope! Roots är helt gratis att använda. Vi vill att alla ska kunna dela växtglädje utan att plånboken behöver öppnas."
      />

      <FAQItem
        question="Hur hittar jag växter nära mig?"
        answer="När du skapar din profil anger du ditt postnummer. Appen visar då hur långt det är till varje planta. Så kan du lätt hitta gröna grannar och slippa resa halva stan för en liten stickling."
      />

      <FAQItem
        question="Vad betyder 'redo att adoptera'?"
        answer="När du markerar en planta som 'redo att adoptera' betyder det att den är redo att flytta till ett nytt hem direkt. Kanske har du tagit en stickling, eller så vill du bara hitta ett nytt hem åt en planta du inte längre har plats för."
      />

      <FAQItem
        question="Måste jag kunna mycket om växter?"
        answer="Absolut inte! Roots är för alla, från de som knappt vet skillnaden mellan jord och kompost till erfarna plantföräldrar. Det viktiga är glädjen i att dela och ta hand om växter tillsammans."
      />

      <FAQItem
        question="Hur kontaktar jag någon?"
        answer="När du hittar en planta du gillar, klicka på den och tryck på 'Kontakta'. Då öppnas en chatt där ni kan prata om växten, komma överens om tid och plats för byte, och kanske till och med dela skötselråd!"
      />

      <FAQItem
        question="Kan jag spara favoritväxter?"
        answer="Ja! Tryck på hjärtat på en växtannons så sparas den bland dina favoriter. Perfekt när du hittar något spännande men inte är redo att byta än."
      />

      <FAQItem
        question="Vad händer om jag inte vill ha en växt längre?"
        answer="Du kan när som helst redigera eller ta bort dina annonser i inställningarna. Ingen press. Dina växter, dina val!"
      />

      <View style={styles.divider} />

      <Text style={styles.sectionHeading}>Credits-systemet</Text>

      <FAQItem
        question="Vad är credits?"
        answer="Credits är Roots egen valuta! Varje gång du lyckas ge bort eller adoptera en planta får du 100 credits som bevis på att du är en del av växtdelnings-communityn. I dagsläget är det mest en rolig badge of honor, men framöver kanske vi hittar på något spännande att använda dem till!"
      />

      <FAQItem
        question="Hur fungerar överlämningen?"
        answer="När ni träffats och plantbytet sker: den som ger bort plantan trycker på 'Ge bort'-knappen på sin planta. Då dyker en 5-siffrig kod och en QR-kod upp. Den som tar emot plantan trycker också på 'Ta emot'-knappen, men får då upp kameran för att scanna QR-koden (eller skriva in koden manuellt). När koden matchat får den generösa givaren 100 credits direkt!"
      />

      <FAQItem
        question="Varför ska jag bry mig om credits?"
        answer="Förutom att det känns riktigt bra att se sitt credits-saldo växa, visar det hur aktiv du är i Roots-gemenskapen. Det är som ett litet kvitto på alla plantor du hjälpt att hitta nya hem. Och vem vet, kanske blir de användbara för något coolt i framtiden!"
      />

      <View style={styles.divider} />

      <Text style={styles.sectionHeading}>Säkerhet & Tips</Text>

      <FAQItem
        question="Är det säkert att mötas upp med främlingar?"
        answer="Vi rekommenderar alltid att mötas på offentliga platser i dagsljus, precis som vid andra uppköp online. Lita på din magkänsla, och ta gärna med en vän om du känner dig osäker. De flesta i Roots-gemenskapen är där av samma anledning som du, men detta går aldrig att veta säkert!"
      />

      <FAQItem
        question="Kan jag använda Roots på landet?"
        answer="Roots fungerar bäst i tätbefolkade områden där det finns fler användare nära varandra. Men ju fler som börjar använda appen, desto större chans att du hittar plantavänner även i mer glesbefolkade områden. Spread the root!"
      />

      <View style={styles.divider} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Har du fler frågor? Hör av dig via inställningar eller mejla oss. 
          Tillsammans gör vi svenska hem lite grönare! 
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.m,
  },
  mainHeading: {
    ...Styles.heading1,
    textAlign: "center",
    marginTop: Spacing.l,
    marginBottom: Spacing.m,
  },
  intro: {
    ...Styles.bodyL,
    textAlign: "center",
    marginBottom: Spacing.m,    
    lineHeight: 24,
  },
  sectionHeading: {
    ...Styles.heading2,
    marginTop: Spacing.m,
    marginBottom: Spacing.m,
  },
  faqItem: {
    marginBottom: Spacing.l,
  },
  question: {
    ...Styles.heading3,
    marginBottom: Spacing.xs,
  },
  answer: {
    ...Styles.bodyM,
    lineHeight: 22,
    color: Colors.text,
  },
  divider: {
    height: 1.5,
    backgroundColor: Colors.grey,
    marginVertical: Spacing.l,
  },
  footer: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: Spacing.m,
    marginVertical: Spacing.m,
    marginBottom: Spacing.xl,
  },
  footerText: {
    ...Styles.bodyM,
    textAlign: "center",
    lineHeight: 22,
  },
});