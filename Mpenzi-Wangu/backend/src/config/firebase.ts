import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';

const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccountPath),
    });
    console.log(' Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.warn(' Service account key missing or invalid. Falling back to default credentials.');
    initializeApp();
  }
}

export const db = getFirestore();
export const auth = getAuth();