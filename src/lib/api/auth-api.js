import { omit } from "lodash";
import emailValidator from 'email-validator';

import firebase, {
  getAuthService, 
  getFirestoreService, 
  getFunctionsService
} from "./firebase.js";

import API from "./api.js";

const responseErrorMsgs = {
  username: {
      'username exists': {errMsgId: 'The username you chose already exists. Try again with a different username.'}, //registration.errorUsernameExists
      'bad username': {errMsgId: 'The username you chose is not allowed. Try again with a different username.'} //registration.errorBadUsername
  },
  password: {
      'Ensure this value has at least 6 characters \\(it has \\d\\).': {
          errMsgId: 'Your password is too short. It needs to be at least 6 letters long.' //registration.errorPasswordTooShort
      }
  },
  recaptcha: {
      'Incorrect, please try again.': {errMsgId: 'There was a problem with the CAPTCHA test.'} //registration.errorCaptcha
  }
};

/**
 * Class combines functions from LLK/scratch-gui/src/lib/validate
 */
class AuthAPI extends API {
  constructor(props) {
    super(props);
    this.responseErrorMsgs = responseErrorMsgs;
    this.subscriptions = {};

    this.onAuthStateChanged(user => {
      if (user) {
        if (user.uid != this.cache_.getUserID()) {
          this.cache_.clearLocalStore();
          this.cache_.cacheUserID(user.uid);
        }
      } else {
        this.cache_.clearLocalStore();
      }
    });
  }
  
  /**
   * adds listener whenever the auth state is changed in google auth
   * @param {Function} callback 
   */
  onAuthStateChanged(callback) {
    const unsubscribe = getAuthService().onAuthStateChanged(callback);
    this.subscriptions[callback] = unsubscribe;
  }

  /**
   * removes listener, call when component using this listener will unmount
   * @param {Function} callback 
   */
  removeAuthStateChanged(callback) {
    if (this.subscriptions[callback]) {
      this.subscriptions[callback]();
      // console.log('unsubscribed', callback);
    }
  }

  /**
   * Takes input form data (assumed to be validated by other methods) and 
   * creates a new user account and stores relevant data in firestore.
   * 
   * @param {object} formData
   * @param {String} formData.username
   * @param {String} formData.email
   * @param {String} formData.password
   * @param {String} formData.passwordConfirm
   * @param {String} formData.birth_month
   * @param {String} formData.birth_year
   * @param {String} formData.gender
   * @param {String} formData.country
   * 
   * @return {object} {isSuccess : boolean}
   */
  async createUser(formData) {
    console.log('GOT HERE?: ',formData);
    let auth = getAuthService();
    let firestore = getFirestoreService();

    console.log('GOT HERE: ',formData);
    return auth
      .createUserWithEmailAndPassword(formData.email, formData.password)
      .then(userCredential => {
        let user = userCredential.user;
        console.log("User created with ID: ", user.uid);
        return firestore
        .collection("users")
        .doc(user.uid)
        .set(omit(formData,["email","password","passwordConfirm"])) // don't store email/password publicly lol
        .then(() => {
          // console.log("User written in firestore with ID: ", user.uid);
          return {isSuccess : true};
        })
        .catch((error) => {
          // something went wrong
          // delete user since info wasn't added to firestore
          user.delete(); 
          // console.log(error);
          return {isSuccess : false, ...error};
        })
      })
      .catch((error) => {
        // "auth/email-already-in-use"
        // "auth/weak-password"
        // console.log(error);
        return {isSuccess : false, ...error};
      });
  }

/**
 * Signs in user using firebase email, password authentication
 * @param {object} formData
 * @param {String} formData.identifier - can be either username or email
 * @param {String} formData.password - password
 * @param {Boolean} formData.rememberMe - boolean whether signin should persist
 * 
 * @returns {Promise<Boolean>} boolean determining whether the signin went through or not
 */
  async signInUser(formData) {
    let email;
    
    if (emailValidator.validate(formData.identifier))  {
      email = formData.identifier;
    } else {
      // MAKES EMAILS PUBLIC. might want to make sure emails remain private in future
      // (TODO : do username signin in function and return token to signin with)
      var getEmailByUsername = getFunctionsService().httpsCallable('getEmailByUsername');
      let result = await getEmailByUsername({username: formData.identifier})
      email = result.data;
    }

    return await getAuthService()
      .setPersistence(
        formData.rememberMe 
        ? firebase.auth.Auth.Persistence.LOCAL 
        : firebase.auth.Auth.Persistence.SESSION
      )
      .then(() => {
        return getAuthService().signInWithEmailAndPassword(email, formData.password);
      })
      .then(() => {
        // Signed in 
        return true;
      })
      .catch((error) => {
        // console.log(error);
        return false;
      });
  }

  async signOut() {
    await getAuthService().signOut();
  }

  /**
   * @returns {Boolean} whether a user is signed in currently
   */
  isSignedIn() {
    return Boolean(getAuthService().currentUser);
  }

  /**
   * Sends a password reset email to the given email
   * TODO: doesn't check that email is even registered to firebase? 
   * is this automatic?
   * @param {String} email 
   */
  sendPasswordResetEmail(email) {
    getAuthService().sendPasswordResetEmail(email)
    .then(() => {
      window.alert(`email reset link sent for email: ${email}`)
    })
    .catch((error) => {
      window.alert(`Something went wrong: ${error.message}`)
      // console.log(error);
    });   
  }







  
/**
 * Functions below are primarily ripped from LLK/scratch-www on github,
 * with additional modifications for our project (i.e. firebase funciton calls
 * and caching certain results)
 * 
 * Functions below are mostly used in join-flow component which is mostly pulled from 
 * components of the same name in LLK/scratch-www
 */

