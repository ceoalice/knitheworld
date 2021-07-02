import UserManager from './user-manager';
const emailValidator = require('email-validator');

const validateUsernameLocally = username => {
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
};

const validateUsernameRemotely = async username => {

  let result = await UserManager.validateUsernameRemotely(username);

  if (result) { // valid username
    return {requestSucceeded: true, valid: true};
  } else {
    return {requestSucceeded: true, valid: false, errMsgId: 'Username taken. Try another?'}; //registration.validationUsernameExists
  }
  // return new Promise( resolve => {
  //   api({
  //       uri: `/accounts/checkusername/${username}/`
  //   }, (err, body, res) => {
  //       if (err || res.statusCode !== 200) {
  //           resolve({requestSucceeded: false, valid: false, errMsgId: 'general.error'});
  //       }
  //       // get the message in a way that will work for both scratchr2 and api
  //       // versions of the checkusername endpoint
  //       let msg = '';
  //       if (body && body.msg) msg = body.msg;
  //       else if (body && body[0]) msg = body[0].msg;
  //       switch (msg) {
  //       case 'valid username':
  //           resolve({requestSucceeded: true, valid: true});
  //           break;
  //       case 'username exists':
  //           resolve({requestSucceeded: true, valid: false, errMsgId: 'registration.validationUsernameExists'});
  //           break;
  //       case 'bad username': // i.e., vulgar
  //           resolve({requestSucceeded: true, valid: false, errMsgId: 'registration.validationUsernameNotAllowed'});
  //           break;
  //       case 'invalid username':
  //       default:
  //           resolve({requestSucceeded: true, valid: false, errMsgId: 'registration.validationUsernameNotAllowed'});
  //       }
  //   });
  // });
}
 

/**
 * Validate password value, optionally also considering username value
 * @param  {string} password     password value to validate
 * @param  {string} username     username value to compare
 * @return {object}              {valid: boolean, errMsgId: string}
 */
const validatePassword = (password, username) => {
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
};

const validatePasswordConfirm = (password, passwordConfirm) => {
    if (!passwordConfirm) {
        return {valid: false, errMsgId: 'Required'}; //general.required
    } else if (password !== passwordConfirm) {
        return {valid: false, errMsgId: "Passwords don’t match"}; //registration.validationPasswordConfirmNotEquals
    }
    return {valid: true};
};

const validateEmailLocally = email => {
    if (!email || email === '') {
        return {valid: false, errMsgId: 'Required'}; //general.required
    } else if (emailValidator.validate(email)) {
        return {valid: true};
    }
    return ({valid: false, errMsgId: "Email doesn’t look valid. Try another?"}); //registration.validationEmailInvalid
};

const validateEmailRemotely = async email => {

    let result = await UserManager.validateEmailRemotely(email);

    if (result) { // valid username
      return {requestSucceeded: true, valid: true};
    } else {
      return {requestSucceeded: true, valid: false, errMsgId: 'Email appears to already be in use. Try another?'}; //registration.validationEmailInUse
    }
    // new Promise(resolve => {
    //     api({
    //         host: '', // not handled by API; use existing infrastructure
    //         params: {email: email},
    //         uri: '/accounts/check_email/'
    //     }, (err, body, res) => {
    //         if (err || res.statusCode !== 200 || !body || body.length < 1 || !body[0].msg) {
    //             resolve({requestSucceeded: false, valid: false, errMsgId: 'general.apiError'});
    //         }
    //         switch (body[0].msg) {
    //         case 'valid email':
    //             resolve({requestSucceeded: true, valid: true});
    //             break;
    //         case 'Scratch is not allowed to send email to this address.': // e.g., bad TLD or block-listed
    //         case 'Enter a valid email address.':
    //         default:
    //             resolve({requestSucceeded: true, valid: false, errMsgId: 'registration.validationEmailInvalid'});
    //             break;
    //         }
    //     });
    // })
};

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

const responseErrorMsg = (fieldName, serverRawErr) => {
    if (fieldName && responseErrorMsgs[fieldName]) {
        const serverErrPatterns = responseErrorMsgs[fieldName];
        // use regex compare to find matching error string in responseErrorMsgs
        const matchingKey = Object.keys(serverErrPatterns).find(errPattern => (
            RegExp(errPattern).test(serverRawErr)
        ));
        if (matchingKey) return responseErrorMsgs[fieldName][matchingKey].errMsgId;
    }
    return null;
};

export default {
  validateUsernameLocally,
  validateUsernameRemotely,
  validatePassword,
  validatePasswordConfirm,
  validateEmailLocally,
  validateEmailRemotely,
  responseErrorMsg,
  responseErrorMsgs
}