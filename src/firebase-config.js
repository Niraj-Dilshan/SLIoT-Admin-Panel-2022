import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: `"${process.env.REACT_APP_API_KEY}"`,
    authDomain: "electro4-6bf4a.firebaseapp.com",
    projectId: "electro4-6bf4a",
    storageBucket: "electro4-6bf4a.appspot.com",
    messagingSenderId: "264541694722",
    appId: "1:264541694722:web:d469f224ff63c18cd5701b",
    measurementId: "G-0YTLPZX65T"
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);