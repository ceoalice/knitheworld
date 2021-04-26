import React from 'react';
import ImageImportModalComponent from '../components/image-export-modal/image-export-modal.js';
import { closeImageExport } from '../reducers/modals.js';
import { changeDownloadName , downloadTheStitches} from '../reducers/pixels.js';

import {connect} from 'react-redux';

class ImageExportModal extends React.Component {
    constructor (props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      this.props.changeName(value);
    }

    handleSubmit(event) {
      this.props.downloadStitches();
      this.props.closeModal();
      event.preventDefault();
    }

    render () {
        return (
            <ImageImportModalComponent
                onCancel={this.props.closeModal}
                value={this.props.downloadName}
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                {...this.props}
            />
        );
    }
}

const mapStateToProps = state => ({
  downloadName : state.pixels.downloadingStitchesName
})

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch(closeImageExport()),
    changeName: (value) => dispatch(changeDownloadName(value)),
    downloadStitches: () => dispatch(downloadTheStitches(true))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageExportModal);
