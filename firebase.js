import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCIk1EYS5WW3FZShHH388amfvkG5-14JsY",
  authDomain: "inventory-management-49571.firebaseapp.com",
  projectId: "inventory-management-49571",
  storageBucket: "inventory-management-49571.appspot.com",
  messagingSenderId: "772822244487",
  appId: "1:772822244487:web:4d64b6e4302d4f7a3cec22",
  measurementId: "G-V47K37TD6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const firestore = getFirestore(app);
