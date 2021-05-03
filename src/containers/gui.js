import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';

import {setProjectRunState} from '../reducers/project-state.js';
import {clearThePixels} from '../reducers/pixels.js';
import {openImageImport, openImageExport, openSampleProjects, openLocalProjects} from '../reducers/modals.js';

import GUIComponent from '../components/gui/gui.js';

import {downloadThePixels} from '../reducers/pixels.js';
import { updateProjectName , toggleProjectSaved} from '../reducers/project-state.js';


import VMScratchBlocks from '../lib/blocks.js';
import ProjectManager from '../lib/project-manager';

function blocksEqual(a,b) { // need to check 'parent', 'opcode', 'next', 'inputs',  'fields'
  let check = true;

  if (a.opcode !== b.opcode) check = false;
  if (a.parent !== b.parent) check = false;
  if (a.next !== b.next) check = false;


  if (JSON.stringify(a.inputs) !== JSON.stringify(b.inputs)) check = false;
  if (JSON.stringify(a.fields) !== JSON.stringify(b.fields)) check = false;

  // if(a.opcode == "math_whole_number") {
  //   console.log(JSON.stringify(a.fields));
  //   console.log(JSON.stringify(b.fields));
  // }
  if (!check) {
    console.log("BLOCKS ARE DIFFERENT")  
    // console.log("a: ",a)
    // console.log("b: ",b)  
    // console.log("")
  }

  return check;
}

class GUI extends React.Component {
    constructor (props) {
        super(props);
        this.vm = new VM();
        this.state = {
          // blockKeys: [],
          // fieldValues: [],
          // startupToggle : false,
          prevBlocks :  {}
        };
        // this.fileChooser = React.createRef();
        // this.uploadCode = this.uploadCode.bind(this);
        // this.loadCode = this.loadCode.bind(this);
        // this.newProject = this.newProject.bind(this);
        // this.saveProject = this.saveProject.bind(this);
        this.checkProjectChanged = this.checkProjectChanged.bind(this);
       
        ProjectManager.setVM(this.vm); // WITHOUT THIS ProjectManager CAN'T UPDATE REDUX WHEN THINGS CHANGE

        // event passed from ProjectManager
        this.vm.on('PROJECT_NAME_CHANGED', () => {
          // console.log("WHATS GOOD: PROJECT_NAME_CHANGED");
          this.props.updateProjectName(ProjectManager.getCurrentProjectName());
        })

        this.vm.on('PROJECT_IMAGE_CHANGED', () => {
          // console.log("WHATS GOOD: PROJECT_IMAGE_CHANGED");
        })

        this.vm.on('PROJECT_LOADING', () => {
          // console.log("WHATS GOOD: PROJECT_LOADING");
          // this.props.toggleProjectLoading(true);
        })

        // this.vm.on('NIKO_EVENT', (input) => {
          // console.log("WHATS GOOD: NIKO_EVENT", input);
          // this.props.toggleProjectLoading(true);
        // })
    }

