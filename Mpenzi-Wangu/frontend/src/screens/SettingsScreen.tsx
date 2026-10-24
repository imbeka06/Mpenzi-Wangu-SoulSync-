import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { User, Camera, Heart, Save } from 'lucide-react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function SettingsScreen({
  userId,
  coupleId,
}: {
  userId: string;
  coupleId: string;
}) {
  const [displayName, setDisplayName] = useState('');
  const [aboutBio, setAboutBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Sample default avatars if user hasn't uploaded/chosen one yet
  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  ];

  useEffect(() => {
    // Load existing profile from Firestore
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.displayName) setDisplayName(data.displayName);
          if (data.aboutBio) setAboutBio(data.aboutBio);
          if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
        }
      } catch (e) {
        console.log('Error fetching profile:', e);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSaveProfile = async () => {
    try {
      await setDoc(
        doc(db, 'users', userId),
        {
          displayName: displayName || 'My Mpenzi',
          aboutBio: aboutBio || 'In love with my special someone 💕',
          avatarUrl: avatarUrl || defaultAvatars[0],
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      Alert.alert('Profile Updated 💕', 'Your profile info is saved and synced!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Profile & Settings ⚙️</Text>
      <Text style={styles.headerSubtitle}>Customize how you appear to your partner</Text>

      {/* Avatar Preview Section */}
      <View style={styles.avatarCard}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: avatarUrl || defaultAvatars[0],
            }}
            style={styles.avatarImage}
          />
          <TouchableOpacity style={styles.cameraBadge}>
            <Camera color="#FFF" size={16} />
          </TouchableOpacity>
        </View>

        <Text style={styles.chooseText}>Choose a Quick Profile Avatar:</Text>
        <View style={styles.avatarGrid}>
          {defaultAvatars.map((url, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setAvatarUrl(url)}
              style={[
                styles.avatarChip,
                avatarUrl === url && styles.selectedAvatarChip,
              ]}
            >
              <Image source={{ uri: url }} style={styles.chipImage} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Display Name / Pet Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Honey / Sweetheart"
          placeholderTextColor="#A0AEC0"
          value={displayName}
          onChangeText={setDisplayName}
        />

        <Text style={styles.label}>About / Status Bio (like WhatsApp)</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="e.g. Always yours 💕 | Thinking of you 🌸"
          placeholderTextColor="#A0AEC0"
          multiline
          numberOfLines={3}
          value={aboutBio}
          onChangeText={setAboutBio}
        />

        <View style={styles.infoBox}>
          <Heart color="#FF6B8B" size={18} fill="#FF6B8B" />
          <Text style={styles.infoText}>
            Linked to Couple Space: <Text style={styles.bold}>{coupleId}</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
          <Save color="#FFF" size={18} />
          <Text style={styles.saveBtnText}>Save Profile Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  content: { padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#D81B60' },
  headerSubtitle: { fontSize: 13, color: '#718096', marginTop: 2, marginBottom: 20 },

  avatarCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD1DC',
    marginBottom: 20,
  },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FF6B8B' },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B8B',
    padding: 8,
    borderRadius: 20,
  },
  chooseText: { fontSize: 12, color: '#718096', fontWeight: '600', marginBottom: 10 },
  avatarGrid: { flexDirection: 'row', gap: 12 },
  avatarChip: { borderRadius: 25, padding: 2, borderWidth: 2, borderColor: 'transparent' },
  selectedAvatarChip: { borderColor: '#FF6B8B' },
  chipImage: { width: 44, height: 44, borderRadius: 22 },

  formCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#FFD1DC' },
  label: { fontSize: 13, fontWeight: '700', color: '#4A5568', marginBottom: 6 },
  input: {
    backgroundColor: '#FFF5F7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFD1DC',
    fontSize: 14,
    color: '#2D3748',
    marginBottom: 16,
  },
  bioInput: { height: 70, textAlignVertical: 'top' },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  infoText: { fontSize: 13, color: '#4A5568' },
  bold: { fontWeight: '700', color: '#D81B60' },

  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B8B',
    padding: 16,
    borderRadius: 14,
    gap: 8,
  },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});