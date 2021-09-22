const admin = require('firebase-admin');
const serviceAccount = require("./firebase.service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "knitheworld-bb33d.appspot.com",
});

module.exports = admin;