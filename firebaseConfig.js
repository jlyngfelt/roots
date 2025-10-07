import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6SCHQ-4fUscJS8-UWMJdngtqFQtsJ0zI",
  authDomain: "roots-cd39a.firebaseapp.com",
  projectId: "roots-cd39a",
  storageBucket: "roots-cd39a.firebasestorage.app",
  messagingSenderId: "872631865213",
  appId: "1:872631865213:web:f134fe9fb5cdf2fe4c0614",
  measurementId: "G-YNGG0LDKX4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportera de tjänster du behöver
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;