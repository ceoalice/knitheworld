import React from 'react';
import {connect} from 'react-redux';
import {bindAll} from "lodash";

import {
  openImageImport, 
  openImageExport, 
  openSampleProjects,
  openLocalProjects,
  openSaveAs,
  openShareProject,
  openJoin
} from '../reducers/modals.js';
import { setProjectSaved } from '../reducers/project-state.js';
import { setSignedIn } from "../reducers/user.js";

import NavBarComponent from '../components/navbar/navbar.js';

import VMScratchBlocks from '../lib/blocks.js';
import {ProjectAPI, AuthAPI, UserAPI} from '../lib/api';


class NavBar extends React.Component {
    constructor (props) {
        super(props);

        bindAll(this, [
          'uploadCode',
          'loadCode',
          'newProject',
          'saveProject',
          'saveAsCopy',
          'downloadCode',
          'handleUserStateChange',
          'goToHomePage'
        ]);

        this.fileChooser = React.createRef();
    }

    componentDidMount() {
      AuthAPI.onAuthStateChanged(this.handleUserStateChange);
    }
    
    componentWillUnmount() {
      AuthAPI.removeAuthStateChanged(this.handleUserStateChange);
    }

    async handleUserStateChange( user ) {
      if (user) {
        this.props.setSignedIn({ 
          username : (await UserAPI.getCurrentUsername()).data,
          uid: user.uid
        });
        // console.log('user is logged: ', user.uid);
      } else {
        // console.log('user not logged');
      }
    }

    newProject() {
      ProjectAPI.newProject();
    }

    saveProject () {
      if (ProjectAPI.getCurrentProjectID()) {
        ProjectAPI.saveProject().then(() => {
          this.props.projectSaved();
        });
      } else {
        this.props.openSaveAs();
      }
    }

    saveAsCopy() {

    }

    uploadCode () {
      this.fileChooser.current.click();
    }

    downloadCode() {
      let xml = VMScratchBlocks.getXML();
      // console.log("downloading code");
      var xmlFile = new Blob([xml], { type: "application/xml;charset=utf-8" });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(xmlFile);
      a.download = this.props.currentProjectName + '.xml';
      a.click();
    }

    loadCode (event) {
        if (event.target.files) {
            var reader = new FileReader();
            reader.onload = (e) => {
                ProjectAPI.newProject(e.target.result);
            }
            reader.readAsBinaryString(event.target.files[0]);
        }
    }

    goToHomePage() {
      window.location.assign('/');
    }

    render () {
        const {...componentProps} = this.props;
        return (
            <NavBarComponent
              uploadCode = {this.uploadCode}
              downloadCode = {this.downloadCode}
              fileChooser = {this.fileChooser}
              loadCode = {this.loadCode}
              newProject = {this.newProject}
              saveProject = {this.saveProject}
              saveAsCopy = {this.saveAsCopy}
              goToHomePage = {this.goToHomePage}
              {...componentProps}
            />
        );
    }
}

const mapStateToProps = state => ({
  username: state.user.username,
  signedIn: state.user.userSignedIn,
  currentProjectName: state.projectState.currentProjectName
});

const mapDispatchToProps = dispatch => ({
    openImageImport: () => dispatch(openImageImport()),
    openImageExport: () => dispatch(openImageExport()),
    openLocalProjects: () => dispatch(openLocalProjects()),
    openSampleProjects: () => dispatch(openSampleProjects()),
    openSaveAs: () => dispatch(openSaveAs()),
    openShareProject: () => dispatch(openShareProject()),
    openJoin: () => dispatch(openJoin()),
    setSignedIn: (data) => dispatch(setSignedIn(data)),
    projectSaved : () => dispatch(setProjectSaved(true))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar);
