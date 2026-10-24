import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Send, Phone, Video, Smile } from 'lucide-react-native';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

const EMOJI_CATEGORIES = {
  Love: ['💕', '💖', '🥰', '❤️', '💌', '🌹', '💋', '💍'],
  Ewe: ['🐑', '🐐', '🧸', '🌾', '🐾', '🌸'],
  Moon: ['🌙', '🌕', '🌒', '✨', '⭐', '🌌'],
  Flags: ['🇰🇪', '🇹🇿', '🇺🇬', '🇷🇼', '🇿🇦', '🇬🇧', '🇺🇸'],
};

export default function ChatScreen({ coupleId, userId }: { coupleId: string; userId: string }) {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'Love' | 'Ewe' | 'Moon' | 'Flags'>('Love');

  useEffect(() => {
    const messagesRef = collection(db, 'couples', coupleId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [coupleId]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const messageText = inputText;
    setInputText('');

    await addDoc(collection(db, 'couples', coupleId, 'messages'), {
      text: messageText,
      senderId: userId,
      createdAt: serverTimestamp(),
    });
  };

  const handleCall = (type: 'Voice' | 'Video') => {
    Alert.alert(`Starting ${type} Call 📞`, `Calling your Mpenzi via secure connection...`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={90}
    >
      {/* Top Header Action Bar */}
      <View style={[styles.topCallBar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.callHeaderTitle, { color: colors.headerText }]}>Talk with Mpenzi</Text>
        <View style={styles.callIconGroup}>
          <TouchableOpacity style={[styles.callButton, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => handleCall('Voice')}>
            <Phone color={colors.primary} size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.callButton, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={() => handleCall('Video')}>
            <Video color={colors.primary} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        inverted
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => {
          const isMe = item.senderId === userId;
          return (
            <View
              style={[
                styles.bubble,
                isMe
                  ? { backgroundColor: colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 2 }
                  : { backgroundColor: colors.cardBg, borderColor: colors.border, alignSelf: 'flex-start', borderBottomLeftRadius: 2, borderWidth: 1 },
              ]}
            >
              <Text style={{ color: isMe ? '#FFFFFF' : colors.inputText, fontSize: 15 }}>{item.text}</Text>
            </View>
          );
        }}
      />

      {/* Emoji Picker */}
      {showEmojis && (
        <View style={[styles.emojiPickerContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <View style={[styles.categoryHeader, { borderColor: colors.border }]}>
            {(Object.keys(EMOJI_CATEGORIES) as Array<keyof typeof EMOJI_CATEGORIES>).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryTab, activeCategory === cat && { backgroundColor: colors.primary }]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: activeCategory === cat ? '#FFF' : colors.subText }}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiGrid}>
            {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={styles.emojiItem}
                onPress={() => setInputText((prev) => prev + emoji)}
              >
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Message Input Bar */}
      <View style={[styles.inputBar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <TouchableOpacity style={styles.emojiToggle} onPress={() => setShowEmojis(!showEmojis)}>
          <Smile color={colors.primary} size={22} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.inputText }]}
          placeholder="Send a sweet message..."
          placeholderTextColor="#A0AEC0"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={sendMessage}>
          <Send color="#FFF" size={18} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topCallBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  callHeaderTitle: { fontSize: 14, fontWeight: '700' },
  callIconGroup: { flexDirection: 'row', gap: 10 },
  callButton: { padding: 8, borderRadius: 20, borderWidth: 1 },
  bubble: { padding: 12, borderRadius: 18, marginVertical: 4, maxWidth: '80%' },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, gap: 10 },
  emojiToggle: { padding: 5 },
  input: { flex: 1, borderRadius: 25, paddingHorizontal: 18, paddingVertical: 10, fontSize: 15, borderWidth: 1 },
  sendButton: { padding: 12, borderRadius: 25 },
  emojiPickerContainer: { borderTopWidth: 1, paddingVertical: 8 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, paddingBottom: 6 },
  categoryTab: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  emojiGrid: { paddingHorizontal: 15, paddingVertical: 10, gap: 12 },
  emojiItem: { padding: 6 },
});