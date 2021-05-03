import React from 'react';
import {connect} from 'react-redux';

import {openImageImport, openImageExport, openSampleProjects, openLocalProjects} from '../reducers/modals.js';

import NavBarComponent from '../components/navbar/navbar.js';

import {downloadThePixels} from '../reducers/pixels.js';
import { updateProjectName , toggleProjectSaved} from '../reducers/project-state.js';


import VMScratchBlocks from '../lib/blocks.js';
import ProjectManager from '../lib/project-manager';


class NavBar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          blockKeys: [],
          fieldValues: [],
          startupToggle : false,
          prevBlocks :  {}
        };

        this.fileChooser = React.createRef();
        this.uploadCode = this.uploadCode.bind(this);
        this.loadCode = this.loadCode.bind(this);
        this.newProject = this.newProject.bind(this);
        this.saveProject = this.saveProject.bind(this);
    }

    newProject() {
      ProjectManager.newProject();
      this.props.updateProjectName("Unsaved Project");
    }

    saveProject() {
      ProjectManager.saveProject(); 
      this.props.updateProjectName(ProjectManager.getCurrentProjectName());
      this.props.toggleProjectSaved(true);
    }

    downloadCode () {
        var xml = VMScratchBlocks.getXML();
        console.log("downloading code");
        //console.log(VMScratchBlocks.getXML());
        var xmlFile = new Blob([xml], { type: "application/xml;charset=utf-8" });
        //console.log(xmlFile)
        var a = document.createElement('a');
        a.href = URL.createObjectURL(xmlFile);
        a.download = 'My Project' + '.xml';
        a.click();
    }

    uploadCode () {
        //console.log(this.fileChooser);
        this.fileChooser.current.click();
    }

    loadCode (event) {
        var projectName = event.target.files[0].name.split('.xml')[0];
        if (event.target.files) {
            var reader = new FileReader();
            reader.onload = (e) => {
                // console.log(e.target.result);
                // VMScratchBlocks.loadXML(e.target.result);
                ProjectManager.newProject(e.target.result);
                this.props.updateProjectName("Unsaved Project");
                // document.getElementById('project-name-input').value = projectName;
            }
            reader.readAsBinaryString(event.target.files[0]);
        }
    }

    render () {
        const {...componentProps} = this.props;
        return (
            <NavBarComponent
              downloadCode = {this.downloadCode}
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

// const mapStateToProps = state => ({
//     imageImportVisible: state.modals.imageImport,
//     imageExportVisible: state.modals.imageExport,
//     sampleProjectsVisible : state.modals.sampleProjects,
//     localProjectsVisible : state.modals.localProjects,
//     fullscreenVisible: state.modals.fullscreenSimulator,
//     bluetoothConnected: state.bluetooth.connectionStatus,
//     images: state.images
// });

const mapDispatchToProps = dispatch => ({
    openImageImport: () => dispatch(openImageImport()),
    openImageExport: () => dispatch(openImageExport()),
    openLocalProjects: () => dispatch(openLocalProjects()),
    openSampleProjects: () => dispatch(openSampleProjects()),
    // setProjectRunning: () => dispatch(setProjectRunState(true)),
    // setProjectStopped: () => dispatch(setProjectRunState(false)),
    // clearPixels: () => dispatch(clearThePixels()),
    // downloadPixels: () => dispatch(downloadThePixels(true)),
    updateProjectName : (value) => dispatch(updateProjectName(value)),
    toggleProjectSaved : (value) => dispatch(toggleProjectSaved(value))
});

export default connect(
    null,
    mapDispatchToProps
)(NavBar);