  /**
   * Determines whether email is valid for authentication use.
   * 
   * @param {String} email value to be validated
   * @returns {object} {valid: boolean, errMsgId? : string}
   */
  async validateEmailRemotely(email) {
    if (!this.cache_.hasEmail(email)) {
      let methods = await getAuthService().fetchSignInMethodsForEmail(email);
      if (methods.length) {
        this.cache_.cacheEmailValidity(email, false); 
      } else {
        this.cache_.cacheEmailValidity(email, true); 
      }
    }

    if (this.cache_.getEmailValidity(email)) 
      return {valid: true};
    else {
      return {valid : false , errMsgId: 'Email appears to already be in use. Try another?'}; 
    } 
  }

  /** FROM validate.js */
  validateEmailLocally(email) {
    if (!email || email === '') {
        return {valid: false, errMsgId: 'Required'}; //general.required
    } else if (emailValidator.validate(email)) {
        return {valid: true};
    }
    return ({valid: false, errMsgId: "Email doesn’t look valid. Try another?"}); //registration.validationEmailInvalid
  }

  /** REDONE */
  async validateUsernameRemotely(username) { // false => taken, true => available
    if (!this.cache_.hasUsername(username)) {
      // check firestore and stuff
      let fs = getFirestoreService();
      let query = fs.collection('usernames').doc(username);
      let results = await query.get();
      
      if (results.exists) {
        this.cache_.cacheUsernameValidity(username, false);   
      } else {
        this.cache_.cacheUsernameValidity(username, true); // username available 
      }
    }

    if (this.cache_.getUsernameValidity(username)) {
      return {valid: true}; 
    } else {
      return {valid: false, errMsgId: 'Username taken. Try another?'}
    }
    
  }

  /** FROM validate.js */
  validateUsernameLocally(username) {
    if (!username || username === '') {
        return {valid: false, errMsgId: 'Required'}; //'general.required'
    } else if (username.length < 3) {
        return {valid: false, errMsgId: 'Must be 3 letters or longer'}; //'registration.validationUsernameMinLength'
    } else if (username.length > 20) {
        return {valid: false, errMsgId: 'Must be 20 letters or shorter'}; //registration.validationUsernameMaxLength
    } else if (/\s/i.test(username)) {
        return {valid: false, errMsgId: "Usernames can't have spaces"}; //registration.validationUsernameSpaces
    } else if (!/^[\w-]+$/i.test(username)) {
        return {valid: false, errMsgId: 'Usernames can only use letters, numbers, - and _'}; //registration.validationUsernameRegexp
    }
    return {valid: true};
  }

  /**
   * Validate password value, optionally also considering username value
   * @param  {string} password     password value to validate
   * @param  {string} username     username value to compare
   * @return {object}              {valid: boolean, errMsgId: string}
   */
  validatePassword(password, username) {
    if (!password) {
        return {valid: false, errMsgId: 'Required'}; //general.required
    // Using Array.from(string).length, instead of string.length, improves unicode
    // character counting for a subset of unicode characters, so that they are counted
    // as single characters by js.
    // However, this only helps with a subset of unicode. Characters combinations,
    // including diacritical marks or skintone/gender variations, will still appear
    // to be multiple characters. See discussions:
    // https://blog.jonnew.com/posts/poo-dot-length-equals-two
    // https://stackoverflow.com/a/54370584/2308190
    } else if (Array.from(password).length < 6) {
        return {valid: false, errMsgId: 'Must be 6 letters or longer'}; //registration.validationPasswordLength
    } else if (password === 'password') {
        return {valid: false, errMsgId: "Password is too easy to guess. Try something else?"}; //registration.validationPasswordNotEquals
    } else if (username && password === username) {
        return {valid: false, errMsgId:"Password can’t match your username"}; //registration.validationPasswordNotUsername
    }
    return {valid: true};
  }

  /**
   * Validate passwordConfirm value && that it matches given password
   * @param  {string} password     password value to validate
   * @param  {string} passwordConfirm     passwordConfirm value to validate
   * @return {object}              {valid: boolean, errMsgId: string}
   */
  validatePasswordConfirm(password, passwordConfirm) {
    if (!passwordConfirm) {
        return {valid: false, errMsgId: 'Required'}; //general.required
    } else if (password !== passwordConfirm) {
        return {valid: false, errMsgId: "Passwords don’t match"}; //registration.validationPasswordConfirmNotEquals
    }
    return {valid: true};
  }

  /** Pulled entirely from LLK/scratch-www for use in join-flow component */
  responseErrorMsg(fieldName, serverRawErr) {
    if (fieldName && this.responseErrorMsgs[fieldName]) {
        const serverErrPatterns = this.responseErrorMsgs[fieldName];
        // use regex compare to find matching error string in responseErrorMsgs
        const matchingKey = Object.keys(serverErrPatterns).find(errPattern => (
            RegExp(errPattern).test(serverRawErr)
        ));
        if (matchingKey) return this.responseErrorMsgs[fieldName][matchingKey].errMsgId;
    }
    return null;
  };

}

export default new AuthAPI();