import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3316mmzeuoqXCo0zh1sHlaaKLsPRAkOA",
  authDomain: "stocksense-bitnbuild.firebaseapp.com",
  projectId: "stocksense-bitnbuild",
  storageBucket: "stocksense-bitnbuild.appspot.com",
  messagingSenderId: "430403147975",
  appId: "1:430403147975:web:5fcc92e9c893cbbc4a06e2",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
