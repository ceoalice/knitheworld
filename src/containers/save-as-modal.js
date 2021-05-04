import React from 'react';
import {connect} from 'react-redux';
import SaveAsModalComponent from '../components/save-as-modal/save-as-modal.js';
import { closeSaveAs } from '../reducers/modals.js';

import ProjectManager from "../lib/project-manager.js";

class SaveAsModal extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
          imgData : "",
          projectName : "",
          prevProjectName : ""
        }
        this.fileChooser = React.createRef();
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.saveProject = this.saveProject.bind(this);

        this.uploadImage = this.uploadImage.bind(this);
        this.loadImage = this.loadImage.bind(this);
    }

    componentDidMount() {
      this.setState({prevProjectName : ProjectManager.getCurrentProjectName()})
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      this.setState({projectName : value});
    }

    handleSubmit(event) {
      // console.log("SAVED AS");

      this.saveProject();
      this.props.closeModal();
      event.preventDefault();
    }

    saveProject() {
      ProjectManager.saveProject(this.state.projectName, this.state.imgData); 
    }

    uploadImage () {
      //console.log(this.fileChooser);
      this.fileChooser.current.click();
    }

    componentDidUpdate() {
      console.log(this.state)
    }


    loadImage (event) {
        if (event.target.files) {
            var reader = new FileReader();
            reader.onload = (e) => {
                // console.log(e.target.result);
                this.setState({imgData : e.target.result});
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    render () {
        return (
            <SaveAsModalComponent
                onCancel={this.props.closeModal}
                value={this.state.projectName}
                prevProjectName={this.state.prevProjectName}
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                uploadImage = {this.uploadImage}
                fileChooser = {this.fileChooser}
                loadImage = {this.loadImage}
                {...this.props}
            />
        );
    }
}

// const mapStateToProps = state => ({
//   downloadName : state.pixels.downloadingStitchesName
// })

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch(closeSaveAs()),
});

export default connect(
    null,
    mapDispatchToProps
)(SaveAsModal);
