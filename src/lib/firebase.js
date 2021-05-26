import firebase from "firebase";
import firebaseConfig from  "../../firebase.config.js";

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;