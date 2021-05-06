import React from 'react';
import SampleProjectsModalComponent from '../components/sample-projects-modal/sample-projects-modal.js';
import { closeSampleProjects } from '../reducers/modals.js';
import { updateProjectName } from '../reducers/project-state.js';

import {connect} from 'react-redux';

import ProjectManager from "../lib/project-manager.js"

class SampleProjectsModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          projects : []
        } 
        this.loadProject = this.loadProject.bind(this);
        this.loadAllProjects = this.loadAllProjects.bind(this);
        this.openProject = this.openProject.bind(this);
    }

    componentDidMount() {
      // https://stackoverflow.com/questions/29421409/how-to-load-all-files-in-a-directory-using-webpack-without-require-statements
      // https://stackoverflow.com/questions/34895800/javascript-restructure-an-array-of-strings-based-on-prefix
      let ref = require.context('../lib/projects', true, /\.(png|xml)$/);
      let files = ref.keys();
      let paths = {};

      for (var i = 0; i < files.length; i++) {
        // "./Blue zig zag/index.xml" => [".", "Blue zig zag", "index.xml"]
        if (files[i].split('/').length != 3) continue;
        
        let projectName = files[i].split('/')[1];
        if (!paths[projectName]) paths[projectName] = [];
        paths[projectName].push(files[i].substring(1));
      }

      this.loadAllProjects(paths);
    }

     async loadProject(xmlPath, imgPath) {
      return {
          xml : (await import(`../lib/projects${xmlPath}`)).default,
          imgData : (await import(`../lib/projects${imgPath}`)).default
      }
    }

     async loadAllProjects(paths) {
      let projects = [];
      let id = 1;
      for (const projectName in paths) {
        let xmlPath, imgPath;
        let isXML = paths[projectName][0].indexOf('xml') > -1;

        if (isXML) [xmlPath, imgPath] = paths[projectName];
        else [imgPath, xmlPath] = paths[projectName];
        
        let project = await this.loadProject(xmlPath, imgPath);
        project.name = projectName;
        project.id = id;
        id++;
        projects.push(project);
      }

      this.setState({projects});
    }

    openProject(xml) {
      ProjectManager.newProject(xml);
      this.props.onCancel();
    }

    render () {
        return (
            <SampleProjectsModalComponent
                onCancel={this.props.onCancel}
                projects={this.state.projects}
                openProject={this.openProject}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeSampleProjects()),
    updateProjectName : (value) => dispatch(updateProjectName(value))
});

export default connect(
    null,
    mapDispatchToProps
)(SampleProjectsModal);