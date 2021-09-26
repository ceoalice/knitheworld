import {getFirestoreService, getAuthService} from "./firebase.js";
import API from "./api.js";

/**
 * @typedef User
 * @prop {String} id - Unique ID of the user.
 * @prop {String} username
 */

class UserAPI extends API {
  constructor(props) {
    super(props);
  }

  /**
   * Gets public info of the user from an input user ID
   * @param {String} id - id of the user
   * 
   * @returns {Promise<import("./api.js").APIResponse<User>>}
   */
  async getUserInfo(id) {

    let fs =  getFirestoreService();

    try {
      let doc = await fs.collection("users").doc(id).get();
      
      if (doc.exists) {
        return { status : 200, data : { id, ...doc.data()} };
      } else {
        return { status : 404, error : 'User Not Found'}
      }
    } catch (error) {
      return { status : 500, error };
    }
  }

  /**
   * Gets the username of the currently authenticated user
   * @returns {Promise<import("./api.js").APIResponse<String>>}
   */
  async getCurrentUsername() {
    let user = getAuthService().currentUser;
    if (user) { 
      let fs = getFirestoreService();
      let doc = await fs.collection("users").doc(user.uid).get();
      if (doc.exists) {
        return { status : 200, data : doc.data().username }; 
      }
    }

    return { status : 404, error : 'User Not Found'};
  }

}

export default new UserAPI();