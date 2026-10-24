import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  PenTool,
  Send,
  Save,
  Music,
  Tv,
  Heart,
  ChevronLeft,
  FileText,
  Clock,
  Play,
  CheckCheck,
} from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { WebView } from 'react-native-webview';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

export default function SweetNotesScreen({
  coupleId = 'couple_demo_123',
  userId = 'user_1',
}: {
  coupleId?: string;
  userId?: string;
}) {
  const { colors } = useTheme();

  // Screen Tabs: 'inbox' (All Sent/Received) | 'create' | 'drafts'
  const [activeTab, setActiveTab] = useState<'inbox' | 'create' | 'drafts'>('inbox');

  // Currently Selected Note to Read
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  // Form States for Creating / Editing Note
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [musicType, setMusicType] = useState<'youtube' | 'spotify'>('youtube');

  // Live Notes from Firestore
  const [notes, setNotes] = useState<any[]>([]);

  // Real-time Firestore Listener for Sweet Notes
  useEffect(() => {
    if (!coupleId) return;

    const notesRef = collection(db, 'couples', coupleId, 'sweetNotes');
    const q = query(notesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(notesRef, (snapshot) => {
      const fetchedNotes = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setNotes(fetchedNotes);
    });

    return () => unsubscribe();
  }, [coupleId]);

  // Extract YouTube Video ID
  const getYouTubeId = (url: string) => {
    if (!url) return 'mFBJtuQ1Llc';
    let id = url.trim();
    if (id.includes('v=')) id = id.split('v=')[1].split('&')[0];
    else if (id.includes('youtu.be/')) id = id.split('youtu.be/')[1].split('?')[0];
    return id;
  };

  // Extract Spotify Track ID
  const getSpotifyId = (url: string) => {
    if (!url) return '0KH3p7X1E3k4m4s3';
    let id = url.trim();
    if (id.includes('track/')) id = id.split('track/')[1].split('?')[0];
    return id;
  };

  // Save Note as Draft or Send directly to Mpenzi
  const handleSaveNote = async (isDraft: boolean) => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      Alert.alert('Missing Fields', 'Please enter both a title and message for your note.');
      return;
    }

    const detectedType = musicUrl.includes('spotify') ? 'spotify' : 'youtube';

    const noteData = {
      title: noteTitle,
      content: noteContent,
      musicUrl: musicUrl.trim(),
      musicType: detectedType,
      status: isDraft ? 'draft' : 'sent',
      authorId: userId,
      createdAt: new Date().toISOString(),
    };

    try {
      if (editingDraftId) {
        // Update existing draft
        await updateDoc(doc(db, 'couples', coupleId, 'sweetNotes', editingDraftId), noteData);
        Alert.alert('Updated! 💕', isDraft ? 'Draft updated successfully.' : 'Sweet Note delivered to your Mpenzi!');
      } else {
        // Save new note
        await addDoc(collection(db, 'couples', coupleId, 'sweetNotes'), noteData);
        Alert.alert(isDraft ? 'Draft Saved 📂' : 'Sent with Love! 💌', isDraft ? 'Saved in your Drafts tab.' : 'Delivered straight to your Mpenzi!');
      }

      // Reset Form Fields
      setNoteTitle('');
      setNoteContent('');
      setMusicUrl('');
      setEditingDraftId(null);
      setActiveTab(isDraft ? 'drafts' : 'inbox');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  // Filter Notes by Category
  const deliveredNotes = notes.filter((n) => n.status === 'sent');
  const draftNotes = notes.filter((n) => n.status === 'draft' && n.authorId === userId);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* HEADER */}
      <View style={[styles.headerCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <PenTool color="#E67E22" size={32} />
        <Text style={[styles.title, { color: colors.headerText }]}>Sweet Notes & Music 📜</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Write love letters with background soundtrack streams
        </Text>

        {/* Tab Selector */}
        <View style={styles.tabBarRow}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'inbox' && { backgroundColor: colors.primary }]}
            onPress={() => {
              setSelectedNote(null);
              setActiveTab('inbox');
            }}
          >
            <Heart color={activeTab === 'inbox' ? '#FFF' : colors.inputText} size={16} />
            <Text style={[styles.tabText, { color: activeTab === 'inbox' ? '#FFF' : colors.inputText }]}>Notes 💕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'create' && { backgroundColor: colors.primary }]}
            onPress={() => {
              setSelectedNote(null);
              setEditingDraftId(null);
              setActiveTab('create');
            }}
          >
            <PenTool color={activeTab === 'create' ? '#FFF' : colors.inputText} size={16} />
            <Text style={[styles.tabText, { color: activeTab === 'create' ? '#FFF' : colors.inputText }]}>Write ✍️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'drafts' && { backgroundColor: colors.primary }]}
            onPress={() => {
              setSelectedNote(null);
              setActiveTab('drafts');
            }}
          >
            <Clock color={activeTab === 'drafts' ? '#FFF' : colors.inputText} size={16} />
            <Text style={[styles.tabText, { color: activeTab === 'drafts' ? '#FFF' : colors.inputText }]}>Drafts 📂</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* VIEW 1: READ DETAILED NOTE */}
      {selectedNote ? (
        <View style={[styles.readerCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
            onPress={() => setSelectedNote(null)}
          >
            <ChevronLeft color={colors.primary} size={18} />
            <Text style={[styles.backText, { color: colors.primary }]}>Back to List</Text>
          </TouchableOpacity>

          <Text style={[styles.readerTitle, { color: colors.headerText }]}>{selectedNote.title}</Text>
          <Text style={[styles.readerDate, { color: colors.subText }]}>
            Sent on {new Date(selectedNote.createdAt).toLocaleDateString()}
          </Text>

          {/* Embedded Background Soundtrack Player */}
          {selectedNote.musicUrl && (
            <View style={styles.soundtrackBox}>
              <Text style={[styles.soundtrackTag, { color: colors.primary }]}>
                🎧 BACKGROUND SOUNDTRACK ATTACHED
              </Text>
              {selectedNote.musicType === 'spotify' ? (
                <WebView
                  style={{ height: 150, borderRadius: 14 }}
                  source={{
                    uri: `https://open.spotify.com/embed/track/${getSpotifyId(selectedNote.musicUrl)}?utm_source=generator&theme=0`,
                  }}
                  allowsInlineMediaPlayback={true}
                />
              ) : (
                <YoutubePlayer
                  height={180}
                  play={true}
                  videoId={getYouTubeId(selectedNote.musicUrl)}
                />
              )}
            </View>
          )}

          <Text style={[styles.readerContent, { color: colors.inputText }]}>{selectedNote.content}</Text>
        </View>
      ) : (
        <>
          {/* VIEW 2: DELIVERED NOTES LIST */}
          {activeTab === 'inbox' && (
            <View style={{ gap: 12 }}>
              {deliveredNotes.length === 0 ? (
                <View style={[styles.emptyBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                  <FileText color={colors.subText} size={36} />
                  <Text style={[styles.emptyText, { color: colors.subText }]}>
                    No Sweet Notes yet. Write your first love letter to Mpenzi!
                  </Text>
                </View>
              ) : (
                deliveredNotes.map((note) => (
                  <TouchableOpacity
                    key={note.id}
                    style={[styles.noteCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                    onPress={() => setSelectedNote(note)}
                  >
                    <View style={styles.noteCardHeader}>
                      <Text style={[styles.noteCardTitle, { color: colors.inputText }]}>{note.title}</Text>
                      <View style={styles.sentBadge}>
                        <CheckCheck color="#27AE60" size={14} />
                        <Text style={styles.sentBadgeText}>Delivered 💕</Text>
                      </View>
                    </View>
                    <Text numberOfLines={2} style={[styles.noteCardPreview, { color: colors.subText }]}>
                      {note.content}
                    </Text>
                    {note.musicUrl && (
                      <View style={styles.musicTagRow}>
                        <Music color="#8E44AD" size={14} />
                        <Text style={styles.musicTagText}>Soundtrack Attached</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* VIEW 3: WRITE / COMPOSE NOTE */}
          {activeTab === 'create' && (
            <View style={[styles.composeCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Text style={[styles.formHeader, { color: colors.headerText }]}>
                {editingDraftId ? 'Edit Draft Note 📂' : 'Compose Sweet Note ✍️'}
              </Text>

              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
                placeholder="Note Title (e.g., Thinking of You 💕)"
                placeholderTextColor="#A0AEC0"
                value={noteTitle}
                onChangeText={setNoteTitle}
              />

              <TextInput
                style={[
                  styles.textArea,
                  { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText },
                ]}
                placeholder="Write your sweet love letter here..."
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={6}
                value={noteContent}
                onChangeText={setNoteContent}
              />

              {/* Music Link Attachment Field */}
              <View style={{ width: '100%', gap: 6 }}>
                <Text style={[styles.fieldLabel, { color: colors.inputText }]}>
                  Attach YouTube or Spotify Link (e.g., Billie Eilish - Wildflower)
                </Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
                  placeholder="Paste YouTube or Spotify URL..."
                  placeholderTextColor="#A0AEC0"
                  value={musicUrl}
                  onChangeText={setMusicUrl}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.actionBtnRow}>
                <TouchableOpacity
                  style={[styles.draftBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => handleSaveNote(true)}
                >
                  <Save color={colors.inputText} size={16} />
                  <Text style={[styles.draftBtnText, { color: colors.inputText }]}>Save Draft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sendBtn, { backgroundColor: colors.primary }]}
                  onPress={() => handleSaveNote(false)}
                >
                  <Send color="#FFF" size={16} />
                  <Text style={styles.sendBtnText}>Send to Mpenzi</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* VIEW 4: SAVED DRAFTS TAB */}
          {activeTab === 'drafts' && (
            <View style={{ gap: 12 }}>
              {draftNotes.length === 0 ? (
                <View style={[styles.emptyBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                  <Clock color={colors.subText} size={36} />
                  <Text style={[styles.emptyText, { color: colors.subText }]}>No saved drafts found.</Text>
                </View>
              ) : (
                draftNotes.map((draft) => (
                  <TouchableOpacity
                    key={draft.id}
                    style={[styles.noteCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                    onPress={() => {
                      setEditingDraftId(draft.id);
                      setNoteTitle(draft.title);
                      setNoteContent(draft.content);
                      setMusicUrl(draft.musicUrl || '');
                      setActiveTab('create');
                    }}
                  >
                    <View style={styles.noteCardHeader}>
                      <Text style={[styles.noteCardTitle, { color: colors.inputText }]}>{draft.title}</Text>
                      <View style={[styles.sentBadge, { backgroundColor: '#E67E2220' }]}>
                        <Clock color="#E67E22" size={12} />
                        <Text style={[styles.sentBadgeText, { color: '#E67E22' }]}>Draft 📂</Text>
                      </View>
                    </View>
                    <Text numberOfLines={2} style={[styles.noteCardPreview, { color: colors.subText }]}>
                      {draft.content}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  headerCard: { padding: 20, borderRadius: 24, alignItems: 'center', borderWidth: 1, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '800', marginTop: 10 },
  subtitle: { fontSize: 12, marginTop: 2, marginBottom: 15 },

  tabBarRow: { flexDirection: 'row', gap: 8, width: '100%' },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    gap: 6,
  },
  tabText: { fontWeight: '800', fontSize: 12 },

  readerCard: { padding: 20, borderRadius: 24, borderWidth: 1 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    marginBottom: 15,
  },
  backText: { fontSize: 11, fontWeight: '700' },
  readerTitle: { fontSize: 20, fontWeight: '800' },
  readerDate: { fontSize: 11, marginTop: 4, marginBottom: 15 },

  soundtrackBox: { width: '100%', marginBottom: 15, borderRadius: 16, overflow: 'hidden' },
  soundtrackTag: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  readerContent: { fontSize: 15, lineHeight: 24, marginTop: 10 },

  emptyBox: { padding: 30, borderRadius: 24, borderWidth: 1, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 13, textAlign: 'center' },

  noteCard: { padding: 16, borderRadius: 20, borderWidth: 1, gap: 8 },
  noteCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  noteCardTitle: { fontSize: 16, fontWeight: '800' },
  noteCardPreview: { fontSize: 12, lineHeight: 18 },
  sentBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#27AE6020', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  sentBadgeText: { fontSize: 10, fontWeight: '800', color: '#27AE60' },

  musicTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  musicTagText: { fontSize: 11, fontWeight: '700', color: '#8E44AD' },

  composeCard: { padding: 20, borderRadius: 24, borderWidth: 1, gap: 14 },
  formHeader: { fontSize: 17, fontWeight: '800' },
  input: { width: '100%', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1, fontSize: 13 },
  textArea: { width: '100%', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1, fontSize: 13, textAlignVertical: 'top' },
  fieldLabel: { fontSize: 12, fontWeight: '700' },

  actionBtnRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 10 },
  draftBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 1, gap: 6 },
  draftBtnText: { fontWeight: '800', fontSize: 13 },
  sendBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, gap: 6 },
  sendBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
});