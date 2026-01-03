import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// SparkOS Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKhyJl15r0jIT2pb3cLcjoCbGdIPoH2Ok",
  authDomain: "spark-antigravity.firebaseapp.com",
  projectId: "spark-antigravity",
  storageBucket: "spark-antigravity.firebasestorage.app",
  messagingSenderId: "997177904978",
  appId: "1:997177904978:web:8d3e8daef1273f5d97348b",
  measurementId: "G-KRFNKBPQG2"
};

// Initialize Firebase (singleton pattern for Next.js)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// Current User ID (Phase 1 - Hardcoded)
export const CURRENT_USER_ID = "C2Gn2dhaYtgDta1rlRQJ5ItqVh83";

// Collection paths
export const COLLECTIONS = {
  personalItems: (userId: string) => `users/${userId}/personalItems`,
  chatHistory: (userId: string) => `users/${userId}/chatHistory`,
  userConfig: "users",
} as const;
