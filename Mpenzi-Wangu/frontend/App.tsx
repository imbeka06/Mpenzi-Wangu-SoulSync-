import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Home, MessageCircle, Calendar, Music, AlertCircle, PenTool, Image as ImageIcon } from 'lucide-react-native';

import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import CycleScreen from './src/screens/CycleScreen';
import MusicScreen from './src/screens/MusicScreen';
import SosScreen from './src/screens/SosScreen';
import SweetNotesScreen from './src/screens/SweetNotesScreen';
import GalleryScreen from './src/screens/GalleryScreen';

export default function App() {
  const [session, setSession] = useState<{ userId: string; coupleId: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'cycle' | 'sweetNotes' | 'gallery' | 'music' | 'sos'>('home');

  if (!session) {
    return <AuthScreen onLoginSuccess={(userId, coupleId) => setSession({ userId, coupleId })} />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={(screen: any) => setActiveTab(screen)} />;
      case 'chat':
        return <ChatScreen coupleId={session.coupleId} userId={session.userId} />;
      case 'cycle':
        return <CycleScreen coupleId={session.coupleId} />;
      case 'sweetNotes':
        return <SweetNotesScreen />;
      case 'gallery':
        return <GalleryScreen />;
      case 'music':
        return <MusicScreen />;
      case 'sos':
        return <SosScreen coupleId={session.coupleId} />;
      default:
        return <HomeScreen onNavigate={(screen: any) => setActiveTab(screen)} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Top Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setActiveTab('home')}>
          <Text style={styles.appName}>Mpenzi-Wangu 💕</Text>
          <Text style={styles.coupleTag}>Space: {session.coupleId}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSession(null)} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Screen Body */}
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* Bottom Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Home color={activeTab === 'home' ? '#FF6B8B' : '#A0AEC0'} size={20} />
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('chat')}>
          <MessageCircle color={activeTab === 'chat' ? '#FF6B8B' : '#A0AEC0'} size={20} />
          <Text style={[styles.tabLabel, activeTab === 'chat' && styles.activeTabLabel]}>Talk</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('sweetNotes')}>
          <PenTool color={activeTab === 'sweetNotes' ? '#FF6B8B' : '#A0AEC0'} size={20} />
          <Text style={[styles.tabLabel, activeTab === 'sweetNotes' && styles.activeTabLabel]}>Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('gallery')}>
          <ImageIcon color={activeTab === 'gallery' ? '#FF6B8B' : '#A0AEC0'} size={20} />
          <Text style={[styles.tabLabel, activeTab === 'gallery' && styles.activeTabLabel]}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('sos')}>
          <AlertCircle color={activeTab === 'sos' ? '#E53E3E' : '#A0AEC0'} size={20} />
          <Text style={[styles.tabLabel, activeTab === 'sos' && { color: '#E53E3E', fontWeight: '700' }]}>SOS</Text>
        </TouchableOpacity>
      </View>
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
  logoutText: { fontSize: 12, color: '#D81B60', fontWeight: '700' },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#FFD1DC',
  },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 10, color: '#A0AEC0', marginTop: 2, fontWeight: '600' },
  activeTabLabel: { color: '#FF6B8B', fontWeight: '700' }
});