const functions = require("firebase-functions");
const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp();

const trie = require('./trie/trie');
const examples = JSON.parse(fs.readFileSync("./trie/input/default.json",'utf-8'));
const defaultHTML = fs.readFileSync('./hosting/index.html').toString();

// Cloud Functions Docs
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.suggestNext = functions.https.onCall((data, context) => {
  functions.logger.log(data.block);

  const block = data.block;
  let t2 = trie.Trie.fromObject(examples);
  let suggests = t2.autoSuggest(block);

  return suggests;
});

// https://firebase.google.com/docs/auth/admin/manage-users
// https://github.com/firebase/functions-samples/blob/main/username-password-auth/functions/index.js
// https://firebase.google.com/docs/auth/admin/create-custom-tokens
// https://stackoverflow.com/questions/51752457/firebase-verify-email-password-in-cloud-function

exports.getEmailByUsername = functions.https.onCall(async (data, context) => {
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

// https://medium.com/@jalalio/dynamic-og-tags-in-your-statically-firebase-hosted-polymer-app-476f18428b8b
// https://firebase.google.com/docs/hosting/functions
// https://github.com/firebase/functions-samples/blob/main/authorized-https-endpoint/functions/index.js

exports.project = functions.https.onRequest((req, res) => {
  let metaPlaceholder = '<title>KnitheWorld</title>'

  try {
    let indexHTML = defaultHTML.replace(metaPlaceholder, '<title>PROJECT PAGE</title>');
    res.status(200).send(indexHTML);
  } catch(error) {
    res.status(500).send(error);
  }
});

exports.user = functions.https.onRequest((req, res) => {
  let metaPlaceholder = '<title>KnitheWorld</title>'

  try {
    let indexHTML = defaultHTML.replace(metaPlaceholder, '<title>USER PAGE</title>');
    res.status(200).send(indexHTML);
  } catch(error) {
    res.status(500).send(error);
  }
});

// trigger functions -------------------------------------------

// https://bigcodenerd.org/enforce-cloud-firestore-unique-field-values/
exports.storeNewUsername = functions.firestore.document('/users/{uid}')
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const username = snap.data().username;

    if (!username) return;
    
    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log('new user: ', username, context.params.uid);
        
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.

    // Add check here to make sure doc doesn't already exist and then sets username to blank or something
    if (username) {
      return admin.firestore().collection('usernames').doc(username).set({uid: context.params.uid});
    }
});

exports.updateUsername = functions.firestore.document('/users/{uid}')
  .onUpdate((change,context) => {
    const oldUsername = change.before.data().username;
    const newUsername = change.after.data().username;

    if (!oldUsername || !newUsername) return;
    if (oldUsername == newUsername) return; // just in case

    const oldUnRef = admin.firestore().collection('usernames').doc(oldUsername);
    const newUnRef = admin.firestore().collection('usernames').doc(newUsername);

    return newUnRef.get()
      .then(result => {
        if (!result.exist) { // available username
          return newUnRef.set({ uid : context.params.uid})
            .then(() => {
              // delete old username now
              return oldUnRef.delete()
                .then(() => {
                  functions.logger.log('username freed: ', username);
                })
                .catch(() => {
                  functions.logger.error("couldn't delete old username: ", username);
                })
            })
        } else {
          functions.logger.error('username already taken: ', username);
        }
      })
      .catch(() => {
        functions.logger.log('error occured deleting username: ', username, context.params.uid);
      });
});

exports.deleteUsername = functions.firestore.document('/users/{uid}')
  .onDelete((snap,context) => {
    const username = snap.data().username;
    const unRef = admin.firestore().collection('usernames').doc(username)

   return unRef.get()
    .then(result => {
      if (result.exists && result.data().uid == context.params.uid) {
        functions.logger.log('user and username deleted: ', username, context.params.uid);
        return unRef.delete();
      }
    })
    .catch(err => {
      functions.logger.log('error occured deleting user and username: ', username, context.params.uid);
    })
});