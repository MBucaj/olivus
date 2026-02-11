import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMlJ8LTQx8hlXetHR9Smr7l4dKOa5FkBQ",
  authDomain: "olivus-b12f2.firebaseapp.com",
  projectId: "olivus-b12f2",
  storageBucket: "olivus-b12f2.firebasestorage.app",
  messagingSenderId: "606180130264",
  appId: "1:606180130264:web:d5cffc71532d3c693146ad",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
