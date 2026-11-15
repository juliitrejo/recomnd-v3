import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TUS_DATOS_REALES_DE_FIREBASE",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu_sender_id",
  appId: "tu_app_id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);