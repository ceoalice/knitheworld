import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';

import {setProjectRunState} from '../reducers/project-state.js';
import {clearThePixels} from '../reducers/pixels.js';
import {openImageImport, openImageExport, openSampleProjects, openLocalProjects} from '../reducers/modals.js';

import GUIComponent from '../components/gui/gui.js';

import {downloadThePixels} from '../reducers/pixels.js';
import { updateProjectName , toggleProjectSaved, toggleProjectLoading} from '../reducers/project-state.js';


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
          prevBlocks :  null,
          totalStacks : 1,
          stacksLoaded : 1
        };
        this.checkProjectChanged = this.checkProjectChanged.bind(this);
        this.handleProjectLoading = this.handleProjectLoading.bind(this);
        this.handleProjectName = this.handleProjectName.bind(this);
       
        ProjectManager.setVM(this.vm); // WITHOUT THIS ProjectManager CAN'T UPDATE REDUX WHEN THINGS CHANGE

        // event passed from ProjectManager

        this.vm.on('PROJECT_IMAGE_CHANGED', () => {
          // console.log("WHATS GOOD: PROJECT_IMAGE_CHANGED");
        })

    }

    componentDidMount () {
        this.vm.on('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.on('PROJECT_RUN_STOP', this.props.setProjectStopped);

        this.vm.on('PROJECT_CHANGED',this.checkProjectChanged);
        this.vm.on('PROJECT_NAME_CHANGED', this.handleProjectName);
        this.vm.on('PROJECT_LOADING', this.handleProjectLoading);
    }



    componentWillUnmount () {
        this.vm.removeListener('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.removeListener('PROJECT_RUN_STOP', this.props.setProjectStopped);

        this.vm.removeListener('PROJECT_CHANGED',this.checkProjectChanged);
        this.vm.removeListener('PROJECT_NAME_CHANGED', this.handleProjectName);
        this.vm.removeListener('PROJECT_LOADING', this.handleProjectLoading);
    }

    handleProjectName() { 
      this.props.updateProjectName(ProjectManager.getCurrentProjectName());
    }


    handleProjectLoading(stacks) {
      console.log("TOTAL STACKS: ", stacks.length);
      this.props.startProjectLoading();
      this.setState({ totalStacks: stacks.length, stacksLoaded : 1});
    }

    checkProjectChanged() {
      // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
      let blocks = JSON.parse(JSON.stringify(this.vm.runtime.targets[0].blocks._blocks)); 
      
      // blank workspace loaded need to wait for more blocks or bug occured
      if (Object.keys(blocks).length == 0) return;

      let blocksEqual = this.allBlocksEqual(blocks);

      // console.log(Object.keys(blocks).length, blocksEqual);

      if (!blocksEqual && !this.props.projectLoading) { // CHANGE HAS OCCURED & PROJECT NOT LOADING
        // console.log("updating canvas...");
        if (ProjectManager.getCurrentProjectID()) {
          ProjectManager.saveCurrentProject();
        }

        this.vm.runtime.startHats('event_whenstarted');
      }
      else if (blocksEqual && this.props.projectLoading) {
        // console.log("STACK LOADED");
        if (this.state.totalStacks <= this.state.stacksLoaded) {
          // console.log("ALL STACKS LOADED")
          this.vm.runtime.startHats('event_whenstarted');
          this.props.stopProjectLoading();
        } else {
          this.setState({ stacksLoaded : this.state.stacksLoaded + 1});
        }
      }

      this.setState({prevBlocks: blocks});
    }

    allBlocksEqual(blocks) {
      if (this.state.prevBlocks === null) return false;
      // if (Object.keys(blocks).length == 0 && Object.keys(this.state.prevBlocks).length == 0) return false;

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

    render () {
        const {...componentProps} = this.props;
        return (
            <GUIComponent
              vm={this.vm}
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
    saveAsVisible : state.modals.saveAs,
    projectLoading : state.projectState.projectLoading,
    fullscreenVisible: state.modals.fullscreenSimulator,
    bluetoothConnected: state.bluetooth.connectionStatus,
    images: state.images
});

const mapDispatchToProps = dispatch => ({    
    setProjectRunning: () => dispatch(setProjectRunState(true)),
    setProjectStopped: () => dispatch(setProjectRunState(false)),
    clearPixels: () => dispatch(clearThePixels()),
    downloadPixels: () => dispatch(downloadThePixels(true)),
    updateProjectName : (value) => dispatch(updateProjectName(value)),
    startProjectLoading: () => dispatch(toggleProjectLoading(true)),
    stopProjectLoading: () => dispatch(toggleProjectLoading(false)), 
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GUI);
