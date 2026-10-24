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
  Vibration,
  Linking,
} from 'react-native';
import {
  Music,
  Play,
  Pause,
  Heart,
  Send,
  Radio,
  Star,
  Tv,
  Mic,
  PhoneCall,
  ChevronLeft,
  Disc,
  PlusCircle,
} from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { WebView } from 'react-native-webview';
import { doc, onSnapshot, setDoc, collection, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

export default function MusicScreen({
  coupleId = 'couple_demo_123',
  userId = 'user_1',
  onStartVoiceCall,
}: {
  coupleId?: string;
  userId?: string;
  onStartVoiceCall?: () => void;
}) {
  const { colors } = useTheme();

  // Navigation State inside Music Screen
  const [activeTab, setActiveTab] = useState<
    'hub' | 'jamRoom' | 'songWall' | 'jingles'
  >('hub');

  // Jam Room States
  const [jamSource, setJamSource] = useState<'youtube' | 'spotify'>('youtube');
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState('mFBJtuQ1Llc');
  const [spotifyTrackId, setSpotifyTrackId] = useState('0KH3p7X1E3k4m4s3');
  const [songTitle, setSongTitle] = useState('Sauti Sol - Suzzanna 💕');
  const [dedicationNote, setDedicationNote] = useState('Our favorite road trip anthem!');

  // Per-Section Link Inputs in Jam Room
  const [youtubeJamInput, setYoutubeJamInput] = useState('');
  const [spotifyJamInput, setSpotifyJamInput] = useState('');

  // Dedicated Wall States & Active Tab
  const [wallTab, setWallTab] = useState<'youtube' | 'spotify'>('youtube');
  const [wallSongs, setWallSongs] = useState<any[]>([]);
  
  // Dedicated Wall Add Song Form Inputs
  const [showAddForm, setShowAddForm] = useState(false);
  const [wallSongTitle, setWallSongTitle] = useState('');
  const [wallSongUrl, setWallSongUrl] = useState('');
  const [wallSongNote, setWallSongNote] = useState('');

  // Voice Jingle Input
  const [isRecording, setIsRecording] = useState(false);
  const [jingleNote, setJingleNote] = useState('');

  // 1. Real-time Firestore Sync for Jam Room Session
  useEffect(() => {
    if (!coupleId) return;

    const sessionRef = doc(db, 'couples', coupleId, 'musicRoom', 'session');
    const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.isPlaying !== undefined) setIsPlaying(data.isPlaying);
        if (data.youtubeVideoId) setYoutubeVideoId(data.youtubeVideoId);
        if (data.spotifyTrackId) setSpotifyTrackId(data.spotifyTrackId);
        if (data.songTitle) setSongTitle(data.songTitle);
        if (data.dedicationNote) setDedicationNote(data.dedicationNote);
        if (data.jamSource) setJamSource(data.jamSource);
      }
    });

    return () => unsubscribe();
  }, [coupleId]);

  // 2. Real-time Firestore Sync for Dedicated Wall Songs
  useEffect(() => {
    if (!coupleId) return;

    const wallRef = collection(db, 'couples', coupleId, 'musicWall');
    const q = query(wallRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSongs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setWallSongs(fetchedSongs);
    });

    return () => unsubscribe();
  }, [coupleId]);

  // Handle Loading Music directly inside Jam Room
  const handleLoadJamYouTube = async () => {
    if (!youtubeJamInput.trim()) return;
    let videoId = youtubeJamInput.trim();
    if (videoId.includes('v=')) {
      videoId = videoId.split('v=')[1].split('&')[0];
    } else if (videoId.includes('youtu.be/')) {
      videoId = videoId.split('youtu.be/')[1].split('?')[0];
    }

    const title = `YouTube Song (${videoId})`;
    setYoutubeVideoId(videoId);
    setSongTitle(title);
    setIsPlaying(true);
    setYoutubeJamInput('');

    if (coupleId) {
      await setDoc(
        doc(db, 'couples', coupleId, 'musicRoom', 'session'),
        {
          youtubeVideoId: videoId,
          songTitle: title,
          dedicationNote: 'Listening together in YouTube Jam Room 💕',
          isPlaying: true,
          jamSource: 'youtube',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  };

  const handleLoadJamSpotify = async () => {
    if (!spotifyJamInput.trim()) return;
    let trackId = spotifyJamInput.trim();
    if (trackId.includes('track/')) {
      trackId = trackId.split('track/')[1].split('?')[0];
    }

    const title = `Spotify Track (${trackId})`;
    setSpotifyTrackId(trackId);
    setSongTitle(title);
    setIsPlaying(true);
    setSpotifyJamInput('');

    if (coupleId) {
      await setDoc(
        doc(db, 'couples', coupleId, 'musicRoom', 'session'),
        {
          spotifyTrackId: trackId,
          songTitle: title,
          dedicationNote: 'Listening together in Spotify Jam Room 💕',
          isPlaying: true,
          jamSource: 'spotify',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  };

  // Toggle Jam Room Sync Play/Pause
  const togglePlayPause = async () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);

    if (coupleId) {
      await setDoc(
        doc(db, 'couples', coupleId, 'musicRoom', 'session'),
        {
          isPlaying: nextState,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  };

  // Set Current Song as Home Screen Song of the Day Banner
  const handleSetSongOfTheDay = async () => {
    if (!coupleId) return;

    try {
      await setDoc(
        doc(db, 'couples', coupleId),
        {
          songOfTheDay: {
            title: songTitle,
            artist: jamSource.toUpperCase(),
            dedication: dedicationNote || 'Always thinking of you 💕',
            setBy: 'Your Mpenzi',
            source: jamSource,
            youtubeVideoId,
            spotifyTrackId,
            updatedAt: new Date().toISOString(),
          },
        },
        { merge: true }
      );

      Alert.alert(
        'Song of the Day Set! 🌟',
        'Your partner will see this scrolling on their Home Screen marquee banner!'
      );
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  // Save New Song to Dedicated Songs Wall Subcollection
  const handleAddWallSong = async () => {
    if (!wallSongTitle.trim() || !wallSongUrl.trim()) {
      Alert.alert('Missing Info', 'Please enter a song title and link.');
      return;
    }

    let videoId = '';
    let trackId = '';

    if (wallTab === 'youtube') {
      videoId = wallSongUrl.trim();
      if (videoId.includes('v=')) videoId = videoId.split('v=')[1].split('&')[0];
      else if (videoId.includes('youtu.be/')) videoId = videoId.split('youtu.be/')[1].split('?')[0];
    } else {
      trackId = wallSongUrl.trim();
      if (trackId.includes('track/')) trackId = trackId.split('track/')[1].split('?')[0];
    }

    try {
      await addDoc(collection(db, 'couples', coupleId, 'musicWall'), {
        title: wallSongTitle,
        note: wallSongNote || 'Added with love 💕',
        url: wallSongUrl,
        type: wallTab,
        videoId,
        trackId,
        addedBy: userId,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Song Saved! 📜', `Added to your ${wallTab.toUpperCase()} Dedicated Wall!`);
      setWallSongTitle('');
      setWallSongUrl('');
      setWallSongNote('');
      setShowAddForm(false);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  // Send Voice Jingle Directly into Partner's Chat
  const handleSendVoiceJingleToChat = async () => {
    if (!coupleId) return;

    try {
      await addDoc(collection(db, 'couples', coupleId, 'messages'), {
        senderId: userId,
        text: `🎙️ Love Voice Jingle: "${jingleNote || 'Listen to my heart note! 💕'}"`,
        audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
        createdAt: new Date().toISOString(),
        type: 'voiceNote',
      });

      Alert.alert(
        'Jingle Sent! 💌',
        'Delivered directly to your chat! Both you and your partner can now listen to it in the Talk section.'
      );
      setJingleNote('');
      setActiveTab('hub');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* HEADER WITH BACK BUTTON */}
      <View style={[styles.headerCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        {activeTab !== 'hub' && (
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
            onPress={() => setActiveTab('hub')}
          >
            <ChevronLeft color={colors.primary} size={20} />
            <Text style={[styles.backText, { color: colors.primary }]}>Back to Cards</Text>
          </TouchableOpacity>
        )}

        <Radio color={colors.primary} size={32} />
        <Text style={[styles.title, { color: colors.headerText }]}>Love Playlist Hub 💕</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Virtual Music Dates, Shared Playlists & Audio Notes
        </Text>
      </View>

      {/* VIEW 1: MAIN ARRANGED CARDS MENU */}
      {activeTab === 'hub' && (
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={[styles.hubCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => setActiveTab('jamRoom')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: '#E53E3E20' }]}>
              <Radio color="#E53E3E" size={28} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.inputText }]}>Virtual Jam Room 📻</Text>
            <Text style={[styles.cardDesc, { color: colors.subText }]}>
              Live music playback, add songs on the fly, talk over music & send heartbeat vibes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.hubCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => setActiveTab('songWall')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: '#1DB95420' }]}>
              <Disc color="#1DB954" size={28} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.inputText }]}>Dedicated Songs Wall 📜</Text>
            <Text style={[styles.cardDesc, { color: colors.subText }]}>
              Categorized YouTube tracks & Spotify playlists with custom notes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.hubCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            onPress={() => setActiveTab('jingles')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: '#8E44AD20' }]}>
              <Mic color="#8E44AD" size={28} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.inputText }]}>Love Voice Jingles 🎙️</Text>
            <Text style={[styles.cardDesc, { color: colors.subText }]}>
              Record audio notes with sweet messages sent directly into your chat timeline
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* VIEW 2: JAM ROOM (WITH SEPARATE YOUTUBE/SPOTIFY INPUTS & VOICE CALL) */}
      {activeTab === 'jamRoom' && (
        <View style={[styles.subCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.subCardTitle, { color: colors.primary }]}>🔴 LIVE JAM ROOM — MUSIC DATE</Text>

          {/* Source Switcher Tabs */}
          <View style={styles.sourceToggleRow}>
            <TouchableOpacity
              style={[
                styles.sourceTab,
                { backgroundColor: jamSource === 'youtube' ? '#E53E3E' : colors.background, borderColor: colors.border },
              ]}
              onPress={() => setJamSource('youtube')}
            >
              <Tv color={jamSource === 'youtube' ? '#FFF' : colors.inputText} size={16} />
              <Text style={{ fontWeight: '800', color: jamSource === 'youtube' ? '#FFF' : colors.inputText }}>YouTube Free</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sourceTab,
                { backgroundColor: jamSource === 'spotify' ? '#1DB954' : colors.background, borderColor: colors.border },
              ]}
              onPress={() => setJamSource('spotify')}
            >
              <Music color={jamSource === 'spotify' ? '#FFF' : colors.inputText} size={16} />
              <Text style={{ fontWeight: '800', color: jamSource === 'spotify' ? '#FFF' : colors.inputText }}>Spotify Sync</Text>
            </TouchableOpacity>
          </View>

          {/* Talk Over Music Voice Call Button */}
          <TouchableOpacity style={[styles.callOverlayBtn, { backgroundColor: colors.primary }]} onPress={onStartVoiceCall}>
            <PhoneCall color="#FFF" size={18} />
            <Text style={styles.callOverlayText}>Talk Over Music (Voice Call) 📞</Text>
          </TouchableOpacity>

          {/* PER-SECTION LINK INPUTS */}
          {jamSource === 'youtube' ? (
            <View style={styles.inRoomInputRow}>
              <TextInput
                style={[styles.miniInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
                placeholder="Paste YouTube URL to play now..."
                placeholderTextColor="#A0AEC0"
                value={youtubeJamInput}
                onChangeText={setYoutubeJamInput}
              />
              <TouchableOpacity style={[styles.miniLoadBtn, { backgroundColor: colors.primary }]} onPress={handleLoadJamYouTube}>
                <PlusCircle color="#FFF" size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inRoomInputRow}>
              <TextInput
                style={[styles.miniInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
                placeholder="Paste Spotify track URL..."
                placeholderTextColor="#A0AEC0"
                value={spotifyJamInput}
                onChangeText={setSpotifyJamInput}
              />
              <TouchableOpacity style={[styles.miniLoadBtn, { backgroundColor: '#1DB954' }]} onPress={handleLoadJamSpotify}>
                <PlusCircle color="#FFF" size={20} />
              </TouchableOpacity>
            </View>
          )}

          {/* PLAYERS */}
          {jamSource === 'youtube' ? (
            <View style={styles.playerContainer}>
              <YoutubePlayer
                height={190}
                play={isPlaying}
                videoId={youtubeVideoId}
                onChangeState={(state: string) => {
                  if (state === 'ended') setIsPlaying(false);
                }}
              />
            </View>
          ) : (
            <View style={styles.spotifyFrameContainer}>
              <WebView
                style={{ height: 180, borderRadius: 16 }}
                source={{
                  uri: `https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`,
                }}
                allowsInlineMediaPlayback={true}
              />
            </View>
          )}

          <Text style={[styles.songTitle, { color: colors.headerText }]}>{songTitle}</Text>
          <Text style={[styles.dedicationText, { color: colors.subText }]}>"{dedicationNote}"</Text>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity style={[styles.playPauseBtn, { backgroundColor: colors.primary }]} onPress={togglePlayPause}>
              {isPlaying ? <Pause color="#FFF" size={22} /> : <Play color="#FFF" size={22} />}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.vibeBtn, { backgroundColor: '#E53E3E' }]} onPress={() => Vibration.vibrate([0, 150, 100, 150])}>
              <Heart color="#FFF" size={22} fill="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Set as Home Banner Ticker Button */}
          <TouchableOpacity style={[styles.tickerSetBtn, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={handleSetSongOfTheDay}>
            <Star color="#F1C40F" size={16} fill="#F1C40F" />
            <Text style={[styles.tickerSetText, { color: colors.inputText }]}>Set as Home Screen "Song of the Day" Banner 🌟</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* VIEW 3: DEDICATED SONGS WALL (NO CALL BUTTON HERE, SEPARATE ADD FORMS) */}
      {activeTab === 'songWall' && (
        <View style={{ gap: 15 }}>
          <Text style={[styles.subCardTitle, { color: colors.headerText }]}>Our Dedicated Songs Wall 📜</Text>

          {/* Category Toggle Tabs */}
          <View style={styles.sourceToggleRow}>
            <TouchableOpacity
              style={[styles.sourceTab, { backgroundColor: wallTab === 'youtube' ? '#E53E3E' : colors.cardBg, borderColor: colors.border }]}
              onPress={() => setWallTab('youtube')}
            >
              <Tv color={wallTab === 'youtube' ? '#FFF' : colors.inputText} size={16} />
              <Text style={{ fontWeight: '800', color: wallTab === 'youtube' ? '#FFF' : colors.inputText }}>🔴 YouTube Tracks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sourceTab, { backgroundColor: wallTab === 'spotify' ? '#1DB954' : colors.cardBg, borderColor: colors.border }]}
              onPress={() => setWallTab('spotify')}
            >
              <Music color={wallTab === 'spotify' ? '#FFF' : colors.inputText} size={16} />
              <Text style={{ fontWeight: '800', color: wallTab === 'spotify' ? '#FFF' : colors.inputText }}>🟢 Spotify Playlists</Text>
            </TouchableOpacity>
          </View>

          {/* Add Song Toggle Button */}
          <TouchableOpacity
            style={[styles.addSongToggleBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <PlusCircle color="#FFF" size={18} />
            <Text style={styles.addSongToggleText}>{showAddForm ? 'Close Form' : `Add ${wallTab.toUpperCase()} Track`}</Text>
          </TouchableOpacity>

          {/* Add Song Form */}
          {showAddForm && (
            <View style={[styles.addFormCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
                placeholder="Song Title & Artist..."
                placeholderTextColor="#A0AEC0"
                value={wallSongTitle}
                onChangeText={setWallSongTitle}
              />
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
                placeholder={wallTab === 'youtube' ? 'Paste YouTube URL...' : 'Paste Spotify Track/Playlist URL...'}
                placeholderTextColor="#A0AEC0"
                value={wallSongUrl}
                onChangeText={setWallSongUrl}
              />
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
                placeholder="Write your custom dedication note..."
                placeholderTextColor="#A0AEC0"
                value={wallSongNote}
                onChangeText={setWallSongNote}
              />
              <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleAddWallSong}>
                <Send color="#FFF" size={16} />
                <Text style={styles.submitText}>Save to Wall</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Song List */}
          {wallSongs
            .filter((s) => s.type === wallTab)
            .map((song) => (
              <TouchableOpacity
                key={song.id}
                style={[styles.songCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                onPress={() => {
                  if (song.type === 'spotify') {
                    setSpotifyTrackId(song.trackId || '0KH3p7X1E3k4m4s3');
                    setJamSource('spotify');
                  } else {
                    setYoutubeVideoId(song.videoId || 'mFBJtuQ1Llc');
                    setJamSource('youtube');
                  }
                  setSongTitle(song.title);
                  setDedicationNote(song.note);
                  setActiveTab('jamRoom');
                  setIsPlaying(true);
                }}
              >
                {song.type === 'spotify' ? (
                  <Music color="#1DB954" size={22} />
                ) : (
                  <Heart color={colors.primary} size={22} fill={colors.primary} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.songTitleText, { color: colors.inputText }]}>{song.title}</Text>
                  <Text style={[styles.songNoteText, { color: colors.subText }]}>"{song.note}"</Text>
                </View>
                <Play color={colors.primary} size={18} />
              </TouchableOpacity>
            ))}
        </View>
      )}

      {/* VIEW 4: LOVE VOICE JINGLES (DELIVERS DIRECTLY TO CHAT) */}
      {activeTab === 'jingles' && (
        <View style={[styles.subCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.subCardTitle, { color: colors.inputText }]}>Record Voice Love Jingle 🎙️</Text>
          <Text style={[styles.cardDesc, { color: colors.subText, marginBottom: 15 }]}>
            Record an audio love note and attach a sweet message. It will be delivered straight to your Chat timeline for both of you to hear!
          </Text>

          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
            placeholder="Add a sweet accompanying note..."
            placeholderTextColor="#A0AEC0"
            value={jingleNote}
            onChangeText={setJingleNote}
          />

          <TouchableOpacity
            style={[styles.recordBtn, { backgroundColor: isRecording ? '#E53E3E' : colors.primary }]}
            onPress={() => {
              setIsRecording(!isRecording);
              if (!isRecording) {
                Alert.alert('Recording Started 🎙️', 'Speak your love message now...');
              } else {
                handleSendVoiceJingleToChat();
              }
            }}
          >
            <Mic color="#FFF" size={24} />
            <Text style={styles.recordText}>{isRecording ? 'Stop & Deliver to Chat 💕' : 'Hold to Record Voice Jingle'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  headerCard: { padding: 20, borderRadius: 24, alignItems: 'center', borderWidth: 1, marginBottom: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', position: 'absolute', top: 15, left: 15, padding: 8, borderRadius: 16, borderWidth: 1, gap: 4 },
  backText: { fontSize: 11, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '800', marginTop: 10 },
  subtitle: { fontSize: 12, marginTop: 2 },

  gridContainer: { gap: 15 },
  hubCard: { padding: 20, borderRadius: 22, borderWidth: 1, gap: 8 },
  cardIconBox: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '800' },
  cardDesc: { fontSize: 12 },

  subCard: { padding: 20, borderRadius: 24, borderWidth: 1, alignItems: 'center', width: '100%' },
  subCardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },

  sourceToggleRow: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 12 },
  sourceTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 16, borderWidth: 1, gap: 6 },

  callOverlayBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 18, gap: 8, marginBottom: 12 },
  callOverlayText: { color: '#FFF', fontWeight: '800', fontSize: 12 },

  inRoomInputRow: { flexDirection: 'row', gap: 8, width: '100%', marginBottom: 12 },
  miniInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, fontSize: 12 },
  miniLoadBtn: { padding: 8, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  playerContainer: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 10 },
  spotifyFrameContainer: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 10 },

  songTitle: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  dedicationText: { fontSize: 12, fontStyle: 'italic', marginTop: 2 },

  controlsRow: { flexDirection: 'row', gap: 15, marginTop: 12, marginBottom: 12, alignItems: 'center' },
  playPauseBtn: { padding: 14, borderRadius: 30 },
  vibeBtn: { padding: 14, borderRadius: 30 },

  tickerSetBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, gap: 6 },
  tickerSetText: { fontSize: 11, fontWeight: '700' },

  addSongToggleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 14, gap: 6, marginBottom: 10 },
  addSongToggleText: { color: '#FFF', fontWeight: '800', fontSize: 12 },

  addFormCard: { padding: 16, borderRadius: 18, borderWidth: 1, width: '100%', gap: 10, marginBottom: 15 },
  input: { width: '100%', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, fontSize: 12 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, gap: 6, justifyContent: 'center' },
  submitText: { color: '#FFF', fontWeight: '800', fontSize: 12 },

  songCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 18, borderWidth: 1, gap: 12, width: '100%', marginBottom: 8 },
  songTitleText: { fontSize: 14, fontWeight: '700' },
  songNoteText: { fontSize: 12, fontStyle: 'italic' },

  recordBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 22, borderRadius: 25, gap: 10, marginTop: 10 },
  recordText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});