import FirebaseCache from "./firebase-cache.js";

class API {
  constructor() {
    this.cache_ = FirebaseCache;
  }

  setVM(vm) {
    this.vm = vm;
  }

  getUserID() {
    return this.cache_.getUserID(); // localStorage.getItem(USER_ID);
  }

  getCurrentID() {
    return this.cache_.getCurrentProjectID(); // localStorage.getItem(CURRENT_PROJECT_ID);
  }
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
/**
  * @typedef StatusCodes
  * @property {200} OK "Request went through successfully"
  * @property {201} Created "Resource created"
  * @property {202} Accepted "The request has been received but not yet acted upon"
  * 
  * @property {400} Bad Request The server could not understand the request due to invalid syntax
  * @property {401} Unauthorized Although the HTTP standard specifies "unauthorized"
  * @property {403} Forbidden The client does not have access rights to the content
  * @property {404} NotFound "Resource not found"
  * 
  * @property {500} Internal Server Error
  */

/**
 * @template T
 * @typedef APIResponse
 * @type {object}
 * 
 * @property {StatusCodes} status - HTTP status code for request response.
 * @property {T} [data] - Returned data.
 * @property {String} [message] - Returned message.
 * @property {Object} [error] - Returned error.
 */

/**TODO: instead of returning objects maybe return this class object with helper methods? */ 
class APIResponse extends Object {
  constructor() {}
}

export default API;