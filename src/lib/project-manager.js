import VMScratchBlocks from "./blocks";
import firebase from "./firebase.js";
import FirebaseCache from "./firebase-cache.js";

class ProjectManager {
  constructor () {
    // cache variable
    this.cache_ = FirebaseCache;
  }

  setVM (vm) {
    this.vm = vm;
  }

  getCurrentID() {
    return this.cache_.getCurrentProjectID(); // localStorage.getItem(CURRENT_PROJECT_ID);
  }

  getUserID() {
    return this.cache_.getUserID(); // localStorage.getItem(USER_ID);
  }

  getXML() {
    return VMScratchBlocks.getXML();
  }

  getSampleProjects() {
    return this.cache_.getSampleProjects();
  }

  async getProject(id) {
    if (this.cache_.getProject(id)) return this.cache_.getProject(id);

    console.log("pulled from firebase: ", id);
    let db = firebase.firestore();
    let doc = await db.collection("users")
      .doc(this.getUserID())
      .collection("projects").doc(id).get();

    this.cache_.updateProject(doc.id, doc.data())
    return this.cache_.getProject(id);
  }

  async getProjects() {
    let db = firebase.firestore();

    if (this.cache_.needUpdate && this.getUserID()) {
      console.log("cache needs update");
      this.cache_.needUpdate = false;

      let snapshot = await db.collection("users")
      .doc(this.getUserID())
      .collection("projects").orderBy("timestamp", "desc").get();

      return snapshot.docs.map(doc => {        
        this.cache_.updateProject(doc.id, doc.data())
        return this.cache_.getProject(doc.id);
      });
    } else {
      return this.cache_.getProjects();
    }
  }

  async getProjectName(id) {
    if (this.cache_.getProject(id)) return this.cache_.getProject(id).name;

    let project = await this.getProject(id);
    return project.name;
  }

  async getCurrentProjectName() {
    let currentID = this.getCurrentID();
    return (currentID) ? await this.getProjectName(currentID) : "Unsaved Project";
  }

  async saveProject(projectName = null, ) {
    if (this.getCurrentID()) { 
      // resaving current project
      return this.saveCurrentProject(projectName);
    } else { 
      // saving new project
      return this.saveNewProject(projectName);
    }
  }

  async saveNewProject(projectName = null) {
    let db = firebase.firestore();

    let newData = {
      xml: this.getXML(), 
      name: projectName ? projectName : `Project ${newID}`, 
      timestamp : firebase.firestore.Timestamp.fromDate(new Date()), 
    };

    newData.size = ProjectManager.memSize(JSON.stringify(newData));

    let ref = db.collection("users").doc(this.getUserID())
      .collection("projects").doc();

    newData.id = ref.id;

    return ref.set(newData)
      .then(() => {
        this.cache_.cacheCurrentProjectID(newData.id);
        this.cache_.updateProject(newData.id, newData)
        this.vm.emit("PROJECT_NAME_CHANGED");
      })
      .catch(error => {
        console.error("Error in saveNewProject: ", error);
      });
  }

  async saveCurrentProject(projectName = null) {
    // ADD A XML CHECK TO SEE IF XML LOOKS DIFFERENT????? 
    let currentID = this.getCurrentID();
    let db = firebase.firestore();

    let newData = {
      xml: this.getXML(), 
      timestamp : firebase.firestore.Timestamp.fromDate(new Date())
    };

    if (projectName) newData.name = projectName;

    newData.size = ProjectManager.memSize(JSON.stringify({ ...this.cache_.getProject(currentID), ...newData }));

    let ref = db.collection("users").doc(this.getUserID())
      .collection("projects").doc(currentID);

    newData.id = ref.id;

    return ref.update(newData)
      .then(() => {
        this.cache_.updateProject(currentID, newData)
        this.vm.emit("PROJECT_NAME_CHANGED");
      })
      .catch(error => {
        console.error("Error in saveCurrentProject: ", error);
      });
  }

  async newProject(xml = null) {
    // will clear blocks in current project & remove currentID
    VMScratchBlocks.loadXML(xml ? xml : ProjectManager.BLANK_WORKSPACE);

    this.cache_.clearCurrentProjectID();
    this.vm.emit("PROJECT_NAME_CHANGED");
  }
  
  async loadProject(id) {
    this.cache_.cacheCurrentProjectID(id);
    let project = await this.getProject(id);
    // (don't need to update each time)
    VMScratchBlocks.loadXML(project.xml);
    this.vm.emit("PROJECT_NAME_CHANGED");
  }

  async loadCurrentProject() {
    let currentID = this.getCurrentID();

    if (currentID) {
      await this.loadProject(currentID);
    } else { // no current project, open up new project 
      this.newProject();
    }
  }

  async XMLChanged() {
    let project = await this.getProject(this.getCurrentID());

    let workspaceXML = this.getXML();

    return project.xml != workspaceXML;
  }

  async loadProjectFromUrl() {
    let params = new URLSearchParams(window.location.search);
    // console.log(params.get('projectID'))
    // console.log(params.get('projectID'))
    let db = firebase.firestore();

    // let doc = await db.doc(params.get('projectID')).get();
    let ref = db.collectionGroup("projects");
    // console.log('id', '==' , params.get('projectID'))
    let query = ref.where('id', '==' , params.get('projectID'));
    
    // console.log(firebase.firestore.FieldPath.documentId())
    query.get().then((querySnapshot) => {
      if (querySnapshot.size == 1) {
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          this.newProject(data ? data.xml : null)
        });    
      } else {
        this.newProject();
      }
    });
    // this.vm.emit("PROJECT_NAME_CHANGED");
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
        this.cache_.deleteProject(id)
        // delete this.cache_[id];
        // console.log("cache: ", this.cache_);

        if (this.getCurrentID() === id) {
          this.cache_.clearCurrentProjectID();
          this.vm.emit("PROJECT_NAME_CHANGED");
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
        this.cache_.updateProject(id, newData);
        // this.cache_[id] = { ...this.cache_[id], ...{name : newName} };
        this.vm.emit("PROJECT_NAME_CHANGED");
      })
      .catch(error => {
        console.error("Error in changeProjectName: ", error);
      });
  }
}

ProjectManager.BLANK_WORKSPACE =`<xml>
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