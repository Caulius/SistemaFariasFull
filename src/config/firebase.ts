import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKvPIPc04vuO1o7QVwMY6sLKKq5-P275w",
  authDomain: "rotasnew.firebaseapp.com",
  projectId: "rotasnew",
  storageBucket: "rotasnew.firebasestorage.app",
  messagingSenderId: "824712861576",
  appId: "1:824712861576:web:6407a0ebedbcc0e53a0c3d",
  measurementId: "G-SNW2GWRNEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;