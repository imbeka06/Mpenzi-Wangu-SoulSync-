import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCGSUwZpKCRPdmcrwm8gYK0n3fSphsS7TM",
  authDomain: "mpenzi-wangu.firebaseapp.com",
  projectId: "mpenzi-wangu",
  storageBucket: "mpenzi-wangu.firebasestorage.app",
  messagingSenderId: "501946343426",
  appId: "1:501946343426:web:c4faf5ad6d5f1c49fdc71b",
  measurementId: "G-WM7MQVJERX"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);