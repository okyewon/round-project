import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMwmphYBS0gYdO74jrP4jg6y-tXxrSMDg",
  authDomain: "round-project-ad129.firebaseapp.com",
  projectId: "round-project-ad129",
  storageBucket: "round-project-ad129.appspot.com",
  messagingSenderId: "767634510407",
  appId: "1:767634510407:web:2fb02824dac687ed4c9762",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
