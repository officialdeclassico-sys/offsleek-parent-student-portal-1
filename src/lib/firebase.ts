import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA6zoCd_YOePbKUF0YQc4HHSx68_0dKtXE",
  authDomain: "offsleek-shared-backend.firebaseapp.com",
  projectId: "offsleek-shared-backend",
  storageBucket: "offsleek-shared-backend.firebasestorage.app",
  messagingSenderId: "982793510619",
  appId: "1:982793510619:web:1189cb05dbf1903449b6fe"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
