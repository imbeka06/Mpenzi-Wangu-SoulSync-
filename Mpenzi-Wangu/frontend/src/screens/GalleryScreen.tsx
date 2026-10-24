import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Image as ImageIcon, Video, Grid, Plus, Heart } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function GalleryScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'collages'>('photos');

  const photos = [
    { id: '1', title: 'Sunset Beach Walk 🌅', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400' },
    { id: '2', title: 'Coffee Date Morning ☕', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' },
  ];

  const handleUpload = () => {
    Alert.alert('Upload Memory 📸', 'Select a picture, video, or collage from your camera roll.');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.headerText }]}>Our Memory Gallery 🖼️</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Sweet photos, videos, & collages shared together</Text>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, { backgroundColor: activeTab === 'photos' ? colors.primary : colors.cardBg, borderColor: activeTab === 'photos' ? colors.primary : colors.border }]}
          onPress={() => setActiveTab('photos')}
        >
          <ImageIcon color={activeTab === 'photos' ? '#FFF' : colors.primary} size={18} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: activeTab === 'photos' ? '#FFF' : colors.primary }}>Photos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, { backgroundColor: activeTab === 'videos' ? colors.primary : colors.cardBg, borderColor: activeTab === 'videos' ? colors.primary : colors.border }]}
          onPress={() => setActiveTab('videos')}
        >
          <Video color={activeTab === 'videos' ? '#FFF' : colors.primary} size={18} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: activeTab === 'videos' ? '#FFF' : colors.primary }}>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, { backgroundColor: activeTab === 'collages' ? colors.primary : colors.cardBg, borderColor: activeTab === 'collages' ? colors.primary : colors.border }]}
          onPress={() => setActiveTab('collages')}
        >
          <Grid color={activeTab === 'collages' ? '#FFF' : colors.primary} size={18} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: activeTab === 'collages' ? '#FFF' : colors.primary }}>Collages</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {photos.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <View style={styles.cardFooter}>
              <Heart color={colors.primary} size={14} fill={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.inputText }]}>{item.title}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: colors.primary }]} onPress={handleUpload}>
        <Plus color="#FFF" size={20} />
        <Text style={styles.uploadBtnText}>Add Sweet Memory</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 4 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 14, borderWidth: 1, gap: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', borderRadius: 18, overflow: 'hidden', borderWidth: 1 },
  image: { width: '100%', height: 130 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 6 },
  cardTitle: { fontSize: 11, fontWeight: '700' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, marginTop: 25, gap: 8 },
  uploadBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});