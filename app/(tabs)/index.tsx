import { Platform, StyleSheet, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import TabLayout from './_layout';
import { useAuth } from '../../contexts/AuthContext';


export default function ProfileScreen() {

    const router = useRouter();
      const { user, loading } = useAuth();
  return (
    <>
    <Text 
    style={{fontSize: 50, padding: 40}}>PROFIL</Text>
    <Text style={{fontSize: 50, padding: 40}} >Email: {user?.email}</Text>

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
