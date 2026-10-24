import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Home, MessageCircle, Calendar, Music, AlertCircle, PenTool, Image as ImageIcon, Settings } from 'lucide-react-native';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import CycleScreen from './src/screens/CycleScreen';
import MusicScreen from './src/screens/MusicScreen';
import SosScreen from './src/screens/SosScreen';
import SweetNotesScreen from './src/screens/SweetNotesScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

function MainApp() {
  const { colors } = useTheme();
  const [session, setSession] = useState<{ userId: string; coupleId: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'cycle' | 'sweetNotes' | 'gallery' | 'music' | 'sos' | 'settings'>('home');

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
      case 'settings':
        return <SettingsScreen userId={session.userId} coupleId={session.coupleId} />;
      default:
        return <HomeScreen onNavigate={(screen: any) => setActiveTab(screen)} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => setActiveTab('home')}>
          <Text style={[styles.appName, { color: colors.headerText }]}>Mpenzi-Wangu 💕</Text>
          <Text style={[styles.coupleTag, { color: colors.subText }]}>Space: {session.coupleId}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setActiveTab('settings')} style={[styles.gearIconBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Settings color={colors.primary} size={18} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSession(null)} style={[styles.logoutBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.logoutText, { color: colors.headerText }]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* Bottom Navigation */}
      <View style={[styles.tabBar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Home color={activeTab === 'home' ? colors.primary : '#A0AEC0'} size={20} />
          <Text style={[styles.tabLabel, { color: activeTab === 'home' ? colors.primary : '#A0AEC0' }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('chat')}>
          <MessageCircle color={activeTab === 'chat' ? colors.primary : '#A0AEC0'} size={20} />
          <Text style={[styles.tabLabel, { color: activeTab === 'chat' ? colors.primary : '#A0AEC0' }]}>Talk</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('sweetNotes')}>
          <PenTool color={activeTab === 'sweetNotes' ? colors.primary : '#A0AEC0'} size={20} />
          <Text style={[styles.tabLabel, { color: activeTab === 'sweetNotes' ? colors.primary : '#A0AEC0' }]}>Notes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('gallery')}>
          <ImageIcon color={activeTab === 'gallery' ? colors.primary : '#A0AEC0'} size={20} />
          <Text style={[styles.tabLabel, { color: activeTab === 'gallery' ? colors.primary : '#A0AEC0' }]}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('sos')}>
          <AlertCircle color={activeTab === 'sos' ? '#E53E3E' : '#A0AEC0'} size={20} />
          <Text style={[styles.tabLabel, { color: activeTab === 'sos' ? '#E53E3E' : '#A0AEC0' }]}>SOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1 },
  appName: { fontSize: 18, fontWeight: '800' },
  coupleTag: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  gearIconBtn: { padding: 8, borderRadius: 8, borderWidth: 1 },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  logoutText: { fontSize: 12, fontWeight: '700' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8, borderTopWidth: 1 },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 10, marginTop: 2, fontWeight: '600' },
});