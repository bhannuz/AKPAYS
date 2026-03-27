// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCu64AbkC34K_vARrTib28sUdeqKULmeGY",
  authDomain: "akpays-68eb9.firebaseapp.com",
  projectId: "akpays-68eb9",
  storageBucket: "akpays-68eb9.firebasestorage.app",
  messagingSenderId: "728154393366",
  appId: "1:728154393366:web:1695cca59af6a390e49e37",
  measurementId: "G-561EKHKLCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
