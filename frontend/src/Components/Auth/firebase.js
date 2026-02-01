import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC68offk-OaKD-ThxDW2VSP5Xuh1JJjH1E",
  authDomain: "ecommerce-website-292a0.firebaseapp.com",
  projectId: "ecommerce-website-292a0",
  storageBucket: "ecommerce-website-292a0.firebasestorage.app",
  messagingSenderId: "139825721394",
  appId: "1:139825721394:web:d59814336a59f8f8220c2b",
  measurementId: "G-Q00R4H14XH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// ✅ Google Sign-in (returns ID token)
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // 🔑 Google ID token (IMPORTANT)
  const token = await user.getIdToken();

  return { user, token };
};
