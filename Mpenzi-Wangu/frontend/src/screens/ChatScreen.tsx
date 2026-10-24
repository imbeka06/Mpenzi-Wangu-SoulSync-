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

const EMOJI_CATEGORIES = {
  Love: ['💕', '💖', '🥰', '❤️', '💌', '🌹', '💋', '💍'],
  Ewe: ['🐑', '🐐', '🧸', '🌾', '🐾', '🌸'],
  Moon: ['🌙', '🌕', '🌒', '✨', '⭐', '🌌'],
  Flags: ['🇰🇪', '🇹🇿', '🇺🇬', '🇷🇼', '🇿🇦', '🇬🇧', '🇺🇸'],
};

export default function ChatScreen({ coupleId, userId }: { coupleId: string; userId: string }) {
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
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      {/* Top Header Action Bar with Voice & Video Call Buttons */}
      <View style={styles.topCallBar}>
        <Text style={styles.callHeaderTitle}>Talk with Mpenzi</Text>
        <View style={styles.callIconGroup}>
          <TouchableOpacity style={styles.callButton} onPress={() => handleCall('Voice')}>
            <Phone color="#FF6B8B" size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton} onPress={() => handleCall('Video')}>
            <Video color="#FF6B8B" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Messages List */}
      <FlatList
        inverted
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => {
          const isMe = item.senderId === userId;
          return (
            <View style={[styles.bubble, isMe ? styles.myBubble : styles.partnerBubble]}>
              <Text style={isMe ? styles.myText : styles.partnerText}>{item.text}</Text>
            </View>
          );
        }}
      />

      {/* Emoji Keyboard Picker Drawer */}
      {showEmojis && (
        <View style={styles.emojiPickerContainer}>
          <View style={styles.categoryHeader}>
            {(Object.keys(EMOJI_CATEGORIES) as Array<keyof typeof EMOJI_CATEGORIES>).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryTab, activeCategory === cat && styles.activeCategoryTab]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>
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
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.emojiToggle} onPress={() => setShowEmojis(!showEmojis)}>
          <Smile color="#FF6B8B" size={22} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Send a sweet message..."
          placeholderTextColor="#A0AEC0"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Send color="#FFF" size={18} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  topCallBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD1DC',
  },
  callHeaderTitle: { fontSize: 14, fontWeight: '700', color: '#D81B60' },
  callIconGroup: { flexDirection: 'row', gap: 10 },
  callButton: {
    backgroundColor: '#FFF5F7',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  bubble: { padding: 12, borderRadius: 18, marginVertical: 4, maxWidth: '80%' },
  myBubble: { backgroundColor: '#FF6B8B', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  partnerBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  myText: { color: '#FFFFFF', fontSize: 15 },
  partnerText: { color: '#2D3748', fontSize: 15 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#FFD1DC',
    gap: 10,
  },
  emojiToggle: { padding: 5 },
  input: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#FFD1DC',
    color: '#2D3748',
  },
  sendButton: { backgroundColor: '#FF6B8B', padding: 12, borderRadius: 25 },
  emojiPickerContainer: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#FFD1DC', paddingVertical: 8 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#FFF5F7', paddingBottom: 6 },
  categoryTab: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  activeCategoryTab: { backgroundColor: '#FF6B8B' },
  categoryText: { fontSize: 12, fontWeight: '600', color: '#718096' },
  activeCategoryText: { color: '#FFFFFF', fontWeight: '700' },
  emojiGrid: { paddingHorizontal: 15, paddingVertical: 10, gap: 12 },
  emojiItem: { padding: 6 },
});