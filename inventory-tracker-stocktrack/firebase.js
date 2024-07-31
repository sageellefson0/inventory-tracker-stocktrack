// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// import env from "dotenv";
// env.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwnsiLqfZ43KsT8XnMIMMlvNatGYgC1gw",
  authDomain: "hsinventory-tracker-stocktrack.firebaseapp.com",
  projectId: "hsinventory-tracker-stocktrack",
  storageBucket: "hsinventory-tracker-stocktrack.appspot.com",
  messagingSenderId: "239262681811",
  appId: "1:239262681811:web:2df29709b3261b424a6226",
  measurementId: "G-8PQ628VD0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export{app, firestore};


