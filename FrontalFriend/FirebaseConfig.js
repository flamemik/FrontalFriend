// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATgXksZqOR6cedLz5mNPafiAWXnggg-pQ",
  authDomain: "frontalfriend.firebaseapp.com",
  projectId: "frontalfriend",
  storageBucket: "frontalfriend.firebasestorage.app",
  messagingSenderId: "875972030693",
  appId: "1:875972030693:web:cd5540a5365bf3e3a0a40c"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// export const FIRESTORE_DB = getFirestore(FIREBASE_APP);