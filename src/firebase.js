import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0uEWn1inp4gPo5ckDhMnNvOQwc1IApH4",
  authDomain: "kpproject-a09a1.firebaseapp.com",
  projectId: "kpproject-a09a1",
  storageBucket: "kpproject-a09a1.firebasestorage.app",
  messagingSenderId: "996927320171",
  appId: "1:996927320171:web:75d349ba3e746951a4c12e",
  measurementId: "G-41VL57GBD4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);