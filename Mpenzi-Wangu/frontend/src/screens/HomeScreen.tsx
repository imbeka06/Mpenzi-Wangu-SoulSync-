import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {
  Heart,
  Calendar,
  MessageCircle,
  AlertCircle,
  Music,
  PenTool,
  Image as ImageIcon,
  Settings,
  Disc,
} from 'lucide-react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen({
  coupleId = 'couple_demo_123',
  onNavigate,
}: {
  coupleId?: string;
  onNavigate: (screen: string) => void;
}) {
  const { colors } = useTheme();

  const [songOfTheDay, setSongOfTheDay] = useState<{
    title: string;
    artist: string;
    dedication: string;
    setBy: string;
  } | null>(null);

  const scrollX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // Firestore Song of the Day Realtime Listener
  useEffect(() => {
    if (!coupleId) return;

    const coupleRef = doc(db, 'couples', coupleId);
    const unsubscribe = onSnapshot(coupleRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.songOfTheDay) {
          setSongOfTheDay(data.songOfTheDay);
        }
      }
    });

    return () => unsubscribe();
  }, [coupleId]);

  // Continuous Smooth Marquee Ticker Animation Loop
  useEffect(() => {
    if (!songOfTheDay) return;

    scrollX.setValue(SCREEN_WIDTH);
    const animation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -SCREEN_WIDTH * 1.5,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [songOfTheDay]);

  const marqueeText = songOfTheDay
    ? `🎵 MPENZI'S SONG OF THE DAY: "${songOfTheDay.title}" — Dedicated by ${songOfTheDay.setBy}: "${songOfTheDay.dedication}" 💕   Tap to Listen Together!   `
    : `🎵 MPENZI'S SONG OF THE DAY: Set your special song in Love Playlist! 💕   Tap to Open Jam Room!   `;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Top Welcome Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={[styles.welcomeText, { color: colors.headerText }]}>
            Welcome Home 💕
          </Text>
          <Text style={[styles.subWelcomeText, { color: colors.subText }]}>
            Mpenzi-Wangu Couple Space
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.settingsGearBtn,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
          onPress={() => onNavigate('settings')}
        >
          <Settings color={colors.primary} size={22} />
        </TouchableOpacity>
      </View>

      {/* ANIMATED MARQUEE TICKER BANNER */}
      <TouchableOpacity
        style={[
          styles.tickerBannerContainer,
          { backgroundColor: colors.primary, borderColor: colors.border },
        ]}
        onPress={() => onNavigate('music')}
        activeOpacity={0.85}
      >
        <View style={styles.tickerBadge}>
          <Disc color="#FFFFFF" size={16} />
        </View>

        <View style={styles.tickerClipWindow}>
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.tickerText,
              { transform: [{ translateX: scrollX }] },
            ]}
          >
            {marqueeText}
          </Animated.Text>
        </View>
      </TouchableOpacity>

      {/* Love Banner */}
      <View
        style={[
          styles.banner,
          { backgroundColor: colors.cardBg, borderColor: colors.border },
        ]}
      >
        <Heart color={colors.primary} size={40} fill={colors.primary} />
        <Text style={[styles.bannerTitle, { color: colors.headerText }]}>
          Connected in Love 💕
        </Text>
        <Text style={[styles.bannerSubtitle, { color: colors.subText }]}>
          Your private couple space is active
        </Text>
      </View>

      <Text style={[styles.sectionHeader, { color: colors.subText }]}>
        Quick Actions
      </Text>

      {/* Quick Action Grid */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          onPress={() => onNavigate('chat')}
        >
          <MessageCircle color={colors.primary} size={28} />
          <Text style={[styles.cardTitle, { color: colors.inputText }]}>Talk with Mpenzi</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Calls, video & chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          onPress={() => onNavigate('music')}
        >
          <Music color="#8E44AD" size={28} />
          <Text style={[styles.cardTitle, { color: colors.inputText }]}>Love Playlist</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Spotify & YouTube Jam</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          onPress={() => onNavigate('cycle')}
        >
          <Calendar color={colors.headerText} size={28} />
          <Text style={[styles.cardTitle, { color: colors.inputText }]}>Mwezi Care</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Cycle & symptom tracker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          onPress={() => onNavigate('sweetNotes')}
        >
          <View style={styles.badgeRow}>
            <PenTool color="#E67E22" size={28} />
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.inputText }]}>Sweet Notes</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Notepad with music</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          onPress={() => onNavigate('gallery')}
        >
          <ImageIcon color="#27AE60" size={28} />
          <Text style={[styles.cardTitle, { color: colors.inputText }]}>Our Gallery</Text>
          <Text style={[styles.cardDesc, { color: colors.subText }]}>Photos, videos & collages</Text>
        </TouchableOpacity>

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

  tickerBannerContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18, marginBottom: 20, overflow: 'hidden', elevation: 4 },
  tickerBadge: { backgroundColor: 'rgba(255, 255, 255, 0.25)', padding: 6, borderRadius: 12, marginRight: 10 },
  tickerClipWindow: { flex: 1, overflow: 'hidden' },
  tickerText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },

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
  unreadBadge: { width: 10, height: 10, borderRadius: 5 },
});