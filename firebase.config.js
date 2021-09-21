const config = {
  apiKey: "AIzaSyBT_Bpt9X85tY2Qi76nl7VH9oOWWg8rdmM",
  authDomain: "knitheworld-bb33d.firebaseapp.com",
  projectId: "knitheworld-bb33d",
  storageBucket: "knitheworld-bb33d.appspot.com",
  messagingSenderId: "737704448227",
  appId: "1:737704448227:web:3880d5ef324e9e8ebeb5d6",
  measurementId: "G-TBCBQ1X109"
};


if (process.env.NODE_ENV === 'development') {
  console.log(
    "%cdevelopment mode using debug token",
    'color: purple; font-size: 16px; -webkit-text-stroke: 1px purple; font-weight:bold'
  );
  // setting debug token.
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.APPCHECK_DEBUG_TOKEN
}

export default config;