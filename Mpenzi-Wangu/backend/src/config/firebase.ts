import admin from 'firebase-admin';
import path from 'path';

// Path to your service account key file
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    console.log(' Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.warn(' Service account key missing. Falling back to default credentials.');
    admin.initializeApp();
  }
}

export const db = admin.firestore();
export const auth = admin.auth();