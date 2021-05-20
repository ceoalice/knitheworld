import vmScratchBlocks from "./blocks";
import firebase from "./firebase.js";

const CURRENT_PROJECT_ID = "currentID";
const USER_ID = "userID";

class ProjectCache {
  constructor () {
    this.needUpdate =  true; // if needUpdate is true, firebase must be called to pull data
    this.sampleProjects = {}; //  object maping project ID to sample project
    this.projects = {}; // object maping project ID to project

    // sample projects need to be loaded just once and stored in cache
    this.loadSampleProjects();
  }

  async loadSampleProjects() {
    let paths = this.getPaths();
    let x = 1;
    for (const projectName in paths) {
      let xmlPath, imgPath;
      let isXML = paths[projectName][0].indexOf('xml') > -1;
      let id = `sampleProject${x}`;

      if (isXML) [xmlPath, imgPath] = paths[projectName];
      else [imgPath, xmlPath] = paths[projectName]; 
      
      this.sampleProjects[id] = {
        xml: (await import(`${xmlPath}`)).default, 
        imgData: (await import(`${imgPath}`)).default,
        name: projectName, 
        id
      };
      x ++;
    }
  }

  getPaths() {
    // https://stackoverflow.com/questions/29421409/how-to-load-all-files-in-a-directory-using-webpack-without-require-statements
    // https://stackoverflow.com/questions/34895800/javascript-restructure-an-array-of-strings-based-on-prefix
    let files = require.context('./projects', true, /\.(png|xml)$/).keys();
    let paths = {}; // object will map projeect name to file paths for xml and png

    files.forEach(filePath => {
      let s = filePath.split('/'); // "./Blue zig zag/index.xml" => [".", "Blue zig zag", "index.xml"]
      if (s.length != 3) return;   
      else if (!paths[s[1]]) paths[s[1]] = [];

      paths[s[1]].push(`./projects${filePath.substring(1)}`);
    })

    return paths;
  }

  getSampleProjects() {
    // return Object.values(this.sampleProjects);
  }

  getProjects() {
    return Object.values(this.projects);
  }

  getProject(id) {
    return this.projects[id];
  }

  update(id, args) {
    if (!this.projects[id]) this.projects[id] = { id };

    this.projects[id] = { ...this.projects[id], ...args };
  }

  delete(id) {
    delete this.projects[id];
  }
}

