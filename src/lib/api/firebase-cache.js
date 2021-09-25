import firebase, { getFileData } from "./firebase.js";

const LAST_EDITED_PROJECT_ID = "lastEditedProjectID";
const USER_ID = "userID";

/**
 * The point of this cache is to remember data retrieved from Firebase so that repeated 
 * calls on the same webpage for the same data don't need to be made and we can
 * minimize the amount of calls we're making to the Firebase firestore, cloud storage,
 * and cloud functions.
 * 
 * Refreshing the webpage doesn't, and shouldn't, preserve cached data
 */
class FirebaseCache {
  constructor () {
    
    this.sampleProjects = {}; //  object maping project ID to sample project XML
    this.projects = {}; // object maping project ID to project XML
    this.creators = new Set(); // set containing IDs of users whose projects have already been pulled.

    this.sampleImages = {}; //  object mapping project ID to sample project image URL
    this.images = {}; // object mapping project ID to project image URL

    this.usernames = {} // object mapping username with bool determining if it's available to use
    this.emails = {} // object mapping email with bool determining if it's available to use

    this.suggestions = {} // object mapping blockType to list of suggestions for next blockType

    // sample projects need to be loaded just once and stored in cache
    // only need to load sample projects when in the GUI page
    if (window.location.pathname == "/gui") {
      this.loadSampleProjects();
      // console.log({WINDOW_PATH : window.location.pathname})
    }
  }

  /* ---------------------- INTERACTIONS WITH LOCALSTORAGE ---------------------- */
  // window.localStorage stores ID of the current signed in user and the most recent project edited
  // (firestore re-affirms auth so IDs can be stored locally and only signed in users can alter their docs)
  // userID -> localStorage.getItem(USER_ID)
  // projectID -> localStorage.getItem(LAST_EDITED_PROJECT_ID)
  
  cacheUserID(userID) {
    localStorage.setItem(USER_ID, userID);
  }
  cacheLastEditedProjectID(projectID) {
    localStorage.setItem(LAST_EDITED_PROJECT_ID, projectID);
  }

  clearLocalStore() {
    this.clearUserID();
    this.clearLastEditedProjectID();
  }
  
  clearLastEditedProjectID() {
    localStorage.removeItem(LAST_EDITED_PROJECT_ID);
  }
  clearUserID() {
    localStorage.removeItem(USER_ID);
  }

  getLastEditedProjectID() {
    return localStorage.getItem(LAST_EDITED_PROJECT_ID);
  }
  getUserID() {
    return localStorage.getItem(USER_ID);
  }
  
  
  /* ---------------------- SAMPLE PROJECTS CACHING ---------------------- 
  * Sample projects only ever used in GUI page in the sample projects modal. 
  * Only need to pull their data from cloud storage once and store it in cache
  */

