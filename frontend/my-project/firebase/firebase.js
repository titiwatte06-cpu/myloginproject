import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuJABl8fKmzgg2OJksNxJFtPobdqHbkgU",
  authDomain: "loginproject-ff986.firebaseapp.com",
  projectId: "loginproject-ff986",
  storageBucket: "loginproject-ff986.firebasestorage.app",
  messagingSenderId: "649725741742",
  appId: "1:649725741742:web:6bbb59d98f815dbcc7fb3f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();