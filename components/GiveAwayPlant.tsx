import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { createTransfer } from '../services/transferService';

interface Props {
  plantId: string;
  plantName: string;
  userId: string;
}

export function GiveAwayPlant({ plantId, plantName, userId }: Props) {
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
      <TouchableOpacity
        style={styles.button}
        onPress={handleGenerateCode}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Skapar kod...' : '🌱 Ge bort stickling'}
        </Text>
      </TouchableOpacity>

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

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Stäng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
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
    backgroundColor: '#f5f5f5',
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