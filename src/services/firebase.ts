// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCoEUVWUPrOFU1fxtkbsG0zBzZekTu_Oc",
  authDomain: "mottu-challenge-mobile.firebaseapp.com",
  projectId: "mottu-challenge-mobile",
  storageBucket: "mottu-challenge-mobile.firebasestorage.app",
  messagingSenderId: "1047199101518",
  appId: "1:1047199101518:web:720eb6c32dd405241b891f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

export default app;