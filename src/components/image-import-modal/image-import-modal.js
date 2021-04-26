import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../../containers/modal';
import ImageImporter from "./image-importer";
import styles from './image-import-modal.css';

const ImageImportModalComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={"Import Image"}
        // headerClassName={styles.header}
        headerImage={props.connectionSmallIconURL}
        id="imageImportModal"
        fullScreen={false}
        onRequestClose={props.onCancel}
        isRtl={false}
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

// ImageImportModalComponent.defaultProps = {
//     connectingMessage: 'Connecting'
// };

export {
  ImageImportModalComponent as default
};