  getSampleProjects() {
    return Object.values(this.sampleProjects).sort((a,b) => a.xml.length - b.xml.length);
  }
  getSampleImage(id) {
    return this.sampleImages[id];
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


  /* ---------------------- CACHE METHODS FOR PROJECT-API ---------------------- 
  * Stores project data as objects in cache so you don't need to repeat 
  * requests to firebase firestore. We also catch visited users in cache, so we don't 
  * have to repeatedly pull their projects from firestore.
  * 
  * The indicating factor is projectID because every project has one unique ID.
  * Each project also has a creator field that indicates a specific user.
  */

  /**
   * Determines whether cache already has projects from this creator cached
   * @param {String} id - ID of specific user 
   * @returns {Boolean}
   */
  hasCreatorProjects(id) {
    return this.creators.has(id);
  }

  /**
   * Determines whether cache already has project
   * @param {String} id - ID of specific project 
   * @returns {Boolean}
   */
  hasProject(id) {
    return this.projects.hasOwnProperty(id);
  }

  /**
   * Gets cached projects by specified project ID
   * @param {String} id - ID of the project
   * @returns {import("./project-api").Project}
   */
  getProject(id) {
    return this.projects[id];
  }

  /**
   * Gets cached projects by specified creator ID
   * @param {String} userID - ID of the creator of the project
   * @returns {import("./project-api").Project[]}
   */
  getProjects(userID) {
    // console.log("GETTING PROJECTS FROM CACHE");

    let out = [];

    for (const project of Object.values(this.projects)) {
      if (project.creator == userID) {
        out.push(project);
      }
    }

    out.sort((a,b) => (b.timestamp.seconds - a.timestamp.seconds)); // provide same sort as firebase
    return out;
  }

  cacheProject(id, args) {
    if (!this.projects[id]) this.projects[id] = { id };
    this.projects[id] = { ...this.projects[id], ...args };
  }

  cacheProjectCreator(id) {
    // console.log("CACHING CREATOR");
    this.creators.add(id);
  }


  /**
   * Removes a specified 
   * @param {String} id 
   */
  deleteProject(id) {
    delete this.projects[id];
  }

  /* ---------------------- CACHE METHODS FOR IMAGE-API ---------------------- 
  * Stores image data (base64 or download URL) in cache so you don't need to repeat 
  * requests to firebase cloud storage.
  * 
  * The indicating factor is projectID because every project only has one unique image URL.
  */
  
  /**
   * @returns {Boolean} whether imageURL for project is already in cache
   */
  hasImage(id) {
    return this.images.hasOwnProperty(id);
  }

  /**
   * @returns {String} imageURL for specified project
   */
  getImage(id) {
    return this.images[id];
  }

  /**
   * Stores image data (base64 or download URL) in cache under given project ID
   * @param {String} id 
   * @param {String} imgData 
   */
  cacheImage(id,imgData) {
    this.images[id] = imgData;
  }

  /**
   * Removes imageURL for specified project from cache 
   * @param {String} id 
   */
  deleteImage(id) {
    delete this.images[id];
  }  
  
  /* ---------------------- CACHE METHODS FOR AUTH-API ---------------------- */

  /**
   * Check if username validity value in cache
   * @param {String} username 
   * @returns {Boolean}
   */
  hasUsername(username) { // check if username value in cache
    return this.usernames.hasOwnProperty(username);
  }

  /**
   * Check if email validity value in cache
   * @param {String} email 
   * @returns {Boolean}
   */
  hasEmail(email) {
    return this.emails.hasOwnProperty(email);
  }

  /**
   * Get the stored validity of a given email
   * @param {String} email 
   * @returns {Boolean}
   */
  getEmailValidity(email) { // true value if email in use, false otherwise
    return this.emails[email];
  }

  /**
   * Get the stored validity of a given username
   * @param {String} username 
   * @returns {Boolean}
   */
  getUsernameValidity(username) { // true value if username taken, false otherwise
    return this.usernames[username];
  }

  /**
   * Stores validity of username in cache
   * @param {String} username 
   * @param {Boolean} val - the validity  
   */
  cacheUsernameValidity(username,val) {
    this.usernames[username] = val;
  }

  /**
   * Stores validity of email in cache
   * @param {String} email 
   * @param {Boolean} val - the validity  
   */
  cacheEmailValidity(email,val) {
    this.emails[email] = val;
  }

  /* ---------------------- CACHE METHODS FOR USER-API ---------------------- */


  /* ---------------------- CACHE METHODS FOR SUGGEST-API ---------------------- 
  * Stores suggestions in cache so you don't need to repeat request to firebase functions.
  * The indicating factor is block type because you'll always get the same suggestions for a single blocktype.
  * 
  * PS: If we choose to expand suggestions (make it take last two block types or something),
  * then the caching methods will need to be updated, with a new indicating factor
  */

  /**
   * check if suggestions for a given blockType are in cache
   * @param {String} blockType 
   * @returns {Boolean}
   */
  hasSuggestion(blockType) {
    return this.suggestions.hasOwnProperty(blockType);
  }

  /**
   * Gets cached suggestions based on given blockType
   * 
   * @returns {String[]} list of suggested block types based on input block type 
   */
  getSuggestion(blockType) {
    return this.suggestions[blockType];
  }

  /**
   * Stores suggestions in cache under given block type
   * @param {String} blockType 
   * @param {String[]} suggestions 
   */
  cacheSuggestion(blockType, suggestions) {
    this.suggestions[blockType] = suggestions;
  }

}

export default new FirebaseCache();