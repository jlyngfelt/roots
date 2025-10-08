import { Platform, StyleSheet, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import TabLayout from './_layout';


export default function ProfileScreen() {

    const router = useRouter();
  return (
    <>
    <Text 
    style={{fontSize: 50, padding: 40}}>PROFIL</Text>

    <TabLayout/>
          <Button
            onPress={() => router.replace("/edit-profile")}
            title="REDIGERA PROFIL"
            color="#ce7ece"
            accessibilityLabel="create account"
          />
    </>
  );
}

const styles = StyleSheet.create({

});
