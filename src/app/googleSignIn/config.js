// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
     


const firebaseConfig = {
  apiKey: "AIzaSyCzbr6Ftt-snLkxgWocd--_304LA8oRjbU",
  authDomain: "budget-app-41b22.firebaseapp.com",
  projectId: "budget-app-41b22",
  storageBucket: "budget-app-41b22.appspot.com",
  messagingSenderId: "399414591682",
  appId: "1:399414591682:web:eca9f3f2edc215fa66fb5b",
  measurementId: "G-L1B4WY7VN5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth,provider};