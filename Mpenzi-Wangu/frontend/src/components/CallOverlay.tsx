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
  ChevronDown,
  Phone,
} from 'lucide-react-native';
import { doc, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

// Helper function to safely load Expo Audio native module without crashing Expo Go
const getExpoAudio = () => {
  try {
    const { Audio } = require('expo-av');
    return Audio;
  } catch (e) {
    console.log('ExponentAV native module unavailable in current Expo Go build');
    return null;
  }
};

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [sound, setSound] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<string>(
    isIncoming ? 'Incoming Call...' : 'Ringing Mpenzi...'
  );
  const [partnerProfile, setPartnerProfile] = useState({
    displayName: 'My Mpenzi 💕',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    aboutBio: 'Always in my heart 🌸',
  });

  // Load Partner Profile Info from Firestore
  useEffect(() => {
    if (!isOpen) return;

    const fetchPartnerProfile = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setPartnerProfile({
            displayName: data.displayName || 'My Mpenzi 💕',
            avatarUrl:
              data.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            aboutBio: data.aboutBio || 'Always in my heart 🌸',
          });
        }
      } catch (e) {
        console.log('Error fetching partner details:', e);
      }
    };

    fetchPartnerProfile();
  }, [isOpen, userId]);

  // Safe Ringtone Playback
  useEffect(() => {
    let ringtoneSound: any = null;

    async function playRingtone() {
      if (isOpen && callStatus.includes('Ringing')) {
        const Audio = getExpoAudio();
        if (!Audio) return;

        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
          });

          const { sound: newSound } = await Audio.Sound.createAsync(
            {
              uri: 'https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3',
            },
            { shouldPlay: true, isLooping: true }
          );

          ringtoneSound = newSound;
          setSound(newSound);
        } catch (error) {
          console.log('Audio ringtone notice:', error);
        }
      }
    }

    playRingtone();

    return () => {
      if (ringtoneSound) {
        ringtoneSound.unloadAsync?.().catch(() => {});
      }
    };
  }, [isOpen, callStatus]);

  // Real-time Firestore Call Listener
  useEffect(() => {
    if (!isOpen) return;

    const callDocRef = doc(db, 'couples', coupleId, 'activeCall', 'session');
    const unsubscribeCall = onSnapshot(callDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.status === 'accepted') {
          stopRingtone();
          setCallStatus('Connected • 00:12');
        } else if (data.status === 'ended') {
          stopRingtone();
          handleEndCall();
        }
      }
    });

    return () => unsubscribeCall();
  }, [isOpen, coupleId]);

  const stopRingtone = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      } catch (e) {
        console.log('Error stopping sound:', e);
      }
    }
  };

  const handleAcceptCall = async () => {
    await stopRingtone();
    setCallStatus('Connected • 00:01');
    await setDoc(
      doc(db, 'couples', coupleId, 'activeCall', 'session'),
      { status: 'accepted' },
      { merge: true }
    );
  };

  const handleEndCall = async () => {
    await stopRingtone();
    try {
      await deleteDoc(doc(db, 'couples', coupleId, 'activeCall', 'session'));
    } catch (e) {
      console.log('Call session cleanup:', e);
    }
    setIsMinimized(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <React.Fragment>
      {/* MINIMIZED FLOATING CALL BAR */}
      {isMinimized ? (
        <TouchableOpacity
          style={[
            styles.minimizedBar,
            { backgroundColor: colors.primary, borderColor: colors.border },
          ]}
          onPress={() => setIsMinimized(false)}
        >
          <View style={styles.minimizedInfo}>
            <Phone color="#FFF" size={16} />
            <Text style={styles.minimizedText}>
              {partnerProfile.displayName} ({callStatus})
            </Text>
          </View>

          <TouchableOpacity
            style={styles.minimizedEndBtn}
            onPress={handleEndCall}
          >
            <PhoneOff color="#FFF" size={16} />
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        /* FULL SCREEN CALL OVERLAY MODAL */
        <Modal visible={isOpen && !isMinimized} animationType="slide">
          <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
          >
            {/* Top Navigation & Back Button to Text */}
            <View style={styles.topHeader}>
              <TouchableOpacity
                style={[
                  styles.backToTextBtn,
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                ]}
                onPress={() => setIsMinimized(true)}
              >
                <ChevronDown color={colors.primary} size={20} />
                <Text style={[styles.backToText, { color: colors.primary }]}>
                  Back to Text
                </Text>
              </TouchableOpacity>

              <View style={styles.secureTag}>
                <Heart color={colors.primary} size={14} fill={colors.primary} />
                <Text style={[styles.secureText, { color: colors.subText }]}>
                  Mpenzi Encrypted Call
                </Text>
              </View>
            </View>

            {/* Profile Picture & Bio Section */}
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

            {/* Call Control Buttons */}
            <View
              style={[
                styles.controlsCard,
                { backgroundColor: colors.cardBg, borderColor: colors.border },
              ]}
            >
              {isIncoming && callStatus === 'Incoming Call...' ? (
                /* Incoming Call Accept / Decline Row */
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
                /* In-Call Active Controls Row */
                <View style={styles.controlsRow}>
                  <TouchableOpacity
                    style={[
                      styles.controlBtn,
                      {
                        backgroundColor: isMuted
                          ? '#E53E3E'
                          : colors.background,
                      },
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
                    <React.Fragment>
                      <TouchableOpacity
                        style={[
                          styles.controlBtn,
                          {
                            backgroundColor: isVideoOff
                              ? '#E53E3E'
                              : colors.background,
                          },
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
                        style={[
                          styles.controlBtn,
                          { backgroundColor: colors.background },
                        ]}
                        onPress={() => {}}
                      >
                        <SwitchCamera color={colors.primary} size={22} />
                      </TouchableOpacity>
                    </React.Fragment>
                  )}

                  {/* Red Hangup Button */}
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
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  topHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backToTextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  backToText: { fontSize: 12, fontWeight: '700' },
  secureTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  secureText: { fontSize: 11, fontWeight: '600' },

  profileSection: { alignItems: 'center', marginTop: 30 },
  avatarContainer: { marginBottom: 20 },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
  },
  partnerName: { fontSize: 26, fontWeight: '800', marginTop: 10 },
  statusText: { fontSize: 15, fontWeight: '700', marginTop: 6 },
  bioText: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    paddingHorizontal: 40,
    textAlign: 'center',
  },

  controlsCard: {
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 30,
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  controlBtn: { padding: 16, borderRadius: 30 },
  endCallBtn: { backgroundColor: '#E53E3E' },

  incomingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionBtn: {
    padding: 20,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  declineBtn: { backgroundColor: '#E53E3E' },
  acceptBtn: { backgroundColor: '#27AE60' },

  minimizedBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    zIndex: 9999,
  },
  minimizedInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  minimizedText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  minimizedEndBtn: {
    backgroundColor: '#E53E3E',
    padding: 8,
    borderRadius: 16,
  },
});