import React from 'react';
import {connect} from 'react-redux';
import { bindAll } from "lodash";

import { closeSaveAs } from "../../../reducers/modals.js";
import { setProjectSaved } from '../../../reducers/project-state.js';
import ProjectManager from "../../../lib/project-manager.js";
import ImageManager from "../../../lib/image-manager.js";
import Modal from '../../../containers/modal.js';

import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import styles from './modal.scss';

class SaveAsModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          imgData : "",
          projectName : "",
          prevProjectName : ""
        }

        bindAll(this,[
          'handleInputChange',
          'handleSubmit',
          'saveProject',
          'getDefaultImageData',
          'uploadImage',
          'loadImage'
        ]);

        this.fileChooser = React.createRef();
    }

    async componentDidMount() {
      let projectName = String(await ProjectManager.getCurrentProjectName());
      this.setState({ projectName, prevProjectName : projectName})
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

      ProjectManager.saveProject(this.state.projectName).then(() => {
          ImageManager.saveProjectImage(ProjectManager.getCurrentID(),imgData);
          this.props.projectSaved();
      });
    }

    uploadImage () {
      this.fileChooser.current.click();
    }

    getDefaultImageData() {
      const {pixelCount, pixelColors, rowCount} = {...this.props};
      const stitchCanvas = document.createElement('canvas');

      let totalStitches = pixelColors.reduce((a,b) => a + (!b.includes("rgba(") ? 1 : 0), 0)

      stitchCanvas.width = 25*pixelCount+10;
      stitchCanvas.height = 25*(Math.ceil(totalStitches/pixelCount))+10;

      const stitchctx = stitchCanvas.getContext('2d');

      for (let i=0; i<totalStitches; i++) {
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
        const props = {...this.props};
        return (
          <Modal
            className={styles.modalContent}
            contentLabel={"Save Project As..."}
            headerImage={props.connectionSmallIconURL}
            id="saveAsModal"
            onRequestClose={props.closeModal}
          >
            <div>
              <form id="saveAsNameForm" className={styles.body} >
                <label>
                  Project Name:
                  <input 
                    type="text" 
                    name="downloadName" 
                    placeholder={this.state.prevProjectName}
                    onChange={this.handleInputChange}
                    value={this.state.projectName}
                    />
                  <input
                    type="file"
                    className={styles.fileInput}
                    onInput={this.loadImage}
                    ref={this.fileChooser}
                    accept="image/png, image/jpeg"
                  />
                </label>
                <Button className={styles.submitButton} onClick={this.handleSubmit}> Submit </Button>
              </form>
    
              <div className={styles.body}>
                <Button className={styles.submitButton} onClick={this.uploadImage}> Upload Thumbnail </Button>
                {
                  this.state.imgData
                    ? <CheckCircleIcon className={styles.check} fontSize="large" />
                    : null
                }
              </div>
            </div>
          </Modal>
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
    projectSaved : () => dispatch(setProjectSaved(true))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveAsModal);