import { DefaultButton } from '@/components/ui/buttons/DefaultButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image } from 'react-native'
import { Styles, Spacing, Colors } from '../constants/design-system'
import { stylePropsAll } from 'tamagui';


export default function SuccessScreen() {
  const { credits } = useLocalSearchParams<{ credits: string }>();
  const router = useRouter();

  return (
    <View
    style={styles.bg}>
         <Image
                  source={require("../assets/roots_logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
      <Text
      style={styles.title}
      >Snyggt!!</Text>
      <Text
      style={styles.text}
      >Din plantvän fick precis {credits} credits.</Text>
      <DefaultButton
      onPress={() => router.push('/explore')}>
        Klart!</DefaultButton> 
         

    </View>
  );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
    backgroundColor: Colors.secondary,
    },
      logo: {
        alignSelf: "center",
    width: 250,
    height: 100,
    marginTop: 100,
  },
  title: {
    ...Styles.heading1,
    alignSelf: "center",
    marginTop: 50,
  },
  text: {
    ...Styles.bodyM,
    color: Colors.details,
    alignSelf: "center",
    marginVertical: 20,
  }
});
