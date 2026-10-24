import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

export default function SosScreen({ coupleId }: { coupleId: string }) {
  const triggerSos = () => {
    Alert.alert('SOS Care Broadcasted 🚨', 'Urgent alert sent to your partner!');
  };

  return (
    <View style={styles.container}>
      <AlertCircle color="#E53E3E" size={60} />
      <Text style={styles.title}>SOS Care Alert</Text>
      <Text style={styles.subtitle}>Instantly send an urgent priority alert to your partner.</Text>

      <TouchableOpacity style={styles.sosButton} onPress={triggerSos}>
        <Text style={styles.sosButtonText}>TRIGGER SOS CARE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', justifyContent: 'center', alignItems: 'center', padding: 25 },
  title: { fontSize: 24, fontWeight: '800', color: '#E53E3E', marginTop: 15 },
  subtitle: { fontSize: 14, color: '#718096', textAlign: 'center', marginTop: 8, marginBottom: 30 },
  sosButton: { backgroundColor: '#E53E3E', width: '100%', padding: 20, borderRadius: 16, alignItems: 'center' },
  sosButtonText: { color: '#FFF', fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});