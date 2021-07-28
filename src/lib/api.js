import FirebaseCache from "./firebase-cache.js";

/**
 * @template T
 * @typedef {{
 *  status : Number,
 *  data? : T,
 *  message? : String,
 *  error? : Object
 * }} APIResponse
 */


/**
 * @constructor
 */
class API {
  constructor() {
    this.cache_ = FirebaseCache;
  }

  setVM (vm) {
    this.vm = vm;
  }

  getUserID() {
    return this.cache_.getUserID(); // localStorage.getItem(USER_ID);
  }

  getCurrentID() {
    return this.cache_.getCurrentProjectID(); // localStorage.getItem(CURRENT_PROJECT_ID);
  }
}

export default API;