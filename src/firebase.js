// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- import Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7o546NGglFSjtUFbKzVdd1T_tXWfGPj8",
  authDomain: "animadex-2f979.firebaseapp.com",
  projectId: "animadex-2f979",
  storageBucket: "animadex-2f979.firebasestorage.app",
  messagingSenderId: "577072322198",
  appId: "1:577072322198:web:4b922cb45a849f13add4b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore and export it
export const db = getFirestore(app);