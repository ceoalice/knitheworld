import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../../containers/modal';

import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import styles from './save-as-modal.scss';

const SaveAsModalComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={"Save Project As..."}
        // headerClassName={styles.header}
        headerImage={props.connectionSmallIconURL}
        id="saveAsModal"
        onRequestClose={props.onCancel}
        isRtl={false}
    >
        <div>
          <form id="saveAsNameForm" className={styles.body} >
            <label>
              Project Name:
              <input 
                type="text" 
                name="downloadName" 
                placeholder={props.prevProjectName}
                onChange={props.handleInputChange}
                value={props.value}
                />
              <input
                type="file"
                className={styles.fileInput}
                onInput={props.loadImage}
                ref={props.fileChooser}
                accept="image/png, image/jpeg"
              />
            </label>
            <Button className={styles.submitButton} onClick={props.handleSubmit}> Submit </Button>
          </form>

          <div className={styles.body}>
            <Button className={styles.submitButton} onClick={props.uploadImage}> Upload Thumbnail </Button>

            {
              props.imgDataGiven
              ? <CheckCircleIcon className={styles.check} fontSize="large" />
              : null
            }
          </div>
        </div>
    </Modal>
);

SaveAsModalComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    handleInputChange : PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onHelp: PropTypes.func,
    imgDataGiven : PropTypes.bool
};

export {
  SaveAsModalComponent as default
};