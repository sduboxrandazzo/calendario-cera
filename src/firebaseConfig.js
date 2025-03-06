import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC0-2Pt1uwqxXQEEYmObpV_wF5-PsNlMMc",
    authDomain: "calendario-cera.firebaseapp.com",
    projectId: "calendario-cera",
    storageBucket: "calendario-cera.firebasestorage.app",
    messagingSenderId: "981243187775",
    appId: "1:981243187775:web:3dd9761051172cc7869e8a",
    measurementId: "G-5BMYKT54E3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
