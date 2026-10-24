import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Image as ImageIcon, Video, Grid, Plus, Heart } from 'lucide-react-native';

export default function GalleryScreen() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'collages'>('photos');

  const photos = [
    { id: '1', title: 'Sunset Beach Walk 🌅', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400' },
    { id: '2', title: 'Coffee Date Morning ☕', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' },
  ];

  const handleUpload = () => {
    Alert.alert('Upload Memory 📸', 'Select a picture, video, or collage from your camera roll.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={styles.title}>Our Memory Gallery 🖼️</Text>
        <Text style={styles.subtitle}>Sweet photos, videos, & collages shared together</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'photos' && styles.activeTab]}
          onPress={() => setActiveTab('photos')}
        >
          <ImageIcon color={activeTab === 'photos' ? '#FFF' : '#FF6B8B'} size={18} />
          <Text style={[styles.tabText, activeTab === 'photos' && styles.activeTabText]}>Photos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}
        >
          <Video color={activeTab === 'videos' ? '#FFF' : '#FF6B8B'} size={18} />
          <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'collages' && styles.activeTab]}
          onPress={() => setActiveTab('collages')}
        >
          <Grid color={activeTab === 'collages' ? '#FFF' : '#FF6B8B'} size={18} />
          <Text style={[styles.tabText, activeTab === 'collages' && styles.activeTabText]}>Collages</Text>
        </TouchableOpacity>
      </View>

      {/* Gallery Grid */}
      <View style={styles.grid}>
        {photos.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <View style={styles.cardFooter}>
              <Heart color="#FF6B8B" size={14} fill="#FF6B8B" />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Upload Memory Button */}
      <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
        <Plus color="#FFF" size={20} />
        <Text style={styles.uploadBtnText}>Add Sweet Memory</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  content: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#D81B60' },
  subtitle: { fontSize: 13, color: '#718096', marginTop: 4 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 14, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FFD1DC', gap: 6 },
  activeTab: { backgroundColor: '#FF6B8B', borderColor: '#FF6B8B' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#FF6B8B' },
  activeTabText: { color: '#FFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', backgroundColor: '#FFF', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#FFD1DC' },
  image: { width: '100%', height: 130 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 6 },
  cardTitle: { fontSize: 11, fontWeight: '700', color: '#2D3748' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6B8B', padding: 16, borderRadius: 16, marginTop: 25, gap: 8 },
  uploadBtnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});