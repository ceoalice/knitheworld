/**
 * Projects are saved in 
 * 
 * projects = [0,1,2,3, ... n] 
 * projectID = { name?, id, xml, base64? }
 * serial = 0 -> n
 */
import vmScratchBlocks from "./blocks";

const PROJECT_IDS = "projectIDs";
const CURRENT_PROJECT_ID = "currentID";
const AUTOINCREMENT_ID = "autoincrementID";

const PROJECT_XML = "projectXml";
const PROJECT_NAME = "projectName"
const PROJECT_TIMESTAMP = "projectTimestamp";
const PROJECT_IMAGE_DATA = "projectImgData";

const blankWorkSpace =`<xml>
  <block type="event_whenstarted" deletable="false" x="25" y="50">
  </block>
</xml>`

class ProjectManager {
  constructor () {
    // if storage is empty initialize it
    if (localStorage.getItem(AUTOINCREMENT_ID) === null) {
      localStorage.setItem(AUTOINCREMENT_ID, 1);
    }
  }

  setVM (vm) {
    this.vm = vm;
  }

  getCurrentProjectID() {
    return localStorage.getItem(CURRENT_PROJECT_ID);
  }

  getProjectIDs() {
    let projectIDs = localStorage.getItem(PROJECT_IDS);
    if (projectIDs === null) return [];
    
    let out = JSON.parse(`[${projectIDs}]`);
    return out;
  }

  getProject(id) {
    let xml = localStorage.getItem(`${id}_${PROJECT_XML}`);
    let name = localStorage.getItem(`${id}_${PROJECT_NAME}`);
    let timestamp = localStorage.getItem(`${id}_${PROJECT_TIMESTAMP}`); 
    
    return {id, xml, name, timestamp};
  }

  getProjects() {
    let out = [];
    this.getProjectIDs().forEach(id => {
      out.push(this.getProject(id));
    });
    return out;
  }


  saveProject(projectName = null, imgData = null) {
    // console.log("GOT HERE: saveProject");
    if (localStorage.getItem(CURRENT_PROJECT_ID) === null) { 
      // saving new project
      this.saveNewProject(projectName, imgData);
    } else { 
      // resaving current project
      this.saveCurrentProject(projectName, imgData);
    }
  }

  saveNewProject(projectName = null, imgData = null) {
    let newID = Number(localStorage.getItem(AUTOINCREMENT_ID));
    let projectIDs = this.getProjectIDs();

    projectIDs.push(newID);

    localStorage.setItem(CURRENT_PROJECT_ID, newID); // update current
    localStorage.setItem(PROJECT_IDS, projectIDs); // new IDs
    localStorage.setItem(AUTOINCREMENT_ID, newID + 1); //autoincrement

    localStorage.setItem(`${newID}_${PROJECT_XML}`, vmScratchBlocks.getXML());
    localStorage.setItem(`${newID}_${PROJECT_NAME}`, `Project ${newID}`);
    localStorage.setItem(`${newID}_${PROJECT_TIMESTAMP}`, new Date());
    // localStorage.setItem(`${newID}_${PROJECT_IMAGE_DATA}`, imgData);

    this.vm.emit("PROJECT_NAME_CHANGED"); // no longer unsaved
  }

  saveCurrentProject(projectName = null, imgData = null) {
    let currentID = Number(localStorage.getItem(CURRENT_PROJECT_ID));

    localStorage.setItem(`${currentID}_${PROJECT_XML}`, vmScratchBlocks.getXML());
    localStorage.setItem(`${currentID}_${PROJECT_TIMESTAMP}`, new Date());
  }

  newProject(xml = null) { 
    // will clear blocks in current project & remove currentID
    if (xml === null) {
      vmScratchBlocks.loadWorkspace(blankWorkSpace);
    } else {
      // enter state where project is loading blocks one at a time 
      // (don't need to update each time)
      this.vm.emit("PROJECT_LOADING", 
        vmScratchBlocks.loadWorkspace(xml)
      ); // enter state where project is loading blocks one at a time
      
    }
    
    localStorage.removeItem(CURRENT_PROJECT_ID); // new project started, not saved yet
    this.vm.emit("PROJECT_NAME_CHANGED");
  }
  
  loadProject(id) {
    // console.log("project loaded")
    localStorage.setItem(CURRENT_PROJECT_ID, id);
    let project = this.getProject(id);

    // enter state where project is loading blocks one at a time 
    // (don't need to update each time)
    this.vm.emit("PROJECT_LOADING", 
      vmScratchBlocks.loadWorkspace(project.xml)
    ); 
  }

  loadCurrentProject() {
    let currentID = localStorage.getItem(CURRENT_PROJECT_ID);

    if (currentID !== null) {
      this.loadProject(Number(currentID));
    } else { // no current project open up new project 
      this.newProject();
    }

    this.vm.emit("PROJECT_NAME_CHANGED");
  }
  
  deleteProject(id) {
    let projectIDs = this.getProjectIDs();
    let index = projectIDs.indexOf(id);
    if (index > -1) projectIDs.splice(index, 1);
       
    let currentID = Number(localStorage.getItem(CURRENT_PROJECT_ID));
    
    localStorage.removeItem(`${id}_${PROJECT_XML}`);
    localStorage.removeItem(`${id}_${PROJECT_NAME}`);
    localStorage.removeItem(`${id}_${PROJECT_TIMESTAMP}`);
    localStorage.removeItem(`${id}_${PROJECT_IMAGE_DATA}`);

    // save new list of projects
    localStorage.setItem(PROJECT_IDS, projectIDs);

    // if its already the open project?
    if (currentID === id) {
      localStorage.removeItem(CURRENT_PROJECT_ID);
      this.vm.emit("PROJECT_NAME_CHANGED");
    }
  }

  getProjectName(id) {
    return localStorage.getItem(`${id}_${PROJECT_NAME}`);
  }

  getCurrentProjectName() {
    let currentID = Number(localStorage.getItem(CURRENT_PROJECT_ID));
    return (currentID == 0) ? "Unsaved Project" : this.getProjectName(currentID);
  }

  changeProjectName(id,newName) {
    let currentID = Number(localStorage.getItem(CURRENT_PROJECT_ID));

    localStorage.setItem(`${id}_${PROJECT_NAME}`, newName);

    this.vm.emit("PROJECT_NAME_CHANGED"); // event doesn't care if current project or not
  }
}


export default new ProjectManager();