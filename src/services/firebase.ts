// Firebase Web SDK configuration (compatível com Expo)
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCoEUVWUPrOFU1fxtkbsG0zBzZekTu_Oc",
  authDomain: "mottu-challenge-mobile.firebaseapp.com",
  projectId: "mottu-challenge-mobile",
  storageBucket: "mottu-challenge-mobile.firebasestorage.app",
  messagingSenderId: "1047199101518",
  appId: "1:1047199101518:web:720eb6c32dd405241b891f"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth with AsyncStorage persistence
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // Se já foi inicializado, usa a instância existente
  auth = getAuth(app);
}

// Export auth instance
export { auth };
export default app;