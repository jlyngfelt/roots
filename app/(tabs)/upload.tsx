//Här ska man ladda upp nya bilder på plantor ( ej profilbild )

import { Platform, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';


export default function UploadScreen() {

    const router = useRouter();
  return (
    <>
    <Text 
    style={{fontSize: 50, padding: 40}}>UPLOAD</Text>
    </>
  );
}

const styles = StyleSheet.create({

});
