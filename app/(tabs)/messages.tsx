//Här ska chattfunktionen ligga
import { Platform, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';


export default function MessagesScreen() {

    const router = useRouter();
  return (
    <>
    <Text 
    style={{fontSize: 50, padding: 40}}>MESSAGES</Text>
    </>
  );
}

const styles = StyleSheet.create({

});
