import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Heart, Calendar, MessageCircle, AlertCircle, Music, PenTool, Image as ImageIcon, Settings } from 'lucide-react-native';

export default function HomeScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Welcome Header with Settings Gear Button */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome Home 💕</Text>
          <Text style={styles.subWelcomeText}>Mpenzi-Wangu Couple Space</Text>
        </View>
        <TouchableOpacity style={styles.settingsGearBtn} onPress={() => onNavigate('settings')}>
          <Settings color="#D81B60" size={22} />
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Heart color="#FF6B8B" size={40} fill="#FF6B8B" />
        <Text style={styles.bannerTitle}>Connected in Love 💕</Text>
        <Text style={styles.bannerSubtitle}>Your private couple space is active</Text>
      </View>

      <Text style={styles.sectionHeader}>Quick Actions</Text>

      <View style={styles.grid}>
        {/* 1. Talk with Mpenzi */}
        <TouchableOpacity style={styles.card} onPress={() => onNavigate('chat')}>
          <MessageCircle color="#FF6B8B" size={28} />
          <Text style={styles.cardTitle}>Talk with Mpenzi</Text>
          <Text style={styles.cardDesc}>Calls, video & chat</Text>
        </TouchableOpacity>

        {/* 2. Mwezi Care */}
        <TouchableOpacity style={styles.card} onPress={() => onNavigate('cycle')}>
          <Calendar color="#D81B60" size={28} />
          <Text style={styles.cardTitle}>Mwezi Care</Text>
          <Text style={styles.cardDesc}>Cycle & symptom tracker</Text>
        </TouchableOpacity>

        {/* 3. Sweet Notes Notepad */}
        <TouchableOpacity style={styles.card} onPress={() => onNavigate('sweetNotes')}>
          <View style={styles.badgeRow}>
            <PenTool color="#E67E22" size={28} />
            <View style={styles.unreadBadge} />
          </View>
          <Text style={styles.cardTitle}>Sweet Notes</Text>
          <Text style={styles.cardDesc}>Notepad with music</Text>
        </TouchableOpacity>

        {/* 4. Our Gallery */}
        <TouchableOpacity style={styles.card} onPress={() => onNavigate('gallery')}>
          <ImageIcon color="#27AE60" size={28} />
          <Text style={styles.cardTitle}>Our Gallery</Text>
          <Text style={styles.cardDesc}>Photos, videos & collages</Text>
        </TouchableOpacity>

        {/* 5. Love Playlist */}
        <TouchableOpacity style={styles.card} onPress={() => onNavigate('music')}>
          <Music color="#8E44AD" size={28} />
          <Text style={styles.cardTitle}>Love Playlist</Text>
          <Text style={styles.cardDesc}>Shared tunes & vibes</Text>
        </TouchableOpacity>

        {/* 6. SOS Care */}
        <TouchableOpacity style={[styles.card, styles.sosCard]} onPress={() => onNavigate('sos')}>
          <AlertCircle color="#E53E3E" size={28} />
          <Text style={[styles.cardTitle, { color: '#E53E3E' }]}>SOS Care</Text>
          <Text style={styles.cardDesc}>Instant emergency alert</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  content: { padding: 20 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  welcomeText: { fontSize: 20, fontWeight: '800', color: '#D81B60' },
  subWelcomeText: { fontSize: 12, color: '#718096' },
  settingsGearBtn: { backgroundColor: '#FFF', padding: 10, borderRadius: 20, borderWidth: 1, borderColor: '#FFD1DC' },
  banner: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 24, alignItems: 'center', marginBottom: 25, borderColor: '#FFD1DC', borderWidth: 1 },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#D81B60', marginTop: 10 },
  bannerSubtitle: { fontSize: 13, color: '#718096', marginTop: 4 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: '#4A5568', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', backgroundColor: '#FFFFFF', padding: 18, borderRadius: 18, borderWidth: 1, borderColor: '#FFD1DC', gap: 6 },
  sosCard: { borderColor: '#FED7D7', backgroundColor: '#FFF5F5' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#2D3748' },
  cardDesc: { fontSize: 11, color: '#A0AEC0' },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unreadBadge: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF6B8B' }
});