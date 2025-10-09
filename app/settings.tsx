import { useEffect } from 'react';
import { StyleSheet, View} from 'react-native';
import { useRouter } from 'expo-router';
import { logOut } from "../auth";
import { Button, Input, Text } from "tamagui";


export default function WelcomeScreen() {
  const router = useRouter();

  return (
<View style={{height: 100, backgroundColor: 'blue', display: 'flex', justifyContent: 'center', alignItems: 'center' }} > 
<Text style={{fontSize: 20, color: 'green'}}>ROOTS</Text>

      <Button
        onPress={() => logOut()}
        color="#841584"
        size="$4"
        marginVertical="10"
      >
        {'Logga ut'}
      </Button>

    </View>

  );
}