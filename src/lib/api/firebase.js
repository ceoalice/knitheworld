import config from  "../../../firebase.config.js";
import { emulators } from  "../../../firebase.json";

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

/**
 * @type {Boolean}
 */
const USE_EMULATOR = function() {
  try {
    return JSON.parse(process.env.USE_EMULATOR)
  } catch {
    return false;
  }
}();

const IS_PRODUCTION = process.env.NODE_ENV != "development";

/**
 * @returns {firebase.firestore.Firestore | firebase.functions.Functions | firebase.auth.Auth | firebase.storage.Storage}
 */
function getService(serviceName) {
  let service = firebase[serviceName]();
  if (USE_EMULATOR && !IS_PRODUCTION) {
    try {
      console.log("USING EMULATOR SERVICE: ", serviceName);
      if (serviceName == 'auth') {
        service.useEmulator( `http://localhost:${emulators[serviceName].port}`);
      } else {
        service.useEmulator('localhost', emulators[serviceName].port );
      }
    } catch (err) {  
      console.log(err);
     }
  }
  return service;
}

/**
 * @returns {firebase.firestore.Firestore}
 */
const getFirestoreService = () => getService('firestore');
/**
 * @returns {firebase.storage.Storage}
 */
const getStorageService = () => getService('storage');
 /**
 * @returns {firebase.functions.Functions}
 */
const getFunctionsService = () => getService('functions');
/**
 * @returns {firebase.auth.Auth}
 */
const getAuthService = () => getService('auth');

console.log({USE_EMULATOR, IS_PRODUCTION});

export {
  firebase as default, 
  getFileData,
  
  getFirestoreService,
  getStorageService,
  getFunctionsService,
  getAuthService
};