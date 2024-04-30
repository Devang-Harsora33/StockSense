import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDECVMGz33weXU52bUU7Tp31Hgrg3Nu3iU",
  authDomain: "devdynasty-bitnbuild.firebaseapp.com",
  projectId: "devdynasty-bitnbuild",
  storageBucket: "devdynasty-bitnbuild.appspot.com",
  messagingSenderId: "666159939154",
  appId: "1:666159939154:web:e847903b3057fa6220a98b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
