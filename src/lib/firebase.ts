import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKZRjSFHtQF8Ae65YmYYwRNy_18iSFqVE",
  authDomain: "tibiapartymaker.firebaseapp.com",
  projectId: "tibiapartymaker",
  storageBucket: "tibiapartymaker.appspot.com",
  messagingSenderId: "1080460884056",
  appId: "1:1080460884056:web:f7bbce36fd2bcf01ac322d"
};

console.log('Inicializando Firebase com config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

console.log('Firebase inicializado com sucesso');
