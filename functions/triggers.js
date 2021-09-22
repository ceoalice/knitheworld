const functions = require("firebase-functions");

const admin = require('./admin.js');

// trigger functions -------------------------------------------
// These functios get triggered based on updates in firestore data

// https://bigcodenerd.org/enforce-cloud-firestore-unique-field-values/
exports.storeNewUsername = functions.firestore.document('/users/{uid}')
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const username = snap.data().username;

    if (!username) return;
    
    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log('new user: ', username, context.params.uid);
        
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

    const oldUNRef = admin.firestore().collection('usernames').doc(oldUsername);
    const newUNRef = admin.firestore().collection('usernames').doc(newUsername);

    return newUNRef.get()
      .then(result => {
        if (!result.exist) { // available username
          return newUNRef.set({ uid : context.params.uid})
            .then(() => {
              // delete old username now
              return oldUNRef.delete()
                .then(() => {
                  functions.logger.log('username freed: ', oldUsername);
                })
                .catch(() => {
                  functions.logger.error("couldn't free old username: ", oldUsername);
                })
            })
        } else {
          functions.logger.error('username already taken: ', newUsername);
        }
      })
      .catch(() => {
        functions.logger.log('error occured changing usernames: ', oldUsername, newUsername, context.params.uid);
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

// exports.updateSuggestions = functions.firestore.document("/projects/{id}");