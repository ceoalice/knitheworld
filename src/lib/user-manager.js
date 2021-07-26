import { omit } from "lodash";
import firebase from "./firebase.js";
import FirebaseCache from "./firebase-cache.js";
import emailValidator from 'email-validator';

class UserManager {
  constructor() {
    this.cache_ = FirebaseCache;

    this.onAuthStateChanged(user => {
      if (user) {
        if (user.uid != this.cache_.getUserID()) {
          this.cache_.clearLocalStore();
          this.cache_.cacheUserID(user.uid);
        }
      } else {
        this.cache_.clearLocalStore();
        this.cache_.clearProjectCache();
      }
    });
  }
  
  setVM (vm) {
    this.vm = vm;
  }

  /**
   * adds listener whenever the auth state is changed in google auth
   * @param {Function} callback 
   */
  onAuthStateChanged(callback) {
    firebase.auth().onAuthStateChanged(callback);
  }

  async createUser(formData) {
    // formData: {
    //     'username': formData.username,
    //     'email': formData.email,
    //     'password': formData.password,
    //     'passwordConfirm': formData.passwordConfirm
    //     'birth_month': formData.birth_month,
    //     'birth_year': formData.birth_year,
    //     'gender': formData.gender,
    //     'country': formData.country,
    // }
    let auth = firebase.auth();
    let firestore = firebase.firestore();

    // console.log(formData);
    return auth
      .createUserWithEmailAndPassword(formData.email, formData.password)
      .then(userCredential => {
        let user = userCredential.user;
        console.log("User created with ID: ", user.uid);
        return firestore
        .collection("users")
        .doc(user.uid)
        .set(omit(formData,["email","password","passwordConfirm"]))
        .then(() => {
          console.log("User written in firestore with ID: ", user.uid);
          return {isSuccess : true};
        })
        .catch((error) => {
          // something went wrong
          // delete user since info wasn't added to firestore
          user.delete(); 
          console.log(error);
          return {isSuccess : false, ...error};
        })
      })
      .catch((error) => {
        // "auth/email-already-in-use"
        // "auth/weak-password"
        console.log(error);
        return {isSuccess : false, ...error};
      });
  }

  async signInUser(formData) {
    // formData: {
    //     'identifier': formData.identifier,
    //     'password': formData.password,
    //     'rememberMe': formData.rememberMe
    // }
    let identifier;
    
    if (emailValidator.validate(formData.identifier))  {
      identifier = formData.identifier;
    } else {
      var getEmailByUsername = firebase.functions().httpsCallable('getEmailByUsername');
      let result = await getEmailByUsername({username: formData.identifier})
      identifier = result.data;
    }

    return firebase
      .auth()
      .setPersistence(
        formData.rememberMe 
        ? firebase.auth.Auth.Persistence.LOCAL 
        : firebase.auth.Auth.Persistence.SESSION
      )
      .then(() => {
        return firebase.auth().signInWithEmailAndPassword(identifier, formData.password);
      })
      .then((userCredential) => {
        // Signed in 
        // console.log("User signed in with ID: ", userCredential.user.uid);
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  async signOut() {
    await firebase.auth().signOut();
  }

  isSignedIn() {
    return Boolean(firebase.auth().currentUser);
  }

  async getUsername() {
    let user = firebase.auth().currentUser;
    if (user) { 
      let fs =  firebase.firestore();
      let doc = await fs.collection("users").doc(user.uid).get();
      if (doc.exists) {
        return doc.data().username;
      }
    }

    return;
  }

  async validateEmailRemotely(email) {
    if (this.cache_.hasEmail(email)) {
      return this.cache_.getEmailValidity(email)
    } else {
      let methods = await firebase.auth().fetchSignInMethodsForEmail(email);
      if (methods.length) {
        this.cache_.updateEmailValidity(email, false); 
      } else {
        this.cache_.updateEmailValidity(email, true); 
      }
    }

    return this.cache_.getEmailValidity(email);
  }

  async validateUsernameRemotely(username) { // false => taken, true => available
    if (this.cache_.hasUsername(username)) {
      return this.cache_.getUsernameValidity(username)
    } else {
      // check firestore and stuff
      let fs = firebase.firestore();
      let query = fs.collection('usernames').doc(username);
      let results = await query.get();
      
      if (results.exists) {
        this.cache_.updateUsernameValidity(username, false);   
      } else {
        this.cache_.updateUsernameValidity(username, true); // username available 
      }
      return  this.cache_.getUsernameValidity(username); 
    }
  }
}

export default new UserManager();