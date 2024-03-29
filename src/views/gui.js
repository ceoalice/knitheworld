import React from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import VM from 'scratch-vm';
import {Provider} from 'react-redux';

import GUIComponent from '../components/gui/gui.js';

import { 
  setProjectRunState, 
  updateProjectName, 
  setProjectSaved, 
  toggleProjectLoading
} from '../reducers/project-state.js';
import {
  activateCustomProcedures
} from '../reducers/custom-procedures';
import  {
  clearThePixels,
} from '../reducers/pixels.js';

import store from "../store.js";

import VMScratchBlocks from '../lib/blocks.js';
import BlockParser from "../lib/parser.js";

import {ProjectAPI, SuggestAPI} from '../lib/api';

import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

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
    // console.log("BLOCKS ARE DIFFERENT")
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
        this.vm.setTurboMode(true);
        this.state = {
          prevBlocks :  null,
          totalStacks : 1,
          stacksLoaded : 1
        };
        this.checkProjectChanged = this.checkProjectChanged.bind(this);
        this.handleProjectLoading = this.handleProjectLoading.bind(this);
        this.handleProjectName = this.handleProjectName.bind(this);

    }

    componentDidMount () {
        VMScratchBlocks.setCallbackProcedure(this.props.onActivateCustomProcedures);
        this.vm.on('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.on('PROJECT_RUN_STOP', this.props.setProjectStopped);

        this.vm.on('PROJECT_CHANGED',this.checkProjectChanged);
        this.vm.on('PROJECT_NAME_CHANGED', this.handleProjectName);
        this.vm.on('PROJECT_LOADING', this.handleProjectLoading);
        window.addEventListener("beforeunload", this.handleBeforeUnload);
    }

    componentWillUnmount () {
        this.vm.removeListener('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.removeListener('PROJECT_RUN_STOP', this.props.setProjectStopped);

        this.vm.removeListener('PROJECT_CHANGED',this.checkProjectChanged);
        this.vm.removeListener('PROJECT_NAME_CHANGED', this.handleProjectName);
        this.vm.removeListener('PROJECT_LOADING', this.handleProjectLoading);
        window.removeEventListener("beforeunload", this.handleBeforeUnload);
    }

    async handleProjectName() { 
      if (!ProjectAPI.getCurrentProjectID()) {
        this.props.updateProjectName(ProjectAPI.defaultProjectName);
      } else {
        let projectName = await ProjectAPI.getProjectName(ProjectAPI.getCurrentProjectID());
        this.props.updateProjectName(projectName);
      }
    }

    handleBeforeUnload(e) {
      // warn site reloading on non-development url
      if (window.location.hostname != "localhost") { // don't need unload warning in development
        e = e || window.event;
        // For IE and Firefox prior to version 4
        if (e) {
            e.returnValue = 'Sure?';
        }
        // For Safari
        return 'Sure?';
      }
    }

    handleProjectLoading() {
      this.props.startProjectLoading();
    }

    checkProjectChanged() {
      // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
      let blocksObj = JSON.parse(JSON.stringify(this.vm.runtime.targets[0].blocks._blocks)); 
      // blank workspace loaded need to wait for more blocks or bug occured
      if (Object.keys(blocksObj).length == 0) return;

      let isDragging = VMScratchBlocks.getWorkspace().isDragging(); 

      if (!isDragging && !this.allBlocksEqual(blocksObj)) { 
        // NOTICABLE CHANGE HAS OCCURED IN WORKSPACE 
        // NEED TO RERENDER SIM FROM MAIN STACK
        // console.log("updating canvas...");
        this.vm.runtime.startHats('event_whenstarted');

        // blocks changed might need to get new set of autosuggestiongs
        // FIGURE OUT NEW SET OF AUTOSUGGESTED BLOCKS BASED ON PROJECT
        const blocks = BlockParser.parse(VMScratchBlocks.getXML());
      
          if (blocks.primary.length > 1) {
            let lastBlock = blocks.primary[blocks.primary.length - 1];

            if (Array.isArray(lastBlock) && blocks.primary.length > 2)  {
              lastBlock = blocks.primary[blocks.primary.length - 2];
            }

            // console.log({lastBlock});
            SuggestAPI.suggest(lastBlock).then((res) => {
              this.vm.emit("SUGGEST_EVENT", res.data);
            })
          }
 

      }

      // CHECK IF WORKSPACE CODE HAS CHANGED AND NEEDS TO BE SAVED AGAIN
      if (ProjectAPI.getCurrentProjectID()) {
        ProjectAPI.XMLChanged().then((changed) => {
          if (changed) {
            this.props.setProjectSaved(false);
          } else if (!this.props.projectSaved) {
            this.props.setProjectSaved(true);
          }
        });
      }

      // save most current block data when not dragging
      if (!isDragging) {
        this.setState({prevBlocks: blocksObj});
      }
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
    projectLoading : state.projectState.projectLoading,
    projectSaved : state.projectState.projectSaved,
    images: state.images
});

const mapDispatchToProps = dispatch => ({    
    setProjectRunning: () => dispatch(setProjectRunState(true)),
    setProjectStopped: () => dispatch(setProjectRunState(false)),
    clearPixels: () => dispatch(clearThePixels()),
    updateProjectName : (value) => dispatch(updateProjectName(value)),
    startProjectLoading: () => dispatch(toggleProjectLoading(true)),
    stopProjectLoading: () => dispatch(toggleProjectLoading(false)), 
    setProjectSaved: (value) => dispatch(setProjectSaved(value)),
    onActivateCustomProcedures: (data, callback) => {
      dispatch(activateCustomProcedures(data, callback));
    }
});

ReactDOM.render(
  // <React.StrictMode>
      <Provider store={store}>
        <Router>
          <Route path="/gui" component={connect(mapStateToProps,mapDispatchToProps)(GUI)}/>
        </Router>
      </Provider>
  // </React.StrictMode>,
  , document.getElementById('root'));