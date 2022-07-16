// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4KUV4OuUcyOp2f6y9_Vav3XMldvdjago",
  authDomain: "portfolio-d6fb4.firebaseapp.com",
  projectId: "portfolio-d6fb4",
  storageBucket: "portfolio-d6fb4.appspot.com",
  messagingSenderId: "287255861023",
  appId: "1:287255861023:web:dd374a0cdfa2857c04822a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
