
import { useEffect, useState } from "react";


// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyC62mBBlizNH7H8ryJdKFUQ6BPScZO-9L0",

  authDomain: "grabmedia-eb956.firebaseapp.com",

  projectId: "grabmedia-eb956",

  storageBucket: "grabmedia-eb956.appspot.com",

  messagingSenderId: "490969866376",

  appId: "1:490969866376:web:4de329db9778271b83ff3d",

  measurementId: "G-BYFK9KSKZK"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  login_hint: "use your private Google account",
});

console.log(app);

export function login() {
    return signInWithPopup(auth, provider);
    
}

export function logout() {
  return signOut(auth);
}

// Custom Hook
export function useAuth() {
  const [ currentUser, setCurrentUser ] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])

  return currentUser;
}