    componentDidMount () {
        this.vm.on('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.on('PROJECT_RUN_STOP', this.props.setProjectStopped);
        this.vm.on('PROJECT_CHANGED',this.checkProjectChanged);
        this.props.updateProjectName(ProjectManager.getCurrentProjectName())
    }

    componentWillUnmount () {
        this.vm.removeListener('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.removeListener('PROJECT_RUN_STOP', this.props.setProjectStopped);
        this.vm.removeListener('PROJECT_CHANGED',this.checkProjectChanged);
    }

    checkProjectChanged() {
      // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
      let blocks = JSON.parse(JSON.stringify(this.vm.runtime.targets[0].blocks._blocks)); 
      let blocksEqual = this.allBlocksEqual(blocks); 

      if (!blocksEqual) { // && !this.props.projectLoading // CHANGE HAS OCCURED
        // console.log("updating canvas...");
        this.setState({prevBlocks: blocks});

        if (ProjectManager.getCurrentProjectID()) {
          ProjectManager.saveCurrentProject();
        }

        this.vm.runtime.startHats('event_whenstarted');
      } 
      // else if (blocksEqual && this.props.projectLoading) {
      //   this.setState({prevBlocks: blocks});
      //   this.vm.runtime.startHats('event_whenstarted');
      //   this.props.toggleProjectLoading(false);
      // }
    }

    allBlocksEqual(blocks) {
      var newKeys = Object.keys(blocks).sort();
      var prevKeys = Object.keys(this.state.prevBlocks).sort();
      let keysEqual =  JSON.stringify(newKeys) === JSON.stringify(prevKeys);

      if (!keysEqual) return false;

      for (let key in blocks) {
        // console.log("key: ", key)
        if (!blocksEqual(blocks[key], this.state.prevBlocks[key])) {
          return false
        }
      }
      return true;
    }

    // newProject() {
    //   ProjectManager.newProject();
    //   this.props.updateProjectName("Unsaved Project");
    // }

    // saveProject() {
    //   ProjectManager.saveProject(); 
    //   this.props.updateProjectName(ProjectManager.getCurrentProjectName());
    //   this.props.toggleProjectSaved(true);
    // }

    // downloadCode () {
    //     var xml = VMScratchBlocks.getXML();
    //     console.log("downloading code");
    //     //console.log(VMScratchBlocks.getXML());
    //     var xmlFile = new Blob([xml], { type: "application/xml;charset=utf-8" });
    //     //console.log(xmlFile)
    //     var a = document.createElement('a');
    //     a.href = URL.createObjectURL(xmlFile);
    //     a.download = 'My Project' + '.xml';
    //     a.click();
    // }

    // uploadCode () {
    //     //console.log(this.fileChooser);
    //     this.fileChooser.current.click();
    // }

    // loadCode (event) {
    //     var projectName = event.target.files[0].name.split('.xml')[0];
    //     if (event.target.files) {
    //         var reader = new FileReader();
    //         reader.onload = (e) => {
    //             // console.log(e.target.result);
    //             // VMScratchBlocks.loadXML(e.target.result);
    //             ProjectManager.newProject(e.target.result);
    //             this.props.updateProjectName("Unsaved Project");
    //             // document.getElementById('project-name-input').value = projectName;
    //         }
    //         reader.readAsBinaryString(event.target.files[0]);
    //     }
    // }

    render () {
        const {...componentProps} = this.props;
        return (
            <GUIComponent
              vm={this.vm}
              // downloadCode = {this.downloadCode}
              // uploadCode = {this.uploadCode}
              // fileChooser = {this.fileChooser}
              // loadCode = {this.loadCode}

              // newProject = {this.newProject}
              // saveProject = {this.saveProject}
              {...componentProps}
            />
        );
    }
}

const mapStateToProps = state => ({
    imageImportVisible: state.modals.imageImport,
    imageExportVisible: state.modals.imageExport,
    sampleProjectsVisible : state.modals.sampleProjects,
    localProjectsVisible : state.modals.localProjects,
    fullscreenVisible: state.modals.fullscreenSimulator,
    bluetoothConnected: state.bluetooth.connectionStatus,
    images: state.images
});

const mapDispatchToProps = dispatch => ({
    // openImageImport : () => dispatch(openImageImport()),
    // openImageExport: () => dispatch(openImageExport()),
    // openLocalProjects: () => dispatch(openLocalProjects()),
    // openSampleProjects: () => dispatch(openSampleProjects()),
    setProjectRunning: () => dispatch(setProjectRunState(true)),
    setProjectStopped: () => dispatch(setProjectRunState(false)),
    clearPixels: () => dispatch(clearThePixels()),
    downloadPixels: () => dispatch(downloadThePixels(true)),
    updateProjectName : (value) => dispatch(updateProjectName(value)),
    toggleProjectSaved : (value) => dispatch(toggleProjectSaved(value))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GUI);