class ProjectManager {
  constructor () {
    // cache variable
    this.cache_ = new ProjectCache();

    // this.cache_ = {needUpdate: true, sampleProjects: []};

    let db = firebase.firestore();
    let userID = this.getUserID(); 

    if (userID === null) {
      db.collection("users").add({
        joined : firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then((docRef) => {
        localStorage.setItem(USER_ID, docRef.id);
        console.log("User written with ID: ", docRef.id);
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
    } else {
      db.collection("users").doc(userID).update({
        lastOnline : firebase.firestore.Timestamp.fromDate(new Date()),
      });
      console.log("User found with ID: ", userID);
    }
  }

  setVM (vm) {
    this.vm = vm;
  }

  getCurrentID() {
    return localStorage.getItem(CURRENT_PROJECT_ID);
  }

  getUserID() {
    return localStorage.getItem(USER_ID);
  }

  getXML() {
    return vmScratchBlocks.getXML().replace(/(\s\s|\t|\n)/g, "");
  }

  getSampleProjects() {
    return this.cache_.getSampleProjects();
  }

  async getProject(id) {
    if (this.cache_.getProject(id)) return this.cache_.getProject(id);

    console.log("pulled from firebase");
    let db = firebase.firestore();
    let doc = await db.collection("users")
      .doc(this.getUserID())
      .collection("projects").doc(id).get();

    // let {xml, name, timestamp, imgData, size} = ;
    //
    this.cache_.update(doc.id, doc.data())
    // this.cache_[id] = {id , ...doc.data()}
    return this.cache_.getProject(id);
  }

  async getProjects() {
    let db = firebase.firestore();

    if (this.cache_.needUpdate) {
      console.log("cache needs update");
      this.cache_.needUpdate = false;

      let snapshot = await db.collection("users")
      .doc(this.getUserID())
      .collection("projects").get();

      return snapshot.docs.map(doc => {

        // let {xml, name, timestamp, imgData, size} = doc.data();
        
        // console.log(doc.data().name, ProjectManager.memSize(JSON.stringify(doc.data())));
        
        this.cache_.update(doc.id, {...doc.data()})
        // this.cache_[doc.id] = {id : doc.id, ...doc.data()};
        return this.cache_.getProject(doc.id); // this.cache_[doc.id];
      });
    } else {
      // let projects = Object.entries(this.cache_)
      //   .filter(keyVal => keyVal[0] != 'needUpdate' && keyVal[0] != 'sampleProjects')
      //   .map(keyVal => keyVal[1]);
      return this.cache_.getProjects(); //projects;
    }    
  }

  async getProjectName(id) {
    if (this.cache_.getProject(id)) return this.cache_.getProject(id).name;

    // let project = await this.getProject(id);
    return project.name;
  }

  async getCurrentProjectName() {
    let currentID = this.getCurrentID();
    return (currentID) ? await this.getProjectName(currentID) : "Unsaved Project";
  }

  saveProject(projectName = null, imgData = null) {
    if (this.getCurrentID()) { 
      // resaving current project
      this.saveCurrentProject(projectName, imgData);
    } else { 
      // saving new project
      this.saveNewProject(projectName, imgData);
    }
  }

  async saveNewProject(projectName = null, imgData = null) {
    let db = firebase.firestore();

    let newData = {
      xml: this.getXML(), 
      name: projectName ? projectName : `Project ${newID}`, 
      timestamp : firebase.firestore.Timestamp.fromDate(new Date()), 
      imgData
    };

    newData.size = ProjectManager.memSize(JSON.stringify(newData));

    await db.collection("users")
      .doc(this.getUserID())
      .collection("projects")
      .add(newData)
      .then(doc => {
        localStorage.setItem(CURRENT_PROJECT_ID, doc.id);

        this.cache_.update(doc.id, newData)
        // this.cache_[doc.id] = { ...this.cache_[doc.id], ...newData };
        this.vm.emit("PROJECT_NAME_CHANGED");
      })
      .catch(error => {
        console.error("Error in saveNewProject: ", error);
      });
  }

  async saveCurrentProject(projectName = null, imgData = null) {
    // ADD A XML CHECK TO SEE IF XML LOOKS DIFFERENT????? 
    let currentID = this.getCurrentID();
    let db = firebase.firestore();

    let newData = {
      xml: this.getXML(), 
      timestamp : firebase.firestore.Timestamp.fromDate(new Date())
    }

    newData.name = projectName ? projectName : `Project ${newID}`;
    newData.imgData = imgData ? imgData : "";

    let oldData = this.cache_[currentID];

    newData.size = ProjectManager.memSize(JSON.stringify({ ...oldData, ...newData }));

    await db.collection("users")
      .doc(this.getUserID())
      .collection("projects")
      .doc(currentID)
      .update(newData)
      .then(() => {

        this.cache_.update(currentID, newData)
        // this.cache_[currentID] = { ...oldData, ...newData };
        this.vm.emit("PROJECT_NAME_CHANGED");
      })
      .catch(error => {
        console.error("Error in saveCurrentProject: ", error);
      });
  }

  newProject(xml = null) {
    // will clear blocks in current project & remove currentID
    vmScratchBlocks.loadWorkspace(xml ? xml : ProjectManager.blankWorkSpace);

    localStorage.removeItem(CURRENT_PROJECT_ID);
    this.vm.emit("PROJECT_NAME_CHANGED");
  }
  
  async loadProject(id) {
    console.log("loadProject: ", id);
    localStorage.setItem(CURRENT_PROJECT_ID, id);
    let project = await this.getProject(id);

    // (don't need to update each time)
    vmScratchBlocks.loadWorkspace(project.xml);
    this.vm.emit("PROJECT_NAME_CHANGED");
  }

  async loadCurrentProject() {
    let currentID = this.getCurrentID();

    if (currentID) {
      await this.loadProject(currentID);
    } else { // no current project, open up new project 
      this.newProject();
    }

    this.vm.emit("PROJECT_NAME_CHANGED");
  }
  
  async deleteProject(id) {
    let db = firebase.firestore();

    await db.collection("users")
      .doc(this.getUserID())
      .collection("projects")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        this.cache_.delete(id)
        // delete this.cache_[id];
        // console.log("cache: ", this.cache_);

        if (this.getCurrentID() === id) {
          localStorage.removeItem(CURRENT_PROJECT_ID);
        }
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
  }

  changeProjectName(id,newName) {
    let db = firebase.firestore();
    let newData = {name : newName};

    db.collection("users")
      .doc(this.getUserID())
      .collection("projects")
      .doc(id)
      .update(newData)
      .then(() => {
        this.cache_.update(id, newData);
        // this.cache_[id] = { ...this.cache_[id], ...{name : newName} };
        this.vm.emit("PROJECT_NAME_CHANGED");
      })
      .catch(error => {
        console.error("Error in changeProjectName: ", error);
      });
  }
}

ProjectManager.blankWorkSpace =`<xml>
  <block type="event_whenstarted" deletable="false" x="25" y="50">
  </block>
</xml>`;

/**
 * Size of string in Kilobytes
 * @param {String} str 
 * @returns {Number} - size of string in Kilobytes
 */
ProjectManager.memSize = str => Math.ceil(Number(new Blob([str]).size)/1e+3);

export default new ProjectManager();