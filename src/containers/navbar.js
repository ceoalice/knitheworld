import React from 'react';
import {connect} from 'react-redux';

import {
  openImageImport, 
  openImageExport, 
  openSampleProjects,
  openLocalProjects,
  openSaveAs,
  openShareProject
} from '../reducers/modals.js';

import NavBarComponent from '../components/navbar/navbar.js';

import {downloadThePixels} from '../reducers/pixels.js';
import { updateProjectName , setProjectSaved} from '../reducers/project-state.js';


import VMScratchBlocks from '../lib/blocks.js';
import ProjectManager from '../lib/project-manager';


class NavBar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
        };

        this.fileChooser = React.createRef();
        this.uploadCode = this.uploadCode.bind(this);
        this.loadCode = this.loadCode.bind(this);
        this.newProject = this.newProject.bind(this);
        this.saveProject = this.saveProject.bind(this);
    }

    newProject() {
      ProjectManager.newProject();
    }

    saveProject () {
      
      if (ProjectManager.getCurrentID()) {
        ProjectManager.saveProject().then(() => {
          this.props.projectSaved();
        });
      } else {
        this.props.openSaveAs();
      }
    }

    uploadCode () {
        //console.log(this.fileChooser);
        this.fileChooser.current.click();
    }

    loadCode (event) {
        if (event.target.files) {
            var reader = new FileReader();
            reader.onload = (e) => {
                // console.log(e.target.result);
                // VMScratchBlocks.loadXML(e.target.result);
                ProjectManager.newProject(e.target.result);
                // document.getElementById('project-name-input').value = projectName;
            }
            reader.readAsBinaryString(event.target.files[0]);
        }
    }

    render () {
        const {...componentProps} = this.props;
        return (
            <NavBarComponent
              // downloadCode = {this.downloadCode}
              uploadCode = {this.uploadCode}
              fileChooser = {this.fileChooser}
              loadCode = {this.loadCode}
              newProject = {this.newProject}
              saveProject = {this.saveProject}
              {...componentProps}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    openImageImport: () => dispatch(openImageImport()),
    openImageExport: () => dispatch(openImageExport()),
    openLocalProjects: () => dispatch(openLocalProjects()),
    openSampleProjects: () => dispatch(openSampleProjects()),
    openSaveAs: () => dispatch(openSaveAs()),
    openShareProject: () => dispatch(openShareProject()),
    updateProjectName : (value) => dispatch(updateProjectName(value)),
    projectSaved : () => dispatch(setProjectSaved(true))
});

export default connect(
    null,
    mapDispatchToProps
)(NavBar);
