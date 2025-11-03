import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { redeemTransfer } from '../services/transferService';

interface Props {
  userId: string;
  onSuccess: () => void;
}

export default function ScanTransferCode({ userId, onSuccess }: Props) {
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleCodeScanned = async (code: string) => {
    if (scanned) return;
    setScanned(true);

    const result = await redeemTransfer(code, userId);

    if (result.success) {
      Alert.alert(
        'Tjoho!!!',
        `Givaren fick ${result.credits} credits!`,
        [{ text: 'OK', onPress: onSuccess }]
      );
    } else {
      Alert.alert('Fel', result.error || 'Något gick fel');
      setScanned(false);
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
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Ge tillstånd</Text>
        </TouchableOpacity>
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

            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => setShowManualInput(true)}
            >
              <Text style={styles.manualButtonText}>
                Ange kod manuellt
              </Text>
            </TouchableOpacity>
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
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleManualSubmit}
          >
            <Text style={styles.submitButtonText}>Bekräfta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowManualInput(false)}
          >
            <Text style={styles.backButtonText}>Tillbaka till skanning</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    borderColor: 'white',
    borderRadius: 10,
  },
  instruction: {
    color: 'white',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  manualButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  manualButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  manualContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'white',
  },
  manualTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
    textAlign: 'center',
  },
});