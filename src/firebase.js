/*
  const firebaseConfig = {
  apiKey: "AIzaSyAk-oFYWFkMH9JTDpxBvgEH6S8yr4Srtc0",
  authDomain: "lipukejarj.firebaseapp.com",
  databaseURL: "https://lipukejarj-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lipukejarj",
  storageBucket: "lipukejarj.firebasestorage.app",
  messagingSenderId: "969452347185",
  appId: "1:969452347185:web:577bd8fb6df40f6aa3da10"
  };
*/
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

export function initFirebase(){
  // käyttäjä lisää oman configin täällä
  const firebaseConfig = {
    // TODO: täytä
  };
  if (!firebaseConfig.apiKey) return console.warn("Firebase-konfiguraatio ei täytetty src/firebase.js tiedostoon.");
  initializeApp(firebaseConfig);
}

export function getDB(){
  return getDatabase();
}
