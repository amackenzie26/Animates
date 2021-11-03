// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

require('dotenv').config();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "animates-0213.firebaseapp.com",
  projectId: "animates-0213",
  storageBucket: "animates-0213.appspot.com",
  messagingSenderId: "187740616174",
  appId: "1:187740616174:web:d85c32d772ebf90dd80aff",
  measurementId: "G-BGJ87P1PF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);