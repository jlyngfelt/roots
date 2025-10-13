import { Platform, StyleSheet, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import TabLayout from './_layout';
import { useAuth } from '../../contexts/AuthContext';
import { DefaultButton } from '@/components/ui/buttons/DefaultButton';


export default function ProfileScreen() {

    const router = useRouter();
      const { user, loading } = useAuth();
  return (
    <>
    <Text 
    style={{fontSize: 50, padding: 40}}>PROFIL</Text>
    <Text style={{fontSize: 50, padding: 40}} >Email: {user?.email}</Text>

    <TabLayout/>
          <DefaultButton
            onPress={() => router.replace("/edit-profile")}
            variant="primary"
          > Redigera profil</DefaultButton>


    </>
  );
}

const styles = StyleSheet.create({

});
