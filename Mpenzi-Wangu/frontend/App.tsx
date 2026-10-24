import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Home, MessageCircle, Calendar, Music, AlertCircle } from 'lucide-react-native';

import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import CycleScreen from './src/screens/CycleScreen';
import MusicScreen from './src/screens/MusicScreen';
import SosScreen from './src/screens/SosScreen';

export default function App() {
  const [session, setSession] = useState<{ userId: string; coupleId: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'cycle' | 'music' | 'sos'>('home');

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
      
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>Mpenzi-Wangu 💕</Text>
          <Text style={styles.coupleTag}>Space: {session.coupleId}</Text>
        </View>
        <TouchableOpacity onPress={() => setSession(null)} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Home color={activeTab === 'home' ? '#FF6B8B' : '#A0AEC0'} size={22} />
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('chat')}>
          <MessageCircle color={activeTab === 'chat' ? '#FF6B8B' : '#A0AEC0'} size={22} />
          <Text style={[styles.tabLabel, activeTab === 'chat' && styles.activeTabLabel]}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('cycle')}>
          <Calendar color={activeTab === 'cycle' ? '#FF6B8B' : '#A0AEC0'} size={22} />
          <Text style={[styles.tabLabel, activeTab === 'cycle' && styles.activeTabLabel]}>Mwezi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('music')}>
          <Music color={activeTab === 'music' ? '#FF6B8B' : '#A0AEC0'} size={22} />
          <Text style={[styles.tabLabel, activeTab === 'music' && styles.activeTabLabel]}>Music</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('sos')}>
          <AlertCircle color={activeTab === 'sos' ? '#E53E3E' : '#A0AEC0'} size={22} />
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
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#FFD1DC',
  },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 11, color: '#A0AEC0', marginTop: 4, fontWeight: '600' },
  activeTabLabel: { color: '#FF6B8B', fontWeight: '700' }
});