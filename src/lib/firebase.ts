// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "TODO: YOUR API KEY",
  authDomain: "TODO: YOUR AUTH DOMAIN",
  projectId: "TODO: YOUR PROJECT ID",
  storageBucket: "TODO: YOUR STORAGE BUCKET",
  messagingSenderId: "TODO: YOUR MESSAGING SENDER ID",
  appId: "TODO: YOUR APP ID"
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { app, db };
