# [Knitheworld](https://knitheworld-bb33d.web.app/)
Knitheworld is a dynamic website letting students learn computer science through a Scratch like interface for knitting machines. Knitheworld is adapted from [Scratch](https://github.com/LLK)'s codebase, specifically utilizing their [`scratch-vm`](https://github.com/LLK/scratch-vm) and [`scratch-blocks`](https://github.com/LLK/scratch-blocks) libraries and adapting React components from [`scratch-gui`](https://github.com/LLK/scratch-gui) and [`scratch-www`](https://github.com/LLK/scratch-www). The site can be visited at https://knitheworld-bb33d.web.app/ (and maybe soon https://knitheworld.web.app/)

# Installing and Running Locally

Knitheworld has 3 separate branches that correspond to different directories that are all needed to locally run, build, and deploy the app. You will first need to create an empty directory to hold all of the knitheworld code. `cd` into that directory in the terminal and run the following commands.
```
$ git clone -b main <remote-repo-url> main
$ git clone -b scratch-vm <remote-repo-url> scratch-vm
$ git clone -b scratch-blocks <remote-repo-url> scratch-blocks
```
Each branch will then be cloned into the directory and you should now have the following folders:
* `main` (contains all the code for the website)
* `scratch-vm` (containing all the code for the `node_modules/scratch-vm` dependency in main)
* `scratch-blocks` (containing all the code for the `node_modules/scratch-blocks` dependency in main)

From there `cd` into `scratch-vm` and run the following commands:
```
npm install && npm link
```
After that `cd` into `scratch-blocks` and run the following commands:
```
npm install && npm link
```
Next `cd` into the `main` directory and run the following commands:
```
npm install && npm link scratch-blocks scratch-vm
```
This links the `scratch-vm` and `scratch-blocks` directories as dependencies to `main`. <b> Note: If you install any new dependency or rerun `npm install` in `main` you will need to relink `scratch-blocks` and `scratch-vm` with `main`</b>.

Everything should be installed now and you can start a devserver with no issue by running `npm start` inside the main branch.

If you run into the following error in your terminal when starting the dev server `cd` into scratch-vm and run `npm install` again (unknown what causes htmlparser2 to be deleted but reinstalling it fixes it):
```
ERROR in ../scratch-vm/src/engine/mutation-adapter.js
Module not found: Error: Can't resolve 'htmlparser2' in '/Users/nsendek/Desktop/UROP.nosync/knitheworld/scratch-vm/src/engine'
 @ ../scratch-vm/src/engine/mutation-adapter.js 1:13-35
 @ ../scratch-vm/src/engine/blocks.js
 @ ../scratch-vm/src/serialization/sb2.js
 @ ../scratch-vm/src/virtual-machine.js
 @ ../scratch-vm/src/index.js
 ...
 ```
 
## App Check Debug Token

Our firebase services (firestore, cloud storage, cloud functions) all require [App Check](https://firebase.google.com/docs/app-check/web/recaptcha-provider) Verification in order to be called. The only url accepted is https://knitheworld-bb33d.web.app/ so to run locally, you need to get a debug token from the firebase console and add it to a `APPCHECK_DEBUG_TOKEN` variable in a `main/.env` file.

In `main/.env`:
```
APPCHECK_DEBUG_TOKEN=<PASTE-DEBUG-TOKEN-HERE>
```
In `main/firebase.config.js`:
```javascript
if (process.env.NODE_ENV === 'development') {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.APPCHECK_DEBUG_TOKEN
}
```

# Emulating and Deploying to Firebase
Knitheworld uses Firebase to store data and host the site/backend. You will need access to the project in order to deploy cloud functions and hosting, however, you can emulate locally. `main` acts as a Firebase project directory with `main/firebase.json`, `main/.firebaserc`, and `main/firebase.config.js` files, as well as a `main/functions` directory where you write and deploy cloud functions. We utilize a few custom scripts defined in `main/package.json` that simplify many commands from the [Firebase CLI](https://firebase.google.com/docs/cli) we will use. For more information on Firebase visit the [Firebase Docs](https://firebase.google.com/docs). 

<b> Make sure you have Firebase CLI installed by running `npm install -g firebase-tools` </b>

## Emulating
### Hosting
To emulate hosting you will need to first create a production build of the website, and then the custom `emulate` script.

First `cd` into `main` run the following commands:
```
npm run build && npm run emulate:hosting
```

### Functions
To emulate functions you will need to install the necessary function dependencies. First `cd` into `main/functions` and run `npm install`. Then `cd` back into `main` and run `npm run emulate:functions`

You will also need to make sure to [generate a copy of a service account key](https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app) from your firebase project console and place it in a `firebase.service.json` file within `main/functions`. this key will be used in `admin.js` to give the function admin the right permissions.

In `main/functions/firebase.service.json`:
```
{
  "type": "service_account",
  "project_id": "knitheworld-bb33d",
  "private_key_id": "...........",
  "private_key": "...........",
  "client_email": "firebase-adminsdk-w3g5g@knitheworld-bb33d.iam.gserviceaccount.com",
  "client_id": "..........",
  ........
}
```
In `main/functions/admin.js`:
```javascript
const serviceAccount = require("./firebase.service.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
```

## Deploying
### Hosting
`cd` into `main` run the following commands:
```
npm run build && npm run deploy
```

### Functions
First make sure `main/functions` dependencies have been installed. Then `cd` into `main/functions` and run the following command there:
```
firebase deploy --only functions
```

