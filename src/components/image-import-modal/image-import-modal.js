import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../../containers/modal';
import ImageImporter from "./image-importer";
import styles from './image-import-modal.css';

const ImageImportModalComponent = props => (
    <Modal
        noHeader
        className={styles.modalContent}
        id="imageImportModal"
        onRequestClose={props.onCancel}
    >
        <div className={styles.body}>
          <ImageImporter closeModal={props.onCancel}/>
        </div>
    </Modal>
);

ImageImportModalComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onHelp: PropTypes.func
};

export {
  ImageImportModalComponent as default
};