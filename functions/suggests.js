const functions = require("firebase-functions");

const admin = require('./admin.js');

const fs = require('fs');
const trie = require('./trie');
const examples = JSON.parse(fs.readFileSync("./trie/input/default.json",'utf-8'));

module.exports = functions.https.onCall((data, context) => {
  
  if (context.app == undefined) { // App Check
    throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called from an App Check verified app.')
  }

  // functions.logger.log(data.block);

  const block = data.block;
  // const uid = data.uid;
  let t2 = trie.Trie.fromObject(examples);
  let suggests = t2.autoSuggest(block);

  return suggests;
});