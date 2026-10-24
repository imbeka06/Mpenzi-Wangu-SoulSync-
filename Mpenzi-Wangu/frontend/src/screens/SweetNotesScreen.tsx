import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { PenTool, Music, Play, Pause, Save, Send, Heart } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const MUSIC_OPTIONS = [
  { id: '1', title: 'Acoustic Love Melody 🎸' },
  { id: '2', title: 'Cozy Rain & Coffee Vibe 🌧️' },
  { id: '3', title: 'Midnight Starlight Serenade ✨' },
];

export default function SweetNotesScreen() {
  const { colors } = useTheme();
  const [mode, setMode] = useState<'view' | 'create'>('view');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(MUSIC_OPTIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [receivedNote] = useState({
    author: 'Your Love 💕',
    title: 'Thinking of You Today',
    body: 'I woke up missing your smile! Just wanted to leave you this sweet note. Play the attached track and enjoy your day! 🌸',
    track: 'Acoustic Love Melody 🎸',
    createdAt: 'Today at 8:30 AM',
  });

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: mode === 'view' ? colors.primary : colors.cardBg, borderColor: mode === 'view' ? colors.primary : colors.border }]}
          onPress={() => setMode('view')}
        >
          <Heart color={mode === 'view' ? '#FFF' : colors.primary} size={18} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: mode === 'view' ? '#FFF' : colors.primary }}>
            Read Mpenzi's Note
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: mode === 'create' ? colors.primary : colors.cardBg, borderColor: mode === 'create' ? colors.primary : colors.border }]}
          onPress={() => setMode('create')}
        >
          <PenTool color={mode === 'create' ? '#FFF' : colors.primary} size={18} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: mode === 'create' ? '#FFF' : colors.primary }}>
            Create Note
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'view' ? (
        <View style={[styles.noteCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.noteHeaderTag, { color: colors.headerText }]}>Letter from {receivedNote.author}</Text>
          <Text style={[styles.noteTitle, { color: colors.inputText }]}>{receivedNote.title}</Text>
          <Text style={[styles.noteDate, { color: colors.subText }]}>{receivedNote.createdAt}</Text>
          <Text style={[styles.noteBody, { color: colors.inputText }]}>{receivedNote.body}</Text>

          <View style={[styles.audioPlayerCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.audioLabel, { color: colors.subText }]}>Tagged Music Track:</Text>
              <Text style={[styles.audioTrackName, { color: colors.headerText }]}>{receivedNote.track}</Text>
            </View>
            <TouchableOpacity style={[styles.playButton, { backgroundColor: colors.primary }]} onPress={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause color="#FFF" size={20} /> : <Play color="#FFF" size={20} />}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={[styles.createCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.createHeading, { color: colors.headerText }]}>Write a Sweet Note 💌</Text>

          <TextInput
            style={[styles.inputTitle, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
            placeholder="Note Title"
            placeholderTextColor="#A0AEC0"
            value={noteTitle}
            onChangeText={setNoteTitle}
          />

          <TextInput
            style={[styles.inputBody, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
            placeholder="Write your heartfelt note..."
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={noteBody}
            onChangeText={setNoteBody}
          />

          <Text style={[styles.musicSelectLabel, { color: colors.inputText }]}>Tag Music Track:</Text>
          {MUSIC_OPTIONS.map((track) => (
            <TouchableOpacity
              key={track.id}
              style={[
                styles.trackChip,
                { backgroundColor: selectedTrack.id === track.id ? colors.background : colors.cardBg, borderColor: selectedTrack.id === track.id ? colors.primary : colors.border },
              ]}
              onPress={() => setSelectedTrack(track)}
            >
              <Music color={selectedTrack.id === track.id ? colors.primary : colors.subText} size={18} />
              <Text style={{ fontSize: 13, fontWeight: selectedTrack.id === track.id ? '700' : '600', color: selectedTrack.id === track.id ? colors.headerText : colors.subText }}>
                {track.title}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.postBtn, { backgroundColor: colors.primary }]} onPress={handlePostNote}>
            <Send color="#FFF" size={18} />
            <Text style={styles.postBtnText}>Post to Partner</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 16, borderWidth: 1, gap: 8 },
  noteCard: { borderRadius: 24, padding: 24, borderWidth: 1 },
  noteHeaderTag: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  noteTitle: { fontSize: 22, fontWeight: '800', marginTop: 6 },
  noteDate: { fontSize: 12, marginTop: 2, marginBottom: 15 },
  noteBody: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  audioPlayerCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
  audioLabel: { fontSize: 11, fontWeight: '600' },
  audioTrackName: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  playButton: { padding: 12, borderRadius: 25 },
  createCard: { borderRadius: 24, padding: 20, borderWidth: 1 },
  createHeading: { fontSize: 18, fontWeight: '800', marginBottom: 15 },
  inputTitle: { borderRadius: 12, padding: 14, borderWidth: 1, fontSize: 15, marginBottom: 12 },
  inputBody: { borderRadius: 12, padding: 14, borderWidth: 1, fontSize: 15, height: 120, marginBottom: 15 },
  musicSelectLabel: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  trackChip: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, gap: 10 },
  postBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 12, gap: 6, marginTop: 15 },
  postBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});