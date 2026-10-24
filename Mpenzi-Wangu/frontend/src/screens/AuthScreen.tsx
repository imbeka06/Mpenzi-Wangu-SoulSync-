import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function AuthScreen({ onLoginSuccess }: { onLoginSuccess: (userId: string, coupleId: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [coupleId, setCoupleId] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || !coupleId) {
      Alert.alert('Error', 'Please fill in all fields including your couple code');
      return;
    }

    try {
      const cleanCoupleId = coupleId.trim().toLowerCase();
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          coupleId: cleanCoupleId,
          createdAt: new Date(),
        });

        onLoginSuccess(user.uid, cleanCoupleId);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onLoginSuccess(userCredential.user.uid, cleanCoupleId);
      }
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Mpenzi-Wangu 💕</Text>
        <Text style={styles.subtitle}>{isSignUp ? 'Create your shared couple space' : 'Welcome back, my love'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Shared Couple Code (e.g., us2026)"
          placeholderTextColor="#A0AEC0"
          value={coupleId}
          onChangeText={setCoupleId}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#A0AEC0"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#A0AEC0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>{isSignUp ? 'Create Space' : 'Log In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 20 }}>
          <Text style={styles.switchText}>
            {isSignUp ? 'Already linked? Log In' : "Don't have a space yet? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#FFD1DC', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 30, fontWeight: '800', color: '#D81B60', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#718096', textAlign: 'center', marginBottom: 25, marginTop: 5 },
  input: { backgroundColor: '#FFF5F7', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, color: '#2D3748', borderColor: '#FFD1DC', fontSize: 15 },
  button: { backgroundColor: '#FF6B8B', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  switchText: { color: '#D81B60', textAlign: 'center', fontSize: 14, fontWeight: '600' }
});