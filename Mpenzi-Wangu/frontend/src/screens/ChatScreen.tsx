import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Send } from 'lucide-react-native';
import { db } from '../lib/firebase';

export default function ChatScreen({ coupleId, userId }: { coupleId: string; userId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container} keyboardVerticalOffset={90}>
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
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Send a sweet note..."
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
  bubble: { padding: 12, borderRadius: 18, marginVertical: 4, maxWidth: '80%' },
  myBubble: { backgroundColor: '#FF6B8B', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  partnerBubble: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderBottomLeftRadius: 2, borderWidth: 1, borderColor: '#FFD1DC' },
  myText: { color: '#FFFFFF', fontSize: 15 },
  partnerText: { color: '#2D3748', fontSize: 15 },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#FFD1DC', gap: 10 },
  input: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#FFD1DC',
    color: '#2D3748'
  },
  sendButton: { backgroundColor: '#FF6B8B', padding: 12, borderRadius: 25 },
});