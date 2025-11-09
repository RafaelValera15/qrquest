// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TEMP: debug env in build
// const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
// console.log(
//   "BUILD ENV CHECK:",
//   import.meta.env.MODE,
//   "API KEY first 5 chars:",
//   apiKey?.slice(0, 5),
//   "length:",
//   apiKey?.length
// );

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// console.log("VITE_FIREBASE_API_KEY in build:", import.meta.env.VITE_FIREBASE_API_KEY);