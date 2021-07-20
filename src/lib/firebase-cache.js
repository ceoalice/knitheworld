class FirebaseCache {
  constructor () {
    this.needUpdate =  true; // if needUpdate is true, firebase must be called to pull data

    this.sampleProjects = {}; //  object maping project ID to sample project
    this.projects = {}; // object maping project ID to project

    this.sampleImages = {}; //  object maping project ID to sample project
    this.images = {}; // object maping project ID to project

    // sample projects need to be loaded just once and stored in cache
    this.loadSampleProjects();
  }

  async loadSampleImages() {
    let paths = this.getFilePaths('png');

    let x = 1;
    for (const projectName in paths) {
      let id = `sampleProject${x}`;
      let imgPath = paths[projectName];

      this.sampleImages[id] = (await import(`${imgPath}`)).default,
      x ++;
    }
  clearCurrentProjectID() {
    localStorage.removeItem(CURRENT_PROJECT_ID);
  }
  clearUserID() {
    localStorage.removeItem(USER_ID);
  }
  clearProjectCache() {
    this.projects = {};
    this.needUpdate =  true;
  }

  async loadSampleProjects() {
    let projects = await firebase.storage().ref("sample_projects").listAll();

    projects.prefixes.forEach( async (folderRef, id) => {   
      let thumbnailRef = folderRef.child("thumbnail.png");
      let xmlRef = folderRef.child("index.xml");

      console.log(xmlRef.exists);

      this.sampleImages[id] = await thumbnailRef.getDownloadURL();
      let xmlBlob = await getFileData(await xmlRef.getDownloadURL());

      this.sampleProjects[id] = {
        name : folderRef.name,
        xml : await xmlBlob.text(),
        id
      }
    });
  }

  getSampleProjects() {
    return Object.values(this.sampleProjects).sort((a,b) => a.xml.length - b.xml.length);
  }
  getSampleImage(id) {
    return this.sampleImages[id];
  }

  getProjects() {
    let out = Object.values(this.projects);
    out.sort((a,b) => (b.timestamp.seconds - a.timestamp.seconds)); // provide same sort as firebase
    return out;
  }

  getProject(id) {
    return this.projects[id];
  }
  getImage(id) {
    return this.images[id];
  }

  update(id, args) {
    if (!this.projects[id]) this.projects[id] = { id };
    this.projects[id] = { ...this.projects[id], ...args };
  }
  updateImage(id,imgData) {
    this.images[id] = imgData;
  }

  delete(id) {
    delete this.projects[id];
  }
  deleteImage(id) {
    delete this.images[id];
  }
}



export default new FirebaseCache();