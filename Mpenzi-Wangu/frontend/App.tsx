import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';
import ChatScreen from './src/screens/ChatScreen';

export default function App() {
  const [session, setSession] = useState<{ userId: string; coupleId: string } | null>(null);

  if (!session) {
    return <AuthScreen onLoginSuccess={(userId, coupleId) => setSession({ userId, coupleId })} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>Mpenzi-Wangu 💕</Text>
          <Text style={styles.coupleTag}>Space: {session.coupleId}</Text>
        </View>
        <TouchableOpacity onPress={() => setSession(null)} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <ChatScreen coupleId={session.coupleId} userId={session.userId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD1DC',
  },
  appName: { fontSize: 18, fontWeight: '800', color: '#D81B60' },
  coupleTag: { fontSize: 12, color: '#718096', fontWeight: '600', marginTop: 2 },
  logoutBtn: { backgroundColor: '#FFF5F7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#FFD1DC' },
  logoutText: { fontSize: 12, color: '#D81B60', fontWeight: '700' }
});