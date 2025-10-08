// här kommer laddningssidan vara, här ska vi kolla om anv är inloggad, då skicaks den till tabs, annars till welcome

import { Link } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';


export default function StartScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
<View style={{height: 100, backgroundColor: 'blue', display: 'flex', justifyContent: 'center', alignItems: 'center' }} > 
<Text style={{fontSize: 20, color: 'green'}}>ROOTS</Text>
    </View>

  );
}