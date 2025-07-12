// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5Bl4sHm7hMlFnGM8ViNY8iz8h4J_xFtc",
  authDomain: "vokabelbuch-37366.firebaseapp.com",
  projectId: "vokabelbuch-37366",
  storageBucket: "vokabelbuch-37366.firebasestorage.app",
  messagingSenderId: "936087409446",
  appId: "1:936087409446:web:49edf1867b25a171c9e7e7",
  measurementId: "G-WDGBTLCM3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);