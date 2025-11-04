import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { createTransfer } from '../services/transferService';
import { DefaultButton } from './ui/buttons/DefaultButton';
import { GiveAwayProps } from '@/interfaces';
import { Colors, Spacing, Typography, Styles, BorderRadius } from '@/constants/design-system';

export function GiveAwayPlant({ plantId, plantName, userId }: GiveAwayProps) {
  const [transferCode, setTransferCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const code = await createTransfer(plantId, plantName, userId);
      setTransferCode(code);
      setModalVisible(true);
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Kunde inte skapa kod. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <DefaultButton
       onPress={handleGenerateCode}
      disabled={loading}
      style={styles.button}
      >
        {loading ? 'Skapar kod...' : 'Ge bort stickling'}
      </DefaultButton>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Stickling redo att ge bort!</Text>
            <Text style={styles.subtitle}>
              Låt mottagaren skanna denna kod:
            </Text>

            {transferCode && (
              <>
                <View style={styles.qrContainer}>
                  <QRCode value={transferCode} size={200} />
                </View>

                <Text style={styles.codeLabel}>eller ange kod:</Text>
                <Text style={styles.code}>{transferCode}</Text>

                <Text style={styles.info}>
                  Koden är giltig i 24 timmar
                </Text>
              </>
            )}

            <DefaultButton
            onPress={() => setModalVisible(false)}
            >
              Stäng
            </DefaultButton>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    marginLeft: Spacing.xl,
    marginVertical: Spacing.s,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.xl,
    padding: 30,
    alignItems: 'center',
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: Colors.light,
    borderRadius: 10,
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  code: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 20,
  },
  info: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});