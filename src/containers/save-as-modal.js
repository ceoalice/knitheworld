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
        this.getDefaultImageData = this.getDefaultImageData.bind(this);

        this.uploadImage = this.uploadImage.bind(this);
        this.loadImage = this.loadImage.bind(this);
    }

    componentDidMount() {
      this.setState({prevProjectName : ProjectManager.getCurrentProjectName()})
    }

    componentDidUpdate() {
      // console.log(this.state)
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      this.setState({projectName : value});
    }

    handleSubmit(event) {
      this.saveProject();
      this.props.closeModal();
      event.preventDefault();
    }

    saveProject() {
      let imgData = (this.state.imgData == "") ? this.getDefaultImageData() : this.state.imgData;
      ProjectManager.saveProject(this.state.projectName, imgData); 
    }

    uploadImage () {
      this.fileChooser.current.click();
    }

    getDefaultImageData() {
      const {pixelCount, pixelColors, rowCount} = {...this.props};
      const stitchCanvas = document.createElement('canvas');
      let stitchCount = pixelCount * rowCount;

      let totalStitches = pixelColors.reduce((a,b) => a + (!b.includes("rgba(") ? 1 : 0), 0)

      stitchCanvas.width = 25*pixelCount+10;
      stitchCanvas.height = 25*(Math.ceil(totalStitches/pixelCount))+10;

      const stitchctx = stitchCanvas.getContext('2d');

      for (let i=0; i<stitchCount; i++) {
        stitchctx.fillStyle = pixelColors[i];
        let currentRow = Math.floor(i/pixelCount);
        stitchctx.drawStitch(25*(i%pixelCount), 25*currentRow, 20);
      }

      return stitchCanvas.toDataURL();
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
                imgDataGiven={Boolean(this.state.imgData)}
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

const mapStateToProps = state => ({
  pixelCount: state.pixels.pixelCount,
  pixelColors: state.pixels.pixelColors,
  rowCount: state.pixels.rowCount,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch(closeSaveAs()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveAsModal);
