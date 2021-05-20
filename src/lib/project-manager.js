import vmScratchBlocks from "./blocks";
import firebase from "./firebase.js";

const CURRENT_PROJECT_ID = "currentID";
const USER_ID = "userID";

const blankWorkSpace =`<xml>
  <block type="event_whenstarted" deletable="false" x="25" y="50">
  </block>
</xml>`

const byteSize = str => Number(new Blob([str]).size);

class ProjectManager {
  constructor () { 
    // cache variable
    this.cache_ = {needUpdate : true};

    let db = firebase.firestore();
    let userID = this.getUserID(); 

    if (userID === null) {
      db.collection("users").add({
        joined : new Date(),
      })
      .then((docRef) => {
        localStorage.setItem(USER_ID, docRef.id);
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
    } else {
      db.collection("users").doc(userID).update({
        lastOnline : new Date(),
      });
      console.log("Document found with ID: ", userID);
    }
    this.loadSampleProjects();
  }

  async loadSampleProjects() {
    let paths = this.getPaths();
    let id = 1;
    let promises = []
    for (const projectName in paths) {
      let xmlPath, imgPath;
      let isXML = paths[projectName][0].indexOf('xml') > -1;

      if (isXML) [xmlPath, imgPath] = paths[projectName];
      else [imgPath, xmlPath] = paths[projectName]; 

      promises.push(this.loadSampleProject(xmlPath, imgPath, projectName, `sampleProject${id}`));
      id ++;
    }

    Promise.all(promises).then(sampleProjects => {
      this.cache_ = {sampleProjects, ...this.cache_ };
      console.log(this.cache_);
    })
  }

  async loadSampleProject(xmlPath, imgPath, name, id) {
    return {
      xml: (await import(`./projects${xmlPath}`)).default, 
      imgData: (await import(`./projects${imgPath}`)).default,
      name, 
      id
    }
  }

  getSampleProjects() {
    return this.cache_.sampleProjects;
  }

  getPaths() {
    // https://stackoverflow.com/questions/29421409/how-to-load-all-files-in-a-directory-using-webpack-without-require-statements
    // https://stackoverflow.com/questions/34895800/javascript-restructure-an-array-of-strings-based-on-prefix
    let ref = require.context('./projects', true, /\.(png|xml)$/);
    let files = ref.keys();
    let paths = {};

    for (var i = 0; i < files.length; i++) {
      let s = files[i].split('/'); // "./Blue zig zag/index.xml" => [".", "Blue zig zag", "index.xml"]
      if (s.length != 3) continue;
      
      let projectName = s[1];
      if (!paths[projectName]) paths[projectName] = [];
      paths[projectName].push(files[i].substring(1));
    }

    return paths;
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

  async getProject(id) {
    let db = firebase.firestore();
    let doc = await db.collection("users")
      .doc(this.getUserID())
      .collection("projects").doc(id).get();

    let {xml, name, timestamp, imgData} = doc.data();
    let size = byteSize(xml + imgData + timestamp + name);
    return {id : doc.id, xml, name, timestamp, imgData, size};
  }

  async getProjects() {
    let db = firebase.firestore();
    let snapshot = await db.collection("users")
      .doc(this.getUserID())
      .collection("projects").get();

    let projects = snapshot.docs.map(doc => {
      let {xml, name, timestamp, imgData} = doc.data();
      let size = byteSize(xml + imgData + timestamp + name);
      return {id : doc.id, xml, name, timestamp, imgData, size};
    })

    return projects;
  }

  saveProject(projectName = null, imgData = null) {
    if (this.getCurrentID() === null) { 
      // saving new project
      this.saveNewProject(projectName, imgData);
    } else { 
      // resaving current project
      this.saveCurrentProject(projectName, imgData);
    }
  }

  async saveNewProject(projectName = null, imgData = null) {
    let db = firebase.firestore();

    await db.collection("users")
      .doc(this.getUserID())
      .collection("projects")
      .add({
        xml: this.getXML(), 
        name: projectName ? projectName : `Project ${newID}`, 
        timestamp : new Date(), 
        imgData
      })
      .then(doc => {
        console.log("saveNewProject update: ", doc);
        localStorage.setItem(CURRENT_PROJECT_ID, doc.id);
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
      timestamp : new Date()
    }

    if (projectName) newData.name = projectName ? projectName : `Project ${newID}`;
    if (imgData) newData.imgData = imgData;

    await db.collection("users")
      .doc(this.getUserID())
      .collection("projects")
      .doc(currentID)
      .update(newData)
      .then((doc) => {
        console.log(doc)
        console.log("saveCurrentProject update: ", doc);
        this.vm.emit("PROJECT_NAME_CHANGED");
      })
      .catch(error => {
        console.error("Error in saveCurrentProject: ", error);
      });
  }

  newProject(xml = null) {
    // will clear blocks in current project & remove currentID
    if (xml === null) {
      vmScratchBlocks.loadWorkspace(blankWorkSpace);
    } else {
      vmScratchBlocks.loadWorkspace(xml);
    }
    
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

  loadCurrentProject() {
    let currentID = this.getCurrentID();

    if (currentID !== null) {
      this.loadProject(currentID);
    } else { // no current project, open up new project 
      this.newProject();
    }

    this.vm.emit("PROJECT_NAME_CHANGED");
  }
  
  async deleteProject(id) {
    let db = firebase.firestore();
    let currentID = this.getCurrentID();

    await db.collection("users")
      .doc(this.getUserID())
      .collection("projects").doc(id).delete()
      .then(() => {
          console.log("Document successfully deleted!");
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });

    if (currentID === id) {
      localStorage.removeItem(CURRENT_PROJECT_ID);
      this.vm.emit("PROJECT_NAME_CHANGED");
    }
  }

  async getProjectName(id) {
    let project = await this.getProject(id)
    return project.name;
  }

  async getCurrentProjectName() {
    let currentID = this.getCurrentID();
    return (currentID === null) ? "Unsaved Project" : await this.getProjectName(currentID);
  }

  changeProjectName(id,newName) {
    let db = firebase.firestore();
    db.collection("users")
      .doc(this.getUserID())
      .collection("projects")
      .doc(id)
      .set({name : newName},{ merge: true })
      .then((doc) => {
        // console.log("changeProjectName update: ", doc.data());
        this.vm.emit("PROJECT_NAME_CHANGED");
      })
      .catch(error => {
        console.error("Error in changeProjectName: ", error);
      });
  }
}


export default new ProjectManager();