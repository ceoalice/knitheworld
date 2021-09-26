import VMScratchBlocks from "../blocks";
import firebase, {getFirestoreService} from "./firebase.js";
import API from "./api.js";

/**
 * @typedef Project
 * @prop {String} id - Unique ID of the project.
 * @prop {String} name - name of the project.
 * @prop {String} creator - ID of the user who created/owns this project.
 * @prop {String} xml - The XML of the scratch ParseTree for this project.
 * @prop {Object} timestamp - Timestamp of the last tim this project was edited.
 * @prop {Number} size - Rough estimate of the project size as it is stored in database.
 */

class ProjectAPI extends API {
  constructor (props) {
    super(props);
  }

  /**
   * Size of string in Kilobytes
   * @param {String} str 
   * @returns {Number} - size of string in Kilobytes
   */
  static storageSize(str) { 
    return Math.ceil(Number(new Blob([str]).size)/1e+3)
  }

  get defaultProjectName() {
    return "Untitled";
  }

  getSampleProjects() {
    return this.cache_.getSampleProjects();
  }

  /**
   * Get Project data by ID.
   * @param {String} id - id of project you want to get.
   * 
   * @returns {Promise<import("./api.js").APIResponse<Project>>} contains project information 
   */
  async getProject(id) {
    if (this.cache_.hasProject(id)) {
      return { status : 200, data : this.cache_.getProject(id) };
    }

    let db = getFirestoreService();

    try {
      let doc = await db.collection("projects").doc(id).get();
      // console.log(doc.exists);
      if (doc.exists) {
        this.cache_.cacheProject(doc.id, doc.data())
        return { status : 200, data : this.cache_.getProject(id) };
      } else {
        return { status : 404, error : 'Not Found'}
      }

    } catch (error) {
      return { status : 500, error };
    }
  }

  /**
   * Get all projects made by a specific user
   * @param {String} userID - id of the user. 
   * 
   * @returns {Promise<import("./api.js").APIResponse<Project[]>>}
   */
  async getProjectsByUserID(userID) {
    let db = getFirestoreService();    

    if (!this.cache_.hasCreatorProjects(userID)) {
      try {
        let query = db.collection("projects").where('creator', '==' , userID);

        let projects = await query.get().then((querySnapshot) => {
          let out = [];
            querySnapshot.forEach((doc) => {
              out.push(doc.data());
            });
          return out;
        });
  
        this.cache_.cacheProjectCreator(userID);
        projects.forEach(project => this.cache_.cacheProject(project.id, project));

      } catch (error) {
        return {status : 200, error };
      }

    }

    return {status : 200, data : this.cache_.getProjects(userID) };
  }

  /**
   * Gets the name of a specified project
   * @param {String} id - id of the project
   * @returns {Promise<(String | null)>} name of the project
   */
  async getProjectName(id) {
    if (this.cache_.getProject(id)) return this.cache_.getProject(id).name;

    let res = await this.getProject(id);
    if (res.status == 200) {
      return res.data.name;
    } else {
      return null;
    }
  }

  /**
   * Saves a project in database under user (REQUIRES USER TO BE SIGNED IN)
   * @param {String} projectName - optional projectname
   * @returns 
   */
  async saveProject(projectName = undefined) {
    // USER MUST BE SIGNED IN
    if (this.getUserID()) {
      if (this.getCurrentProjectID()) { 
        // resaving current project
        return this.saveCurrentProject(projectName);
      } else { 
        // saving new project
        return this.saveNewProject(projectName);
      }
    } else {
      return { status : 401, message : "Need to be signed in." };
    }
  }

  /**
   * Saves a NEW project to database with creator userID (REQUIRES USER TO BE SIGNED IN)
   * @param {String} projectName - optional projectname
   * @returns 
   */
  async saveNewProject(projectName = 'Untitled') {
    let db = getFirestoreService();

    let newData = {
      xml: VMScratchBlocks.getXML(),
      creator : this.getUserID(),
      name: projectName, 
      timestamp : firebase.firestore.Timestamp.fromDate(new Date()), 
    };

    newData.size = ProjectAPI.storageSize(JSON.stringify(newData));

    let ref = db.collection("projects").doc();

    newData.id = ref.id;

    return ref.set(newData)
      .then(() => {
        this.cache_.cacheLastEditedProjectID(newData.id);
        this.cache_.cacheProject(newData.id, newData);
        this.vm.emit("PROJECT_NAME_CHANGED");
        return { status : 200, message : `Sucessfully saved new project ${projectName}.`};
      })
      .catch(error => {
        console.error("Error in saveNewProject: ", error);
        return { status : 500, error };
      });
  }

