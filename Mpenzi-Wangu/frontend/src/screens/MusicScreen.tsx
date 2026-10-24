import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Music, Play } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function MusicScreen() {
  const { colors } = useTheme();

  const songs = [
    { title: 'Our Favorite Melody', artist: 'Love Acoustics' },
    { title: 'Cozy Evening Vibes', artist: 'Mpenzi Chill' },
    { title: 'Sunset Walks Together', artist: 'Soft Pink Beats' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Music color={colors.primary} size={36} />
        <Text style={[styles.title, { color: colors.headerText }]}>Love Playlist 🎵</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>Shared Spotify & Music Jam</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.subText }]}>Shared Tracklist</Text>

      {songs.map((song, i) => (
        <View key={i} style={[styles.songCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.songTitle, { color: colors.inputText }]}>{song.title}</Text>
            <Text style={[styles.songArtist, { color: colors.subText }]}>{song.artist}</Text>
          </View>
          <TouchableOpacity style={[styles.playBtn, { backgroundColor: colors.background }]}>
            <Play color={colors.primary} size={16} fill={colors.primary} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  card: { padding: 20, borderRadius: 20, alignItems: 'center', borderWidth: 1 },
  title: { fontSize: 20, fontWeight: '800', marginTop: 10 },
  subtitle: { fontSize: 13, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  songCard: { padding: 14, borderRadius: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1 },
  songTitle: { fontSize: 14, fontWeight: '700' },
  songArtist: { fontSize: 12 },
  playBtn: { padding: 10, borderRadius: 20 },
});