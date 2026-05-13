// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuhgzfc3AkB3sqyXInTACYznu1a2mnHh0",
  authDomain: "meal-planner-528e1.firebaseapp.com",
  projectId: "meal-planner-528e1",
  storageBucket: "meal-planner-528e1.firebasestorage.app",
  messagingSenderId: "723876943743",
  appId: "1:723876943743:web:6edc1d8ec5765ac3aa2c4a",
  measurementId: "G-EGL7XHCW4D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);