  /**
   * Resaves an already created project (REQUIRES USER TO BE SIGNED IN, AND OWN PROJECT)
   * @param {String} projectName - optional projectname
   * @returns 
   */
  async saveCurrentProject(projectName = undefined) {
    let currentID = this.getCurrentProjectID();
    let db = getFirestoreService();

    let newData = {
      xml: VMScratchBlocks.getXML(),
      timestamp : firebase.firestore.Timestamp.fromDate(new Date())
    };

    if (projectName) newData.name = projectName;

    newData.size = ProjectAPI.storageSize(JSON.stringify({ ...this.cache_.getProject(currentID), ...newData }));

    let ref = db.collection("projects").doc(currentID);

    newData.id = ref.id;

    return ref.update(newData)
      .then(() => {
        this.cache_.cacheProject(currentID, newData)
        this.vm.emit("PROJECT_NAME_CHANGED");
        return { status : 200, message : `Successfully saved project.`};
      })
      .catch(error => {
        console.error("Error in saveCurrentProject: ", error);
        return { status : 500, error };
      });
  }

  /**
   * @param {String} xml - The XML of a scratch ParseTree.
   * @returns {Promise<import("./api.js").APIResponse>}
   */
  async newProject(xml = null) {
    // will clear blocks in current project & remove currentID
    if (xml) VMScratchBlocks.loadXML(xml);
    else VMScratchBlocks.loadXML();

    this.cache_.clearLastEditedProjectID();
    this.vm.emit("PROJECT_NAME_CHANGED");

    return { status : 200, message : "Blank project workspace loadeed."};
  }

  /**
   * @param {String} id - ID of the project being loaded.
   * @returns {Promise<import("./api.js").APIResponse>}
   */
  async loadProject(id) { 
    let res = await this.getProject(id);
    // console.log("")
    if (res.status == 200) {
      let project = res.data;
      if (project.creator == this.getUserID()) { // owner
        this.cache_.cacheLastEditedProjectID(id);
        VMScratchBlocks.loadXML(project.xml);
        this.vm.emit("PROJECT_NAME_CHANGED");
        return { status : 200, message : `Project ${project.id} loaded.`};
      } else {
        // new project from template XML
        this.newProject(project.xml);
      }
    }
  }

  /**
   * Called loadProject on the most recent project, if no recent, loads a blank workspace.
   * @returns {Promise<void>} 
   */
  async loadCurrentProject() {
    let currentID = this.getCurrentProjectID();

    if (currentID) {
      return this.loadProject(currentID);
    } else { // no current project, open up new project 
      return this.newProject();
    }
  }

  /**
   * Returns whether XML has changed in any way from previously cached XML.
   * @returns {Boolean} Boolean set to true is XML has changed from previously cached XML.
   */
  async XMLChanged() {
    let res = await this.getProject(this.getCurrentProjectID()); // assumes output is from cache. 
    if (res.status == 200) {
      let project = res.data;
      let workspaceXML = VMScratchBlocks.getXML();
      return project.xml != workspaceXML;
    } else {
      return false; // just in case lol
    }
  }

  /**
   * 
   * @param {String} id - id of the project to be deleted.
   * @returns 
   */
  async deleteProject(id) {
    let db = getFirestoreService();

    return db.collection("projects")
      .doc(id)
      .delete()
      .then(() => {
        this.cache_.deleteProject(id)

        if (this.getCurrentProjectID() === id) {
          this.cache_.clearLastEditedProjectID();
          this.vm.emit("PROJECT_NAME_CHANGED");
        }

        return { status : 200, message: "Project successfully deleted" };
      }).catch((error) => {
          console.error("Error removing document: ", error);
          return { status : 500, error };
      });
  }

  /**
   * Changes the name of the specified project. 
   * @param {String} id - id of the project 
   * @param {String} newName - intended new project name
   */
  changeProjectName(id,newName) {
    let db = getFirestoreService();
    let newData = {name : newName};
    if (!this.getUserID()) {
      return { status : 401 , message : "Need to be signed in" };
    }

    db.collection("projects")
      .doc(id)
      .update(newData)
      .then(() => {
        this.cache_.cacheProject(id, newData);
        this.vm.emit("PROJECT_NAME_CHANGED");
        return { status : 200 , message : "Project name changed" };
      })
      .catch(error => {
        console.error("Error in changeProjectName: ", error);
        return { status : 500 , error };
      });
  }
}

export default new ProjectAPI();