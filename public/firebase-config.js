// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ✅ Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyArkggkC_DU6hUiCAHebxJkDWRz73yp6Rw",
  authDomain: "ecopoints-75eb7.firebaseapp.com",
  projectId: "ecopoints-75eb7",
  storageBucket: "ecopoints-75eb7.appspot.com",
  messagingSenderId: "595598076769",
  appId: "1:595598076769:web:d0b9ffbe5522216fa9f320"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  db,
  collection,
  addDoc
};
