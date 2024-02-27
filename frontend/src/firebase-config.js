// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCNtm7MBEJVS3oozvsMZIK1FNXZg8pSbs",
  authDomain: "chat-window-d445c.firebaseapp.com",
  projectId: "chat-window-d445c",
  storageBucket: "chat-window-d445c.appspot.com",
  messagingSenderId: "825243143590",
  appId: "1:825243143590:web:2874c8e5a1184beef51367",
  measurementId: "G-GYY4EXE8SE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);