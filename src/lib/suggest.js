import firebase from "./firebase";

class Suggester {
  constructor() {}

  suggest(block) {

    var suggestNext = firebase.functions().httpsCallable('suggestNext');

    return suggestNext({block});
  }
}

export default new Suggester();