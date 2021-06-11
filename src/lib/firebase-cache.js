class FirebaseCache {
  constructor () {
    this.needUpdate =  true; // if needUpdate is true, firebase must be called to pull data

    this.sampleProjects = {}; //  object maping project ID to sample project
    this.projects = {}; // object maping project ID to project

    this.sampleImages = {}; //  object maping project ID to sample project
    this.images = {}; // object maping project ID to project

    // sample projects need to be loaded just once and stored in cache
    this.loadSampleProjects();
    this.loadSampleImages();
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
  }

  async loadSampleProjects() {
    let paths = this.getFilePaths('xml');
    let x = 1;
    for (const projectName in paths) {
      let id = `sampleProject${x}`;
      let xmlPath = paths[projectName];
       
      this.sampleProjects[id] = {
        xml: (await import(`${xmlPath}`)).default, 
        name: projectName, 
        id
      };
      x ++;
    }
  }

  getFilePaths(type) {
    // https://stackoverflow.com/questions/29421409/how-to-load-all-files-in-a-directory-using-webpack-without-require-statements
    // https://stackoverflow.com/questions/34895800/javascript-restructure-an-array-of-strings-based-on-prefix
    let files =  type === 'png' 
      ? require.context('./projects', true, /\.png$/).keys()
      : require.context('./projects', true, /\.xml$/).keys();

    let paths = {};

    files.forEach(filePath => {
      let s = filePath.split('/'); // "./Blue zig zag/index.xml" => [".", "Blue zig zag", "index.png"]
      paths[s[1]] = `./projects/${filePath.substring(2)}`;
    })

    return paths;
  }

  getSampleProjects() {
    return Object.values(this.sampleProjects);
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