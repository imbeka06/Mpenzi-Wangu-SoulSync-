import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  AlertCircle,
  PhoneCall,
  MessageSquare,
  Settings,
  ShieldAlert,
  Save,
  CheckCircle2,
  MapPin,
} from 'lucide-react-native';
import * as Location from 'expo-location';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

export default function SOSScreen({
  coupleId = 'couple_demo_123',
}: {
  coupleId?: string;
}) {
  const { colors } = useTheme();

  // Setup vs Active Dashboard State
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // Saved Contacts State
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [contactName, setContactName] = useState('');

  // Real-time Firestore Listener
  useEffect(() => {
    if (!coupleId) return;

    const sosRef = doc(db, 'couples', coupleId, 'settings', 'sos');
    const unsubscribe = onSnapshot(sosRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEmergencyPhone(data.emergencyPhone || '');
        setWhatsappPhone(data.whatsappPhone || '');
        setContactName(data.contactName || '');
      } else {
        setIsSettingUp(true);
      }
    });

    return () => unsubscribe();
  }, [coupleId]);

  // Helper Function: Fetch Current Device Location
  const getCurrentLocationUrl = async (): Promise<string | null> => {
    try {
      setIsFetchingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Denied',
          'Sending alert without location. Enable location permissions in settings for GPS tracking.'
        );
        setIsFetchingLocation(false);
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setIsFetchingLocation(false);
      return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    } catch (error) {
      console.log('Location fetch error:', error);
      setIsFetchingLocation(false);
      return null;
    }
  };

  // Save Initial Contacts Setup
  const handleSaveSetup = async () => {
    if (!emergencyPhone.trim() || !whatsappPhone.trim()) {
      Alert.alert(
        'Missing Numbers',
        'Please provide both a phone number for calls/SMS and a WhatsApp number.'
      );
      return;
    }

    try {
      await setDoc(
        doc(db, 'couples', coupleId, 'settings', 'sos'),
        {
          emergencyPhone: emergencyPhone.trim(),
          whatsappPhone: whatsappPhone.trim(),
          contactName: contactName.trim() || 'My Mpenzi Emergency Contact',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      Alert.alert('SOS Contact Saved! 🛡️', 'Emergency contacts are configured.');
      setIsSettingUp(false);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  // Trigger Phone Call
  const handleTriggerEmergencyCall = () => {
    if (!emergencyPhone) {
      Alert.alert('No Number Saved', 'Please complete the SOS Setup first.');
      setIsSettingUp(true);
      return;
    }
    Linking.openURL(`tel:${emergencyPhone}`);
  };

  // Trigger WhatsApp Alert with GPS Location Link
  const handleTriggerWhatsAppAlert = async () => {
    if (!whatsappPhone) {
      Alert.alert('No Number Saved', 'Please complete the SOS Setup first.');
      setIsSettingUp(true);
      return;
    }

    const mapUrl = await getCurrentLocationUrl();

    let textBody = `🚨 EMERGENCY ALERT FROM MPENZI-WANGU! 🚨\n\nI need immediate assistance! Please check on me or call me back right away!`;
    if (mapUrl) {
      textBody += `\n\n📍 My Live Location:\n${mapUrl}`;
    }

    const encodedMessage = encodeURIComponent(textBody);
    const formattedNum = whatsappPhone.replace(/[^0-9]/g, '');
    Linking.openURL(`https://wa.me/${formattedNum}?text=${encodedMessage}`);
  };

  // Trigger Direct SMS with GPS Location Link
  const handleTriggerSMSAlert = async () => {
    if (!emergencyPhone) {
      Alert.alert('No Number Saved', 'Please complete the SOS Setup first.');
      setIsSettingUp(true);
      return;
    }

    const mapUrl = await getCurrentLocationUrl();

    let textBody = `🚨 EMERGENCY ALERT FROM MPENZI-WANGU! 🚨 I need immediate help! Please call me immediately!`;
    if (mapUrl) {
      textBody += ` 📍 Live Location: ${mapUrl}`;
    }

    const encodedMessage = encodeURIComponent(textBody);
    Linking.openURL(`sms:${emergencyPhone}?body=${encodedMessage}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* HEADER */}
      <View style={[styles.headerCard, { backgroundColor: '#FFF5F5', borderColor: '#FED7D7' }]}>
        <AlertCircle color="#E53E3E" size={36} />
        <Text style={styles.title}>SOS Emergency Care 🛡️</Text>
        <Text style={styles.subtitle}>
          Instant emergency calls, SMS & WhatsApp alerts with live GPS coordinates
        </Text>

        <TouchableOpacity
          style={styles.setupToggleBtn}
          onPress={() => setIsSettingUp(!isSettingUp)}
        >
          <Settings color="#E53E3E" size={16} />
          <Text style={styles.setupToggleText}>
            {isSettingUp ? 'Close Setup' : 'Edit Contacts'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* VIEW 1: INITIAL SETUP FORM */}
      {isSettingUp || !emergencyPhone ? (
        <View style={[styles.setupCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.setupHeader, { color: colors.headerText }]}>
            Initial SOS Contacts Setup ⚙️
          </Text>
          <Text style={[styles.setupDesc, { color: colors.subText }]}>
            Set up the phone and WhatsApp numbers that will receive instant emergency alerts with your live location.
          </Text>

          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
            placeholder="Contact Name (e.g., Honey / Sister)"
            placeholderTextColor="#A0AEC0"
            value={contactName}
            onChangeText={setContactName}
          />

          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
            placeholder="Emergency Phone & SMS Number (+254...)"
            placeholderTextColor="#A0AEC0"
            keyboardType="phone-pad"
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
          />

          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
            placeholder="Emergency WhatsApp Number (+254...)"
            placeholderTextColor="#A0AEC0"
            keyboardType="phone-pad"
            value={whatsappPhone}
            onChangeText={setWhatsappPhone}
          />

          <TouchableOpacity style={styles.saveSetupBtn} onPress={handleSaveSetup}>
            <Save color="#FFF" size={18} />
            <Text style={styles.saveSetupText}>Save Emergency Contacts</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* VIEW 2: ACTIVE SOS EMERGENCY DASHBOARD */
        <View style={styles.alertDashboard}>
          <View style={[styles.contactTag, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <CheckCircle2 color="#27AE60" size={18} />
            <Text style={[styles.contactTagText, { color: colors.inputText }]}>
              Configured Contact: {contactName || 'Mpenzi Partner'} ({emergencyPhone})
            </Text>
          </View>

          {/* Location Loading Indicator Overlay */}
          {isFetchingLocation && (
            <View style={styles.fetchingBox}>
              <ActivityIndicator color="#E53E3E" size="small" />
              <Text style={styles.fetchingText}>Acquiring GPS Live Coordinates...</Text>
            </View>
          )}

          {/* GIANT RED CALL BUTTON */}
          <TouchableOpacity
            style={styles.giantSosButton}
            onPress={handleTriggerEmergencyCall}
            activeOpacity={0.8}
          >
            <ShieldAlert color="#FFF" size={54} />
            <Text style={styles.giantSosText}>TAP TO CALL SOS</Text>
            <Text style={styles.giantSosSubText}>Opens phone dialer immediately</Text>
          </TouchableOpacity>

          {/* SECONDARY EMERGENCY ACTIONS */}
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#25D366' }]}
              onPress={handleTriggerWhatsAppAlert}
            >
              <MessageSquare color="#FFF" size={26} />
              <Text style={styles.actionCardTitle}>Send WhatsApp SOS</Text>
              <Text style={styles.actionCardSub}>Includes Live GPS Location Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#3182CE' }]}
              onPress={handleTriggerSMSAlert}
            >
              <MapPin color="#FFF" size={26} />
              <Text style={styles.actionCardTitle}>Send Direct SMS</Text>
              <Text style={styles.actionCardSub}>Includes Live GPS Location Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  headerCard: { padding: 20, borderRadius: 24, alignItems: 'center', borderWidth: 1, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', marginTop: 10, color: '#E53E3E' },
  subtitle: { fontSize: 12, color: '#718096', marginTop: 2, textAlign: 'center' },
  setupToggleBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FED7D7', marginTop: 12, gap: 6 },
  setupToggleText: { fontSize: 11, fontWeight: '800', color: '#E53E3E' },

  setupCard: { padding: 20, borderRadius: 24, borderWidth: 1, gap: 12 },
  setupHeader: { fontSize: 17, fontWeight: '800' },
  setupDesc: { fontSize: 12, lineHeight: 18, marginBottom: 5 },
  input: { width: '100%', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1, fontSize: 13 },
  saveSetupBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E53E3E', paddingVertical: 14, borderRadius: 16, gap: 8, marginTop: 8 },
  saveSetupText: { color: '#FFF', fontWeight: '800', fontSize: 13 },

  alertDashboard: { gap: 20, alignItems: 'center' },
  contactTag: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, gap: 8, width: '100%' },
  contactTagText: { fontSize: 12, fontWeight: '700' },

  fetchingBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF5F5', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#FED7D7' },
  fetchingText: { fontSize: 11, fontWeight: '700', color: '#E53E3E' },

  giantSosButton: { width: 220, height: 220, borderRadius: 110, backgroundColor: '#E53E3E', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#E53E3E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 },
  giantSosText: { color: '#FFF', fontWeight: '900', fontSize: 18, marginTop: 10, letterSpacing: 1 },
  giantSosSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },

  actionGrid: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 10 },
  actionCard: { flex: 1, padding: 18, borderRadius: 20, alignItems: 'center', gap: 6 },
  actionCardTitle: { color: '#FFF', fontWeight: '800', fontSize: 13, marginTop: 4 },
  actionCardSub: { color: 'rgba(255,255,255,0.85)', fontSize: 10, textAlign: 'center' },
});