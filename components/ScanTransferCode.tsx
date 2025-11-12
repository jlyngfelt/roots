import { ScanProps } from '@/interfaces';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState, useRef } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { Colors, Spacing, Styles, BorderRadius } from "../constants/design-system";
import { redeemTransfer } from '../services/transferService';
import { DefaultButton } from './ui/buttons/DefaultButton';
import { useRouter } from "expo-router";

export default function ScanTransferCode({ userId, onSuccess }: ScanProps) {
  const [scanned, setScanned] = useState(false);
const isProcessingRef = useRef(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
   const router = useRouter();

  const handleCodeScanned = async (code: string) => {
     if (isProcessingRef.current) return;
     isProcessingRef.current = true;
    setScanned(true);

    const result = await redeemTransfer(code, userId);

    if (result.success) {
   router.push({
  pathname: '/success',
  params: { credits: result.credits }
});
    } else {
      Alert.alert('Fel', result.error || 'Något gick fel');
      setScanned(false);
      isProcessingRef.current = false;
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.length === 5) {
      handleCodeScanned(manualCode.toUpperCase());
    } else {
      Alert.alert('Fel', 'Koden måste vara 5 tecken lång');
    }
  };

  // Begär tillstånd om vi inte har det
  if (!permission) {
    return <Text>Laddar...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Vi behöver tillgång till kameran för att skanna QR-koder
        </Text>
        <DefaultButton
          onPress={requestPermission}
        >
          Ge tillstånd
        </DefaultButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!showManualInput ? (
        <>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
       onBarcodeScanned={
  scanned
    ? undefined
    : ({ data }) => {
        if (data) {
          handleCodeScanned(data);
        }
      }
}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />

          <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Text style={styles.instruction}>
              Rikta kameran mot QR-koden
            </Text>

            <DefaultButton
            onPress={() => setShowManualInput(true)}
            style={styles.button}
            >
              Ange kod manuellt
            </DefaultButton>
          </View>
        </>
      ) : (
        <View style={styles.manualContainer}>
          <Text style={styles.manualTitle}>Ange kod</Text>
          <TextInput
            style={styles.input}
            value={manualCode}
            onChangeText={setManualCode}
            placeholder="5 tecken"
            maxLength={5}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <DefaultButton
          onPress={handleManualSubmit}
          >
            Bekräfta
          </DefaultButton>

          <DefaultButton
          variant='tertiary'
          onPress={() => setShowManualInput(false)}
          style={styles.button}
          textColor={Colors.primary}
        borderBottomColor={Colors.primary}
          >
            Tillbaka till skanning
          </DefaultButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    ...Styles.bodyL,
    textAlign: 'center',
    marginBottom: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.light,
    borderRadius: 10,
  },
  instruction: {
    color: Colors.light,
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  manualContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: Colors.light,
  },
  manualTitle: {
    ...Styles.heading1,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.details,
    borderRadius: BorderRadius.m,
    padding: 15,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 20,
  },
  button: {
marginVertical: Spacing.l,
  },
  backButton: {
    padding: 15,
  },
});