import firebase from "./firebase.js";
import FirebaseCache from "./firebase-cache.js";

const CURRENT_PROJECT_ID = "currentID";
const USER_ID = "userID";

class ImageManager {
  constructor () {
    this.cache_ = FirebaseCache;
  }

  setVM (vm) {
    this.vm = vm;
  }

  getCurrentID() {
    return localStorage.getItem(CURRENT_PROJECT_ID);
  }

  getUserID() {
    return localStorage.getItem(USER_ID);
  }

  async saveProjectImage(id, imgData) {
    let usersRef = firebase.storage().ref('users');

    usersRef.child(`${this.getUserID()}/${id}.png`).putString(imgData, 'data_url').then(async snapshot => {
      this.cache_.updateImage(id, await snapshot.ref.getDownloadURL());
      console.log("Saved Image");
    });
  }

  /**
   * 
   * @param {string} url 
   * @returns {Blob} downloadable image data as Blob
   */
  async getProjectImageData(url) {
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

  getSampleImage(id) {
    return this.cache_.getSampleImage(id);
  }

  async getProjectImageURL(id) {
    if (this.cache_.getImage(id)) return this.cache_.getImage(id);

    let usersRef = firebase.storage().ref('users');
    let url = await usersRef.child(`${this.getUserID()}/${id}.png`)
      .getDownloadURL()
      .catch((err) => {
        console.log("could not find: ",`${this.getUserID()}/${id}.png`);
        return 'Image Not Found';
      });

    this.cache_.updateImage(id, url);

    return url;
  }

  async deleteProjectImage(id) {
    let usersRef = firebase.storage().ref('users');

    let file = usersRef.child(`${this.getUserID()}/${id}.png`);

    file.delete().then(() => {
      console.log("Deleted Image");
    }).catch(() => {
      console.log("Could Not Delete Image");
    });
  }

}

export default new ImageManager();