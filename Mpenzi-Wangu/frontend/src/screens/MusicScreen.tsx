import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Music, Play } from 'lucide-react-native';

export default function MusicScreen() {
  const songs = [
    { title: 'Our Favorite Melody', artist: 'Love Acoustics' },
    { title: 'Cozy Evening Vibes', artist: 'Mpenzi Chill' },
    { title: 'Sunset Walks Together', artist: 'Soft Pink Beats' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Music color="#8E44AD" size={36} />
        <Text style={styles.title}>Love Playlist 🎵</Text>
        <Text style={styles.subtitle}>Shared Spotify & Music Jam</Text>
      </View>

      <Text style={styles.sectionTitle}>Shared Tracklist</Text>

      {songs.map((song, i) => (
        <View key={i} style={styles.songCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.songTitle}>{song.title}</Text>
            <Text style={styles.songArtist}>{song.artist}</Text>
          </View>
          <TouchableOpacity style={styles.playBtn}>
            <Play color="#8E44AD" size={16} fill="#8E44AD" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  content: { padding: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, alignItems: 'center', borderColor: '#FFD1DC', borderWidth: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#8E44AD', marginTop: 10 },
  subtitle: { fontSize: 13, color: '#718096', marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#4A5568', marginTop: 20, marginBottom: 10 },
  songCard: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderColor: '#FFD1DC', borderWidth: 1 },
  songTitle: { fontSize: 14, fontWeight: '700', color: '#2D3748' },
  songArtist: { fontSize: 12, color: '#A0AEC0' },
  playBtn: { backgroundColor: '#F3E8FF', padding: 10, borderRadius: 20 }
});