import firebase from "./firebase.js";
import API from "./api.js";

class ImageAPI extends API {
  constructor (props) {
    super(props)
  }

  /**
   * Returns the download url of the SAMPLE PROJECT thumbnail. 
   * 
   * @param {String} id - ID of the SAMPLE PROJECT
   * @returns {String} - download url of sample image
   */
  getSampleImage(id) {
    return this.cache_.getSampleImage(id);
  }

  /**
   * Returns the download url of the project thumbnail. 
   * 
   * @param {String} userID - id of the creator of this project
   * @param {String} id - ID of the project
   * @returns {Promise<import("./api.js").APIResponse<String>>}
   */
  async getProjectImageURL(userID,id) {
    if (this.cache_.getImage(id)) return { status : 200, data : this.cache_.getImage(id) };

    let usersRef = firebase.storage().ref('users');
    return usersRef.child(`${userID}/${id}.png`)
      .getDownloadURL()
      .then((url) => {
        this.cache_.updateImage(id, url);
        return { status : 200, data : this.cache_.getImage(id) };
      })
      .catch((error) => {
        console.log("could not find: ",`${userID}/${id}.png`);
        return { status : 404, error };
      });
  }

  /**
   * Returns an XMLHttpRequest to the cloud storage and gets file data as a Blob. 
   * @param {String} url - image URL 
   * @returns {Promise<import("./api.js").APIResponse<Blob>>} image data as Blob , can now be saved to files locally
   */
    async getProjectImageData(url) {
      return new Promise((response,reject) => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = () => {
          response({ status : 200, data : xhr.response });
        };
        try {
          xhr.open('GET', url);
          xhr.send();
        } catch {
          reject({ status : 500 , error : "idk what happened" });
        }
      });
    }

  /**
   * Saves input image data as thumbnail for project in cloud bucket file:
   * -  users/{userID}/{projectID}.png
   * -  users/{userID}/{projectID}200x200.png -> reduced size
   * MUST BE SIGNED IN TO SAVE PROJECT (userID required)
   * @param {String} id - ID of the project
   * @param {String} imgData - image represented as base64 data url
   * @returns {Promise<import("./api.js").APIResponse<String>>} - url of the new saved image.
   */
  async saveProjectImage(id, imgData) {
    let usersRef = firebase.storage().ref('users');

    return usersRef.child(`${this.getUserID()}/${id}.png`)
      .putString(imgData, 'data_url')
      .then(async snapshot => {
        this.cache_.updateImage(id, await snapshot.ref.getDownloadURL());
        console.log("Saved Image");
        return {status : 200, message : "Saved Image", data : this.cache_.getImage(id)};
      })
      .catch( error => {
        return { status : 500 , error };
      });
  }

  /**
   * Deletes the thumbnail of the specified project. 
   * Call this method after project has successfully been deleted through ProjectAPI
   * @param {String} id - ID of the project
   */
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

export default new ImageAPI();