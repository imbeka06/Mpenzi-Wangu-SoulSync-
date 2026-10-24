import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Heart, Calendar, MessageCircle, AlertCircle, Music, PenTool, Image as ImageIcon, Settings } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* Top Welcome Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.headerText }]}>Welcome Home 💕</Text>
          <Text style={[styles.subWelcomeText, { color: colors.subText }]}>Mpenzi-Wangu Couple Space</Text>
        </View>
        <TouchableOpacity
          style={[styles.settingsGearBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          onPress={() => onNavigate('settings')}
        >
          <Settings color={colors.primary} size={22} />
        </TouchableOpacity>
      </View>

      <View style={[styles.banner, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Heart color={colors.primary} size={40} fill={colors.primary} />
        <Text style={[styles.bannerTitle, { color: colors.headerText }]}>Connected in Love 💕</Text>
        <Text style={[styles.bannerSubtitle, { color: colors.subText }]}>Your private couple space is active</Text>
      </View>

      <Text style={[styles.sectionHeader, { color: colors.subText }]}>Quick Actions</Text>

      <View style={styles.grid}>
        {/* 1. Talk with Mpenzi */}
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => onNavigate('chat')}>
          <MessageCircle color={colors.primary} size={28} />
          <Text style={[styles.cardTitle, { color: colors.inputText }]}>Talk with Mpenzi</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Calls, video & chat</Text>
        </TouchableOpacity>

        {/* 2. Mwezi Care */}
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => onNavigate('cycle')}>
          <Calendar color={colors.headerText} size={28} />
          <Text style={[styles.cardTitle, { color: colors.inputText }]}>Mwezi Care</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Cycle & symptom tracker</Text>
        </TouchableOpacity>

        {/* 3. Sweet Notes Notepad */}
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => onNavigate('sweetNotes')}>
          <View style={styles.badgeRow}>
            <PenTool color="#E67E22" size={28} />
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.inputText }]}>Sweet Notes</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Notepad with music</Text>
        </TouchableOpacity>

        {/* 4. Our Gallery */}
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => onNavigate('gallery')}>
          <ImageIcon color="#27AE60" size={28} />
          <Text style={[styles.cardTitle, { color: colors.inputText }]}>Our Gallery</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Photos, videos & collages</Text>
        </TouchableOpacity>

        {/* 5. Love Playlist */}
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={() => onNavigate('music')}>
          <Music color="#8E44AD" size={28} />
          <Text style={[styles.cardTitle, { color: colors.inputText }]}>Love Playlist</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Shared tunes & vibes</Text>
        </TouchableOpacity>

        {/* 6. SOS Care */}
        <TouchableOpacity style={[styles.card, styles.sosCard]} onPress={() => onNavigate('sos')}>
          <AlertCircle color="#E53E3E" size={28} />
          <Text style={[styles.cardTitle, { color: '#E53E3E' }]}>SOS Care</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Instant emergency alert</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  welcomeText: { fontSize: 20, fontWeight: '800' },
  subWelcomeText: { fontSize: 12 },
  settingsGearBtn: { padding: 10, borderRadius: 20, borderWidth: 1 },
  banner: { padding: 24, borderRadius: 24, alignItems: 'center', marginBottom: 25, borderWidth: 1 },
  bannerTitle: { fontSize: 22, fontWeight: '800', marginTop: 10 },
  bannerSubtitle: { fontSize: 13, marginTop: 4 },
  sectionHeader: { fontSize: 16, fontWeight: '700', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%', padding: 18, borderRadius: 18, borderWidth: 1, gap: 6 },
  sosCard: { borderColor: '#FED7D7', backgroundColor: '#FFF5F5' },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardDesc: { fontSize: 11 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unreadBadge: { width: 10, height: 10, borderRadius: 5 }
});