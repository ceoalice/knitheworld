const functions = require("firebase-functions");
const axios = require('axios').default;

const express = require('express');

const admin = require('./admin.js');

const app = express();

const cors = require('cors')({origin: true});
app.use(cors);

// const axiosConfig = {
//   mode: 'no-cors',
//   headers: {'Access-Control-Allow-Origin': '*'}
// };

// const fs = require('fs');
// const projectsHTML = fs.readFileSync('./hosting/projects.html').toString();
// const usersHTML = fs.readFileSync('./hosting/users.html').toString();

// https://medium.com/@jalalio/dynamic-og-tags-in-your-statically-firebase-hosted-polymer-app-476f18428b8b
// https://firebase.google.com/docs/hosting/functions
// https://github.com/firebase/functions-samples/blob/main/authorized-https-endpoint/functions/index.js

/**
 * Returns the default html file from our firebase hosting.
 * @param {String} filename 
 * @returns {Promise<String>} - an html string 
 */
async function getDefaultHTML(filename) {
  let html;
  try {
    // fetching "/users.html" or "/projects.html" gets the default html 
    // while also not triggering the "users/**" or "projects/**" rewrite in firebase.json
    const response = await axios.get(`https://knitheworld-bb33d.web.app/${filename}`);
    html = response.data;
  } catch (error) {
    functions.logger.log({error});
  }
  
  return html;
}


/**
 * Replaces substring in original string with replacement. substring markered by beginning and end markers
 * @param {String} orginal - original string
 * @param {String} startMarker - Indicates where in the original should replacement start. 
 *                               String marker must match EXACTLY in original text
 * @param {String} endMarker - Indicates where in the original should replacement start. 
 *                             String marker must match EXACTLY in original text
 * @param {String} replacement - Content you want placed in original string.
 * @returns  {String} copy of original string with area between star and end markers replaced with replacement string.
 */
function replaceRange(orginal, startMarker, endMarker, replacement) {
  let startIndex = orginal.indexOf(startMarker);
  let endIndex = orginal.indexOf(endMarker) + endMarker.length; // includes all of endMarker characters

  if (endIndex == -1 || startIndex == -1) return "";
  
  return orginal.substring(0,startIndex) + replacement + orginal.substring(endIndex);
}

/** 
 * only want to dynamically attach Open Graph tags when a bot is viewing the html for prerenders.
 * If a user is opening the html in browser the OG tag additions are pointless
 */
function isBot(req) {
  const userAgent = req.headers['user-agent'].toLowerCase();

  functions.logger.log({userAgent, path : req.path})

  return userAgent.includes('googlebot') ||
  userAgent.includes('yahoou') ||
  userAgent.includes('bingbot') ||
  userAgent.includes('baiduspider') ||
  userAgent.includes('yandex') ||
  userAgent.includes('yeti') ||
  userAgent.includes('yodaobot') ||
  userAgent.includes('slackbot') ||
  userAgent.includes('gigabot') || 
  userAgent.includes('ia_archiver') ||
  userAgent.includes('postmanruntime') ||
  userAgent.includes('facebookexternalhit') ||
  userAgent.includes('twitterbot') ||
  userAgent.includes('developers\.google\.com');
}

/**
 * router will serve dynamic HTML with updated open graph tags based on URL.
 * - For project page the dynamic html will have project title and thumbnail in it
 * - For user page the dynamic html will have username as title and user avatar(TODO)
 */


app.get('/projects/:id', async (req, res) => {
  const id = req.params.id;
  const bucket = admin.storage().bucket();

  const projectsHTML = await getDefaultHTML("projects.html");

  if(isBot(req)) {
    const doc = await admin.firestore().collection("projects").doc(id).get();

    if (doc.exists) {
      const project = doc.data();
      const thumbnail = bucket.file(`users/${project.creator}/${id}.png`);
  
      let thumbnailURL = await thumbnail.getSignedUrl({
          action: 'read',
          expires: '03-09-2491'
        }).then(signedUrls => signedUrls[0]); // contains the file's public URL

      let username = 
        await admin.firestore()
          .collection("usernames")
          .where('uid', '==' , project.creator)
          .get()
          .then((querySnapshot) => {
            let un = "unknown";
            querySnapshot.forEach((doc) => {
              un = doc.id;
            });
            return un;
          });

      let start = '<meta name="og-marker-start">';
      let end = '<meta name="og-marker-end">';

      let og = `<meta property="og:type" content="website">`;
      og += `<meta property="og:title" content="\"${project.name}\" by ${username}">`;
      og += `<meta property="og:description" content="Check Out ${username}'s Project on KnitheWorld">`;
      og += `<meta property="og:image" content="${thumbnailURL}">`;

      try {
        let dynamicHTML = replaceRange(projectsHTML, start, end, og);

        res.status(200).send(dynamicHTML);
      } catch(error) {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(projectsHTML);
    }
  } else {
    res.status(200).send(projectsHTML);
  }
});



app.get('/users/:id', async (req, res) => {
  const id = req.params.id;
  const bucket = admin.storage().bucket();
  
  const usersHTML = await getDefaultHTML("users.html");;

  if(isBot(req)) {
    const doc = await admin.firestore().collection("users").doc(id).get();

    if (doc.exists) {
      const user = doc.data();

      const avatar = user.avatar || "https://knitheworld-bb33d.web.app/static/images/placeholder-avatar.png";

      let start = '<meta name="og-marker-start">';
      let end = '<meta name="og-marker-end">';

      let og = `<meta property="og:type" content="website">`;
      og += `<meta property="og:title" content="${user.username}">`;
      og += `<meta property="og:description" content="Check Out ${user.username}'s Page on KnitheWorld">`;
      og += `<meta property="og:image" content="${avatar}">`;

      try {
        let dynamicHTML = replaceRange(usersHTML, start, end, og);
        res.status(200).send(dynamicHTML);
      } catch(error) {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(usersHTML);
    }
  } else {
    res.status(200).send(usersHTML);
  }
});

module.exports = functions.https.onRequest(app);