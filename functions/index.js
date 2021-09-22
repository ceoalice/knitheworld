const functions = require("firebase-functions");
const admin = require('./admin.js');

// Cloud Functions Docs
// https://firebase.google.com/docs/functions/write-firebase-functions

// https://firebase.google.com/docs/auth/admin/manage-users
// https://github.com/firebase/functions-samples/blob/main/username-password-auth/functions/index.js
// https://firebase.google.com/docs/auth/admin/create-custom-tokens
// https://stackoverflow.com/questions/51752457/firebase-verify-email-password-in-cloud-function

exports.getEmailByUsername = functions.https.onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.')
  }

  const username = data.username;
  const query = admin.firestore().collection('usernames').doc(username);
  const result = await query.get();
  
  if (result.exists) {
    let usernameIDPair = result.data();
    let usersResults = await admin.auth().getUsers([{ uid: usernameIDPair.uid }]);

    if (usersResults.users.length == 1) {
      return usersResults.users[0].email;
    }
  }
  return "";
});

exports.suggest = require("./suggests.js");
exports.triggers = require("./triggers.js");
exports.router = require("./router.js");