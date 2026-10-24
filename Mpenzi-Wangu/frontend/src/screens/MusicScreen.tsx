import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import {
  Music,
  Play,
  Pause,
  Heart,
  Plus,
  Send,
  Radio,
  Star,
  Tv,
} from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

export default function MusicScreen({
  coupleId,
  userId,
}: {
  coupleId?: string;
  userId?: string;
}) {
  const { colors } = useTheme();

  const [musicSource, setMusicSource] = useState<'youtube' | 'spotify'>(
    'youtube'
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState('mFBJtuQ1Llc');
  const [songTitle, setSongTitle] = useState('Sauti Sol - Suzzanna 💕');
  const [dedicationNote, setDedicationNote] = useState(
    'This song always reminds me of our trip!'
  );
  const [customInputUrl, setCustomInputUrl] = useState('');

  const [dedicatedSongs, setDedicatedSongs] = useState([
    {
      id: '1',
      title: 'Sauti Sol - Suzzanna 💕',
      note: 'Our official trip anthem 🚗',
      source: 'youtube',
      videoId: 'mFBJtuQ1Llc',
    },
    {
      id: '2',
      title: 'Ed Sheeran - Perfect 💍',
      note: 'Danced to this in the living room!',
      source: 'spotify',
      videoId: '2Vv-BfVoq4g',
    },
  ]);

  // Real-time Firestore Jam Room Listener
  useEffect(() => {
    if (!coupleId) return;

    const sessionRef = doc(db, 'couples', coupleId, 'musicRoom', 'session');
    const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.isPlaying !== undefined) setIsPlaying(data.isPlaying);
        if (data.youtubeVideoId) setYoutubeVideoId(data.youtubeVideoId);
        if (data.songTitle) setSongTitle(data.songTitle);
        if (data.dedicationNote) setDedicationNote(data.dedicationNote);
        if (data.musicSource) setMusicSource(data.musicSource);
      }
    });

    return () => unsubscribe();
  }, [coupleId]);

  // Sync Play / Pause State Across Both Phones via Firestore
  const togglePlayPause = async () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (coupleId) {
      try {
        await setDoc(
          doc(db, 'couples', coupleId, 'musicRoom', 'session'),
          {
            isPlaying: nextState,
            youtubeVideoId,
            songTitle,
            dedicationNote,
            musicSource,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (e) {
        console.log('Music sync error:', e);
      }
    }
  };

  // Extract Video ID from YouTube link or input
  const handleLoadYouTubeSong = async () => {
    if (!customInputUrl.trim()) return;

    let videoId = customInputUrl.trim();
    if (videoId.includes('v=')) {
      videoId = videoId.split('v=')[1].split('&')[0];
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1].split('?')[0];
    }

    setYoutubeVideoId(videoId);
    setSongTitle(`YouTube Song (${videoId})`);
    setIsPlaying(true);
    setCustomInputUrl('');

    if (coupleId) {
      await setDoc(
        doc(db, 'couples', coupleId, 'musicRoom', 'session'),
        {
          youtubeVideoId: videoId,
          songTitle: `YouTube Song (${videoId})`,
          isPlaying: true,
          musicSource: 'youtube',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  };

  // Set as Song of the Day for Partner's Home Screen Marquee Ticker
  const handleSetSongOfTheDay = async () => {
    if (!coupleId) return;

    try {
      await setDoc(
        doc(db, 'couples', coupleId),
        {
          songOfTheDay: {
            title: songTitle,
            artist: musicSource.toUpperCase(),
            dedication: dedicationNote || 'Always thinking of you 💕',
            setBy: 'Your Mpenzi',
            youtubeId: youtubeVideoId,
          },
        },
        { merge: true }
      );

      Alert.alert(
        'Song of the Day Updated! 🌟',
        'Your partner will see this scrolling on their Home Screen marquee banner!'
      );
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View
        style={[
          styles.headerCard,
          { backgroundColor: colors.cardBg, borderColor: colors.border },
        ]}
      >
        <Radio color={colors.primary} size={36} />
        <Text style={[styles.title, { color: colors.headerText }]}>
          Love Playlist & Jam Room 🎵
        </Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Virtual Music Date & Shared Audio Sync
        </Text>

        {/* Music Source Toggle Tabs */}
        <View style={styles.sourceToggleRow}>
          <TouchableOpacity
            style={[
              styles.sourceTab,
              {
                backgroundColor:
                  musicSource === 'youtube'
                    ? '#E53E3E'
                    : colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setMusicSource('youtube')}
          >
            <Tv
              color={musicSource === 'youtube' ? '#FFF' : colors.inputText}
              size={16}
            />
            <Text
              style={{
                fontWeight: '800',
                fontSize: 12,
                color: musicSource === 'youtube' ? '#FFF' : colors.inputText,
              }}
            >
              🔴 YouTube Free
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sourceTab,
              {
                backgroundColor:
                  musicSource === 'spotify'
                    ? '#1DB954'
                    : colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setMusicSource('spotify')}
          >
            <Music
              color={musicSource === 'spotify' ? '#FFF' : colors.inputText}
              size={16}
            />
            <Text
              style={{
                fontWeight: '800',
                fontSize: 12,
                color: musicSource === 'spotify' ? '#FFF' : colors.inputText,
              }}
            >
              🟢 Spotify Sync
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SYNCHRONIZED PLAYER JAM ROOM */}
      <View
        style={[
          styles.playerCard,
          { backgroundColor: colors.cardBg, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.nowPlayingTag, { color: colors.primary }]}>
          🔴 LIVE JAM ROOM — LISTENING TOGETHER
        </Text>

        {musicSource === 'youtube' ? (
          /* YouTube Video Stream Player */
          <View style={styles.videoPlayerWrapper}>
            <YoutubePlayer
              height={200}
              play={isPlaying}
              videoId={youtubeVideoId}
              onChangeState={(state) => {
                if (state === 'ended') setIsPlaying(false);
              }}
            />
          </View>
        ) : (
          /* Spotify Player Placeholder / Web Player Integration */
          <View
            style={[
              styles.spotifyArtBox,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
              }}
              style={styles.albumCover}
            />
            <Text style={[styles.spotifyStatusText, { color: colors.inputText }]}>
              Connected via Spotify Web API Sync 🎧
            </Text>
          </View>
        )}

        <Text style={[styles.trackTitle, { color: colors.headerText }]}>
          {songTitle}
        </Text>
        <Text style={[styles.dedicationText, { color: colors.subText }]}>
          "{dedicationNote}"
        </Text>

        {/* Sync Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.playPauseBtn, { backgroundColor: colors.primary }]}
            onPress={togglePlayPause}
          >
            {isPlaying ? (
              <Pause color="#FFF" size={24} />
            ) : (
              <Play color="#FFF" size={24} />
            )}
          </TouchableOpacity>
        </View>

        {/* Action: Set as Home Screen Song of the Day */}
        <TouchableOpacity
          style={[
            styles.songOfDayBtn,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
          onPress={handleSetSongOfTheDay}
        >
          <Star color="#F1C40F" size={18} fill="#F1C40F" />
          <Text style={[styles.songOfDayText, { color: colors.inputText }]}>
            Set as Home Screen "Song of the Day" Banner 🌟
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add New Song via YouTube Link */}
      {musicSource === 'youtube' && (
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.inputLabel, { color: colors.inputText }]}>
            Load Song via YouTube Link / Video ID
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.urlInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.inputText,
                },
              ]}
              placeholder="Paste YouTube link or video ID..."
              placeholderTextColor="#A0AEC0"
              value={customInputUrl}
              onChangeText={setCustomInputUrl}
            />
            <TouchableOpacity
              style={[
                styles.loadBtn,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleLoadYouTubeSong}
            >
              <Send color="#FFF" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Dedicated Song Wall */}
      <Text style={[styles.sectionTitle, { color: colors.subText }]}>
        Our Dedicated Songs Wall 📜
      </Text>

      {dedicatedSongs.map((song) => (
        <TouchableOpacity
          key={song.id}
          style={[
            styles.songCard,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
          onPress={() => {
            setYoutubeVideoId(song.videoId);
            setSongTitle(song.title);
            setDedicationNote(song.note);
            setIsPlaying(true);
          }}
        >
          <Heart color={colors.primary} size={20} fill={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.songTitleText, { color: colors.inputText }]}>
              {song.title}
            </Text>
            <Text style={[styles.songNoteText, { color: colors.subText }]}>
              "{song.note}"
            </Text>
          </View>
          <Play color={colors.primary} size={18} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  headerCard: {
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  title: { fontSize: 22, fontWeight: '800', marginTop: 10 },
  subtitle: { fontSize: 13, marginTop: 2, marginBottom: 15 },
  sourceToggleRow: { flexDirection: 'row', gap: 10, width: '100%' },
  sourceTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },

  playerCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  nowPlayingTag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  videoPlayerWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
  },
  spotifyArtBox: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  albumCover: { width: 120, height: 120, borderRadius: 16, marginBottom: 10 },
  spotifyStatusText: { fontSize: 13, fontWeight: '700' },
  trackTitle: { fontSize: 18, fontWeight: '800', marginTop: 8 },
  dedicationText: { fontSize: 13, fontStyle: 'italic', marginTop: 4 },

  controlsRow: { marginTop: 15, marginBottom: 15 },
  playPauseBtn: { padding: 18, borderRadius: 40 },

  songOfDayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  songOfDayText: { fontSize: 12, fontWeight: '700' },

  card: { padding: 16, borderRadius: 20, borderWidth: 1, marginTop: 15 },
  inputLabel: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  inputRow: { flexDirection: 'row', gap: 10 },
  urlInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 13,
  },
  loadBtn: { padding: 12, borderRadius: 12, justifyContent: 'center' },

  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: 25, marginBottom: 12 },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  songTitleText: { fontSize: 14, fontWeight: '700' },
  songNoteText: { fontSize: 12, fontStyle: 'italic' },
});