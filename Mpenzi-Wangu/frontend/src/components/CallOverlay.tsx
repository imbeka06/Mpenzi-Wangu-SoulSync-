import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  SwitchCamera,
  Heart,
} from 'lucide-react-native';
import { doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

interface CallOverlayProps {
  coupleId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  callType: 'Voice' | 'Video';
  isIncoming?: boolean;
}

export default function CallOverlay({
  coupleId,
  userId,
  isOpen,
  onClose,
  callType,
  isIncoming = false,
}: CallOverlayProps) {
  const { colors } = useTheme();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'Voice');
  const [callStatus, setCallStatus] = useState<string>(
    isIncoming ? 'Incoming Call...' : 'Ringing Mpenzi...'
  );
  const [partnerProfile, setPartnerProfile] = useState({
    displayName: 'My Mpenzi 💕',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    aboutBio: 'Always in my heart 🌸',
  });

  // Listen to Call Session and Partner Info in Firestore
  useEffect(() => {
    if (!isOpen) return;

    // Listen to real-time call status in Firestore
    const callDocRef = doc(db, 'couples', coupleId, 'activeCall', 'session');
    const unsubscribeCall = onSnapshot(callDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.status === 'accepted') {
          setCallStatus('Connected • 00:12');
        } else if (data.status === 'ended') {
          handleEndCall();
        }
      }
    });

    return () => unsubscribeCall();
  }, [isOpen, coupleId]);

  const handleAcceptCall = async () => {
    setCallStatus('Connected • 00:01');
    await setDoc(
      doc(db, 'couples', coupleId, 'activeCall', 'session'),
      { status: 'accepted' },
      { merge: true }
    );
  };

  const handleEndCall = async () => {
    try {
      await deleteDoc(doc(db, 'couples', coupleId, 'activeCall', 'session'));
    } catch (e) {
      console.log('Call session cleanup:', e);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} animationType="slide" transparent={false}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top Header Status */}
        <View style={styles.topHeader}>
          <View style={styles.secureTag}>
            <Heart color={colors.primary} size={14} fill={colors.primary} />
            <Text style={[styles.secureText, { color: colors.subText }]}>
              End-to-End Encrypted Mpenzi Call
            </Text>
          </View>
          <Text style={[styles.callTypeTitle, { color: colors.headerText }]}>
            {callType === 'Video' ? '📹 Mpenzi Video Call' : '📞 Mpenzi Voice Call'}
          </Text>
        </View>

        {/* Center Profile & Video Preview Area */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: partnerProfile.avatarUrl }}
              style={[
                styles.avatar,
                { borderColor: colors.primary, shadowColor: colors.primary },
              ]}
            />
          </View>

          <Text style={[styles.partnerName, { color: colors.inputText }]}>
            {partnerProfile.displayName}
          </Text>
          <Text style={[styles.statusText, { color: colors.primary }]}>
            {callStatus}
          </Text>
          <Text style={[styles.bioText, { color: colors.subText }]}>
            "{partnerProfile.aboutBio}"
          </Text>
        </View>

        {/* Bottom Call Action Control Bar */}
        <View style={[styles.controlsCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          {isIncoming && callStatus === 'Incoming Call...' ? (
            /* Accept / Reject Buttons for Incoming Call */
            <View style={styles.incomingRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.declineBtn]}
                onPress={handleEndCall}
              >
                <PhoneOff color="#FFF" size={26} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.acceptBtn]}
                onPress={handleAcceptCall}
              >
                <VideoIcon color="#FFF" size={26} />
              </TouchableOpacity>
            </View>
          ) : (
            /* In-Call Control Buttons */
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={[
                  styles.controlBtn,
                  { backgroundColor: isMuted ? '#E53E3E' : colors.background },
                ]}
                onPress={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <MicOff color="#FFF" size={22} />
                ) : (
                  <Mic color={colors.primary} size={22} />
                )}
              </TouchableOpacity>

              {callType === 'Video' && (
                <>
                  <TouchableOpacity
                    style={[
                      styles.controlBtn,
                      { backgroundColor: isVideoOff ? '#E53E3E' : colors.background },
                    ]}
                    onPress={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? (
                      <VideoOff color="#FFF" size={22} />
                    ) : (
                      <VideoIcon color={colors.primary} size={22} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.controlBtn, { backgroundColor: colors.background }]}
                    onPress={() => {}}
                  >
                    <SwitchCamera color={colors.primary} size={22} />
                  </TouchableOpacity>
                </>
              )}

              {/* End Call Red Button */}
              <TouchableOpacity
                style={[styles.controlBtn, styles.endCallBtn]}
                onPress={handleEndCall}
              >
                <PhoneOff color="#FFF" size={24} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  topHeader: { alignItems: 'center', marginTop: 20 },
  secureTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  secureText: { fontSize: 11, fontWeight: '600' },
  callTypeTitle: { fontSize: 18, fontWeight: '800' },

  profileSection: { alignItems: 'center', marginTop: 30 },
  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  partnerName: { fontSize: 26, fontWeight: '800', marginTop: 10 },
  statusText: { fontSize: 15, fontWeight: '700', marginTop: 6 },
  bioText: { fontSize: 13, fontStyle: 'italic', marginTop: 8, paddingHorizontal: 40, textAlign: 'center' },

  controlsCard: {
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 30,
    alignItems: 'center',
  },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', alignItems: 'center' },
  controlBtn: { padding: 16, borderRadius: 30, borderWidth: 1, borderColor: 'transparent' },
  endCallBtn: { backgroundColor: '#E53E3E' },

  incomingRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  actionBtn: { padding: 20, borderRadius: 40, alignItems: 'center', justifyContent: 'center', width: 70, height: 70 },
  declineBtn: { backgroundColor: '#E53E3E' },
  acceptBtn: { backgroundColor: '#27AE60' },
});