import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { PenTool, Music, Play, Pause, Save, Send, Heart } from 'lucide-react-native';

const MUSIC_OPTIONS = [
  { id: '1', title: 'Acoustic Love Melody 🎸' },
  { id: '2', title: 'Cozy Rain & Coffee Vibe 🌧️' },
  { id: '3', title: 'Midnight Starlight Serenade ✨' },
];

export default function SweetNotesScreen() {
  const [mode, setMode] = useState<'view' | 'create'>('view');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(MUSIC_OPTIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [draft, setDraft] = useState<{ title: string; body: string } | null>(null);

  // Active Note Received from Partner
  const [receivedNote] = useState({
    author: 'Your Love 💕',
    title: 'Thinking of You Today',
    body: 'I woke up missing your smile! Just wanted to leave you this sweet note to remind you how much you mean to me. Play the music attached and enjoy your day! 🌸',
    track: 'Acoustic Love Melody 🎸',
    createdAt: 'Today at 8:30 AM',
  });

  const handleSaveDraft = () => {
    setDraft({ title: noteTitle, body: noteBody });
    Alert.alert('Draft Saved 📝', 'Your note draft has been saved locally!');
  };

  const handlePostNote = () => {
    if (!noteTitle || !noteBody) {
      Alert.alert('Missing Info', 'Please write a title and note body before posting.');
      return;
    }
    Alert.alert('Note Sent! 💕', 'Your Mpenzi has received a sweet note notification!');
    setNoteTitle('');
    setNoteBody('');
    setMode('view');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Toggle Header */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === 'view' && styles.activeToggleBtn]}
          onPress={() => setMode('view')}
        >
          <Heart color={mode === 'view' ? '#FFF' : '#FF6B8B'} size={18} />
          <Text style={[styles.toggleText, mode === 'view' && styles.activeToggleText]}>
            Read Mpenzi's Note
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, mode === 'create' && styles.activeToggleBtn]}
          onPress={() => setMode('create')}
        >
          <PenTool color={mode === 'create' ? '#FFF' : '#FF6B8B'} size={18} />
          <Text style={[styles.toggleText, mode === 'create' && styles.activeToggleText]}>
            Create Note
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODE 1: READ RECEIVED NOTE WITH MUSIC PLAYER */}
      {mode === 'view' ? (
        <View style={styles.noteCard}>
          <Text style={styles.noteHeaderTag}>Letter from {receivedNote.author}</Text>
          <Text style={styles.noteTitle}>{receivedNote.title}</Text>
          <Text style={styles.noteDate}>{receivedNote.createdAt}</Text>
          <Text style={styles.noteBody}>{receivedNote.body}</Text>

          {/* Attached Music Player Widget */}
          <View style={styles.audioPlayerCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.audioLabel}>Tagged Music Track:</Text>
              <Text style={styles.audioTrackName}>{receivedNote.track}</Text>
            </View>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause color="#FFF" size={20} /> : <Play color="#FFF" size={20} />}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* MODE 2: CREATE NOTE & ATTACH MUSIC */
        <View style={styles.createCard}>
          <Text style={styles.createHeading}>Write a Sweet Notepad Note 💌</Text>

          <TextInput
            style={styles.inputTitle}
            placeholder="Note Title (e.g., My Dearest...)"
            placeholderTextColor="#A0AEC0"
            value={noteTitle}
            onChangeText={setNoteTitle}
          />

          <TextInput
            style={styles.inputBody}
            placeholder="Write your heartfelt note here..."
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={noteBody}
            onChangeText={setNoteBody}
          />

          {/* Attach Music Track */}
          <Text style={styles.musicSelectLabel}>Tag a Music Track to Play Along:</Text>
          {MUSIC_OPTIONS.map((track) => (
            <TouchableOpacity
              key={track.id}
              style={[
                styles.trackChip,
                selectedTrack.id === track.id && styles.selectedTrackChip,
              ]}
              onPress={() => setSelectedTrack(track)}
            >
              <Music color={selectedTrack.id === track.id ? '#D81B60' : '#A0AEC0'} size={18} />
              <Text
                style={[
                  styles.trackChipText,
                  selectedTrack.id === track.id && styles.selectedTrackText,
                ]}
              >
                {track.title}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft}>
              <Save color="#718096" size={18} />
              <Text style={styles.draftBtnText}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.postBtn} onPress={handlePostNote}>
              <Send color="#FFF" size={18} />
              <Text style={styles.postBtnText}>Post to Partner</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  content: { padding: 20 },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FFD1DC',
    gap: 8,
  },
  activeToggleBtn: { backgroundColor: '#FF6B8B', borderColor: '#FF6B8B' },
  toggleText: { fontSize: 13, fontWeight: '700', color: '#FF6B8B' },
  activeToggleText: { color: '#FFF' },

  // Read Note Card
  noteCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#FFD1DC',
    elevation: 3,
  },
  noteHeaderTag: { fontSize: 12, fontWeight: '800', color: '#D81B60', textTransform: 'uppercase' },
  noteTitle: { fontSize: 22, fontWeight: '800', color: '#2D3748', marginTop: 6 },
  noteDate: { fontSize: 12, color: '#A0AEC0', marginTop: 2, marginBottom: 15 },
  noteBody: { fontSize: 15, color: '#4A5568', lineHeight: 22, marginBottom: 20 },
  audioPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  audioLabel: { fontSize: 11, color: '#718096', fontWeight: '600' },
  audioTrackName: { fontSize: 14, fontWeight: '700', color: '#D81B60', marginTop: 2 },
  playButton: { backgroundColor: '#FF6B8B', padding: 12, borderRadius: 25 },

  // Create Note Form
  createCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#FFD1DC' },
  createHeading: { fontSize: 18, fontWeight: '800', color: '#D81B60', marginBottom: 15 },
  inputTitle: { backgroundColor: '#FFF5F7', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#FFD1DC', fontSize: 15, marginBottom: 12, color: '#2D3748' },
  inputBody: { backgroundColor: '#FFF5F7', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#FFD1DC', fontSize: 15, height: 120, marginBottom: 15, color: '#2D3748' },
  musicSelectLabel: { fontSize: 13, fontWeight: '700', color: '#4A5568', marginBottom: 10 },
  trackChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5F7', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#FFD1DC', gap: 10 },
  selectedTrackChip: { backgroundColor: '#FFE4E8', borderColor: '#D81B60' },
  trackChipText: { fontSize: 13, color: '#4A5568', fontWeight: '600' },
  selectedTrackText: { color: '#D81B60', fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
  draftBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#EDF2F7', padding: 14, borderRadius: 12, gap: 6 },
  draftBtnText: { color: '#4A5568', fontWeight: '700', fontSize: 14 },
  postBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6B8B', padding: 14, borderRadius: 12, gap: 6 },
  postBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});