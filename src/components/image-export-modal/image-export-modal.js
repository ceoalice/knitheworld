import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../../containers/modal';
import styles from './image-export-modal.css';
import Button from "../button/button.js"

const ImageExportModalComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={"Enter File Name"}
        // headerClassName={styles.header}
        headerImage={props.connectionSmallIconURL}
        id="imageExportModal"
        onRequestClose={props.onCancel}
        isRtl={false}
    >
        <div>
          <form id="downloadNameForm" className={styles.body} >
            <label>
              Name:
              <input 
                type="text" 
                name="downloadName" 
                placeholder="MyProject"
                onChange={props.handleInputChange}
                value={props.value}
                />
            </label>
            <Button className={styles.submitButton} onClick={props.handleSubmit}> Submit </Button>
          </form>
        </div>
    </Modal>
);

ImageExportModalComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    handleInputChange : PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onHelp: PropTypes.func
};

// ImageImportModalComponent.defaultProps = {
//     connectingMessage: 'Connecting'
// };

export {
  ImageExportModalComponent as default
};