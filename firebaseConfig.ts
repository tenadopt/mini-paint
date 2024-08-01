import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAAJvrhLleIYSXsiVDysFPD0ygbfAN5UmI",
    authDomain: "mini-paint-65d68.firebaseapp.com",
    databaseURL: "https://mini-paint-65d68-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mini-paint-65d68",
    storageBucket: "mini-paint-65d68.appspot.com",
    messagingSenderId: "783787819883",
    appId: "1:783787819883:web:efc9d8ea8db0ea95f9822e",
    measurementId: "G-15H4T82GHF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
