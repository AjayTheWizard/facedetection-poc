// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4Meo5E1A6TFN9TgAdfCWIsixWl3SaAgU",
  authDomain: "face-detector-poc.firebaseapp.com",
  projectId: "face-detector-poc",
  storageBucket: "face-detector-poc.appspot.com",
  messagingSenderId: "177477683898",
  appId: "1:177477683898:web:ffff5caf0c4dee42535083",
  measurementId: "G-BCF6PSRGYP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);