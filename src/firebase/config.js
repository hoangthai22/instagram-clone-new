import firebase from "firebase/compat/app";

import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB9CmoYxOir3ibhZW853uD4Ha6z26HSuN0",
    authDomain: "social-app-831ac.firebaseapp.com",
    projectId: "social-app-831ac",
    storageBucket: "social-app-831ac.appspot.com",
    messagingSenderId: "900774465985",
    appId: "1:900774465985:web:e973661eb913b923509f40",
    measurementId: "G-KRQTEQHNTY",
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
// auth.useEmulator("http://localhost:9099");

// if (window.location.hostname === "localhost") {
//   db.useEmulator("localhost", "8080");
//   storage.useEmulator("localhost", "9199");
// }

export { db, auth, storage };
export default firebase;
