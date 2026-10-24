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
} from 'react-native';
import {
  AlertCircle,
  PhoneCall,
  MessageSquare,
  Settings,
  ShieldAlert,
  Save,
  CheckCircle2,
} from 'lucide-react-native';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

export default function SOSScreen({
  coupleId = 'couple_demo_123',
}: {
  coupleId?: string;
}) {
  const { colors } = useTheme();

  // Setup vs Active Alert Screen Mode
  const [isSettingUp, setIsSettingUp] = useState(false);

  // Saved Contacts State
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [contactName, setContactName] = useState('');

  // Firestore Real-time Listener for Emergency Settings
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
        setIsSettingUp(true); // Default to setup if no contacts are saved
      }
    });

    return () => unsubscribe();
  }, [coupleId]);

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

      Alert.alert('SOS Contact Saved! 🛡️', 'Emergency contact details are ready.');
      setIsSettingUp(false);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  // Trigger Immediate Emergency Actions
  const handleTriggerEmergencyCall = () => {
    if (!emergencyPhone) {
      Alert.alert('No Number Saved', 'Please complete the SOS Setup first.');
      setIsSettingUp(true);
      return;
    }

    // Opens Native Phone Dialer
    Linking.openURL(`tel:${emergencyPhone}`);
  };

  const handleTriggerWhatsAppAlert = () => {
    if (!whatsappPhone) {
      Alert.alert('No Number Saved', 'Please complete the SOS Setup first.');
      setIsSettingUp(true);
      return;
    }

    const message = encodeURIComponent(
      `🚨 EMERGENCY ALERT FROM MPENZI-WANGU! 🚨\n\nI need immediate assistance! Please check on me or call me back right now!`
    );

    // Formats Phone Number for WhatsApp (removes spaces/dashes)
    const formattedNum = whatsappPhone.replace(/[^0-9]/g, '');
    Linking.openURL(`https://wa.me/${formattedNum}?text=${message}`);
  };

  const handleTriggerSMSAlert = () => {
    if (!emergencyPhone) {
      Alert.alert('No Number Saved', 'Please complete the SOS Setup first.');
      setIsSettingUp(true);
      return;
    }

    const message = encodeURIComponent(
      `🚨 EMERGENCY ALERT FROM MPENZI-WANGU! 🚨 I need immediate help! Please call me immediately!`
    );

    Linking.openURL(`sms:${emergencyPhone}?body=${message}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* HEADER */}
      <View
        style={[
          styles.headerCard,
          { backgroundColor: '#FFF5F5', borderColor: '#FED7D7' },
        ]}
      >
        <AlertCircle color="#E53E3E" size={36} />
        <Text style={styles.title}>SOS Emergency Care 🛡️</Text>
        <Text style={styles.subtitle}>
          Instant emergency phone calls, SMS & WhatsApp alerts
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
        <View
          style={[
            styles.setupCard,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.setupHeader, { color: colors.headerText }]}>
            Initial SOS Contacts Setup ⚙️
          </Text>
          <Text style={[styles.setupDesc, { color: colors.subText }]}>
            Set up the phone and WhatsApp numbers that will receive instant alerts when you tap the emergency button.
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.inputText,
              },
            ]}
            placeholder="Contact Name (e.g., Honey / Sister)"
            placeholderTextColor="#A0AEC0"
            value={contactName}
            onChangeText={setContactName}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.inputText,
              },
            ]}
            placeholder="Emergency Call & SMS Number (e.g., +254712345678)"
            placeholderTextColor="#A0AEC0"
            keyboardType="phone-pad"
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.inputText,
              },
            ]}
            placeholder="Emergency WhatsApp Number (e.g., +254712345678)"
            placeholderTextColor="#A0AEC0"
            keyboardType="phone-pad"
            value={whatsappPhone}
            onChangeText={setWhatsappPhone}
          />

          <TouchableOpacity
            style={styles.saveSetupBtn}
            onPress={handleSaveSetup}
          >
            <Save color="#FFF" size={18} />
            <Text style={styles.saveSetupText}>Save Emergency Contacts</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* VIEW 2: ACTIVE SOS EMERGENCY DASHBOARD */
        <View style={styles.alertDashboard}>
          {/* Active Contact Tag */}
          <View
            style={[
              styles.contactTag,
              { backgroundColor: colors.cardBg, borderColor: colors.border },
            ]}
          >
            <CheckCircle2 color="#27AE60" size={18} />
            <Text style={[styles.contactTagText, { color: colors.inputText }]}>
              Configured Contact: {contactName || 'Mpenzi Partner'} ({emergencyPhone})
            </Text>
          </View>

          {/* GIANT RED SOS BUTTON */}
          <TouchableOpacity
            style={styles.giantSosButton}
            onPress={handleTriggerEmergencyCall}
            activeOpacity={0.8}
          >
            <ShieldAlert color="#FFF" size={54} />
            <Text style={styles.giantSosText}>TAP TO CALL SOS</Text>
            <Text style={styles.giantSosSubText}>
              Opens phone dialer immediately
            </Text>
          </TouchableOpacity>

          {/* SECONDARY EMERGENCY ACTIONS */}
          <View style={styles.actionGrid}>
            {/* WhatsApp Urgent Message */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#25D366' }]}
              onPress={handleTriggerWhatsAppAlert}
            >
              <MessageSquare color="#FFF" size={26} />
              <Text style={styles.actionCardTitle}>Send WhatsApp SOS</Text>
              <Text style={styles.actionCardSub}>
                Pre-fills urgent text message
              </Text>
            </TouchableOpacity>

            {/* Urgent SMS Alert */}
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#3182CE' }]}
              onPress={handleTriggerSMSAlert}
            >
              <PhoneCall color="#FFF" size={26} />
              <Text style={styles.actionCardTitle}>Send Direct SMS</Text>
              <Text style={styles.actionCardSub}>
                Launches SMS emergency alert
              </Text>
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
  headerCard: {
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '800', marginTop: 10, color: '#E53E3E' },
  subtitle: { fontSize: 12, color: '#718096', marginTop: 2, textAlign: 'center' },
  setupToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginTop: 12,
    gap: 6,
  },
  setupToggleText: { fontSize: 11, fontWeight: '800', color: '#E53E3E' },

  setupCard: { padding: 20, borderRadius: 24, borderWidth: 1, gap: 12 },
  setupHeader: { fontSize: 17, fontWeight: '800' },
  setupDesc: { fontSize: 12, lineHeight: 18, marginBottom: 5 },
  input: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 13,
  },
  saveSetupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E53E3E',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 8,
  },
  saveSetupText: { color: '#FFF', fontWeight: '800', fontSize: 13 },

  alertDashboard: { gap: 20, alignItems: 'center' },
  contactTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    width: '100%',
  },
  contactTagText: { fontSize: 12, fontWeight: '700' },

  giantSosButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  giantSosText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 18,
    marginTop: 10,
    letterSpacing: 1,
  },
  giantSosSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },

  actionGrid: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 10 },
  actionCard: {
    flex: 1,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  actionCardTitle: { color: '#FFF', fontWeight: '800', fontSize: 13, marginTop: 4 },
  actionCardSub: { color: 'rgba(255,255,255,0.85)', fontSize: 10, textAlign: 'center' },
});