import config from  "../../firebase.config.js";

// import necessary firebase components
import firebase from "firebase/app";
import 'firebase/app-check';
import "firebase/firestore";
import "firebase/functions";
import "firebase/analytics";
import "firebase/storage";
import "firebase/auth";

const publicKey = '6Lf-AR8bAAAAALgg1sPIDcdi3oGgAp5Qhn7nB-9l';

firebase.initializeApp(config);
firebase.analytics();
firebase.appCheck().activate(publicKey);

/**
 * Get files from Firebase Cloud Storage using XMLHttpRequest
 * and returns a Blob of file data.
 * @param {string} download URL given from getDownloadURL() 
 * @returns {Promise<Blob>} file raw data as Blob
 */
function getFileData(url) {
  return new Promise((res,rej) => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
      res(xhr.response);
    };
    try {
      xhr.open('GET', url);
      xhr.send();
    } catch {
      rej("idk what happened");
    }
  });
}

export {
  firebase as default, 
  getFileData
};