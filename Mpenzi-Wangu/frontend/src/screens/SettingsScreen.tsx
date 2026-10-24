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
  ActivityIndicator,
} from 'react-native';
import { Camera, Save, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme, THEMES, ThemeKey } from '../context/ThemeContext';

export default function SettingsScreen({
  userId,
  coupleId,
}: {
  userId: string;
  coupleId: string;
}) {
  const { themeKey, setThemeKey, colors } = useTheme();

  const [displayName, setDisplayName] = useState('');
  const [aboutBio, setAboutBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const themeOptions: { key: ThemeKey; name: string; color: string }[] = [
    { key: 'pink', name: 'Soft Pink 💕', color: '#FF6B8B' },
    { key: 'dark', name: 'Dark Mode 🌙', color: '#333333' },
    { key: 'gold', name: 'Royal Gold 👑', color: '#D4AF37' },
    { key: 'blue', name: 'Ocean Blue 🌊', color: '#3182CE' },
    { key: 'green', name: 'Emerald Green 🌿', color: '#10B981' },
    { key: 'lavender', name: 'Lavender Dream 💜', color: '#8B5CF6' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.displayName) setDisplayName(data.displayName);
          if (data.aboutBio) setAboutBio(data.aboutBio);
          if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
          if (data.themeKey) setThemeKey(data.themeKey);
        }
      } catch (e: any) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Needed', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'users', userId),
        {
          displayName: displayName || 'My Mpenzi',
          aboutBio: aboutBio || 'In love with my special someone 💕',
          avatarUrl: avatarUrl || '',
          themeKey: themeKey,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      Alert.alert('Success 💕', 'Profile & Theme changes saved!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.headerTitle, { color: colors.headerText }]}>Profile & Settings ⚙️</Text>
      <Text style={[styles.headerSubtitle, { color: colors.subText }]}>Customize your profile and theme</Text>

      {/* Avatar Card */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
          <Image
            source={{
              uri: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            }}
            style={[styles.avatarImage, { borderColor: colors.primary }]}
          />
          <View style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
            <Camera color="#FFF" size={16} />
          </View>
        </TouchableOpacity>
        <Text style={[styles.pickText, { color: colors.primary }]}>Tap picture to choose photo from gallery</Text>
      </View>

      {/* Profile Form Card */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.inputText }]}>Display Name / Pet Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
          placeholder="e.g. Honey / Sweetheart"
          placeholderTextColor="#A0AEC0"
          value={displayName}
          onChangeText={setDisplayName}
        />

        <Text style={[styles.label, { color: colors.inputText }]}>About / Status Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
          placeholder="e.g. Always yours 💕 | Thinking of you 🌸"
          placeholderTextColor="#A0AEC0"
          multiline
          numberOfLines={3}
          value={aboutBio}
          onChangeText={setAboutBio}
        />
      </View>

      {/* App Theme Picker Card */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.inputText, marginBottom: 12 }]}>Select App Theme</Text>
        <View style={styles.themeGrid}>
          {themeOptions.map((t) => {
            const isSelected = themeKey === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.themeChip,
                  { backgroundColor: t.color, borderColor: isSelected ? colors.inputText : 'transparent' },
                ]}
                onPress={() => setThemeKey(t.key)}
              >
                <Text style={styles.themeChipText}>{t.name}</Text>
                {isSelected && <Check color="#FFF" size={16} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveBtn, { backgroundColor: colors.primary }]}
        onPress={handleSaveProfile}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Save color="#FFF" size={18} />
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  headerSubtitle: { fontSize: 13, marginTop: 2, marginBottom: 20 },
  card: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 15, alignItems: 'center' },
  avatarWrapper: { position: 'relative', marginBottom: 10 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3 },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, padding: 8, borderRadius: 20 },
  pickText: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  label: { fontSize: 13, fontWeight: '700', alignSelf: 'flex-start', marginBottom: 6 },
  input: { width: '100%', borderRadius: 12, padding: 14, borderWidth: 1, fontSize: 14, marginBottom: 14 },
  bioInput: { height: 70, textAlignVertical: 'top' },
  themeGrid: { width: '100%', gap: 10 },
  themeChip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 2 },
  themeChipText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  saveBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 14, gap: 8, marginTop: 10 },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});