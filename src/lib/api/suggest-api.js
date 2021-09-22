import firebase from "./firebase";
import API from "./api.js";

class SuggestAPI extends API {
  constructor(props) {
    super(props);
  }

  /**
   * 
   * @param {String} block 
   * @param {String} uid 
   * @returns 
   */
  async suggest(block, uid) {
    if (!this.cache_.hasSuggestion(block)) {
      const suggestNext = firebase.functions().httpsCallable('suggestNext');
      let res = await suggestNext({block, uid});
      this.cache_.cacheSuggestion(block, res.data)
    }

    return { status : 200 , data : this.cache_.getSuggestion(block) };
  }
}

export default new SuggestAPI();