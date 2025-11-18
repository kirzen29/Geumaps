// src/firebase.js

// 1. Ensure these two imports are at the very top:
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 2. PASTE YOUR EXACT CONFIGURATION HERE
// Ensure all key/value pairs are present and correct,
// and the surrounding brackets and commas are perfect.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE", 
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE", 
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

// 3. Ensure the app is initialized
const app = initializeApp(firebaseConfig);

// 4. Ensure the Firestore DB is correctly initialized and EXPORTED
// This is the object that MUST be correct, as it is used in App.js.
export const db = getFirestore(app);