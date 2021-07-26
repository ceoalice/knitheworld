import firebase, { getFileData } from "./firebase.js";

const CURRENT_PROJECT_ID = "currentProjectID";
const USER_ID = "userID";

class FirebaseCache {
  constructor () {
    // if needUpdate is true, firebase must be called to pull data (used for getProjects only)
    this.needUpdate =  true; 

    // ID of the current signed in user and the most recent project being edited
    // (firestore re-affirms auth so IDs can be stored locally and only signed in users can alter their docs)
    // USER_ID = localStorage.getItem(USER_ID);
    // CURRENT_PROJECT_ID = localStorage.getItem(CURRENT_PROJECT_ID);

    this.sampleProjects = {}; //  object maping project ID to sample project
    this.projects = {}; // object maping project ID to project

    this.sampleImages = {}; //  object mapping project ID to sample project image URL
    this.images = {}; // object mapping project ID to project image URL

    this.usernames = {} // object mapping username with bool determining if it already available to use
    this.emails = {} // object mapping email with bool determining if it already is in use

    this.suggestions = {} // object mapping project configuration to list of suggestions 

    // sample projects need to be loaded just once and stored in cache
    this.loadSampleProjects();
  }

  cacheUserID(userID) {
    localStorage.setItem(USER_ID, userID);
  }
  cacheCurrentProjectID(projectID) {
    localStorage.setItem(CURRENT_PROJECT_ID, projectID);
  }

  clearLocalStore() {
    this.clearUserID();
    this.clearCurrentProjectID();
  }
  clearCurrentProjectID() {
    localStorage.removeItem(CURRENT_PROJECT_ID);
  }
  clearUserID() {
    localStorage.removeItem(USER_ID);
  }
  clearProjectCache() {
    this.projects = {};
    this.needUpdate =  true;
  }

  async loadSampleProjects() {
    let projects = await firebase.storage().ref("sample_projects").listAll();

    projects.prefixes.forEach( async (folderRef, id) => {   
      let thumbnailRef = folderRef.child("thumbnail.png");
      let xmlRef = folderRef.child("index.xml");

      this.sampleImages[id] = await thumbnailRef.getDownloadURL();
      let xmlBlob = await getFileData(await xmlRef.getDownloadURL());

      this.sampleProjects[id] = {
        name : folderRef.name,
        xml : await xmlBlob.text(),
        id
      }
    });
  }

  getCurrentProjectID() {
    return localStorage.getItem(CURRENT_PROJECT_ID);
  }
  getUserID() {
    return localStorage.getItem(USER_ID);
  }
  
  getSampleProjects() {
    return Object.values(this.sampleProjects).sort((a,b) => a.xml.length - b.xml.length);
  }
  getSampleImage(id) {
    return this.sampleImages[id];
  }

  getProjects() {
    let out = Object.values(this.projects);
    out.sort((a,b) => (b.timestamp.seconds - a.timestamp.seconds)); // provide same sort as firebase
    return out;
  }

  getProject(id) {
    return this.projects[id];
  }
  getImage(id) {
    return this.images[id];
  }


  getUsernameValidity(username) { // true value if username taken, false otherwise
    return this.usernames[username];
  }
  hasUsername(username) { // check if username value in cache
    return this.usernames.hasOwnProperty(username);
  }

  getEmailValidity(email) { // true value if email in use, false otherwise
    return this.emails[email];
  }
  hasEmail(email) {
    this.emails.hasOwnProperty(email);
  }

  updateProject(id, args) {
    if (!this.projects[id]) this.projects[id] = { id };
    this.projects[id] = { ...this.projects[id], ...args };
  }
  updateImage(id,imgData) {
    this.images[id] = imgData;
  }
  updateUsernameValidity(username,val) {
    this.usernames[username] = val;
  }
  updateEmailValidity(email,val) {
    this.emails[email] = val;
  }

  deleteProject(id) {
    delete this.projects[id];
  }
  deleteImage(id) {
    delete this.images[id];
  }  
}



export default new FirebaseCache();