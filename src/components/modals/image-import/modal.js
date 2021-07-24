import React from 'react';
import {connect} from 'react-redux';

import ImageImporter from "../../../containers/image-importer.js";
import Modal from '../../../containers/modal';

import { closeImageImport } from '../../../reducers/modals.js';

import styles from './modal.scss';

const ImageImportModal = (props) => (
    <Modal
      noHeader
      className={styles.modalContent}
      id="imageImportModal"
      onRequestClose={props.closeModal}
    >
        <div className={styles.body}>
          <ImageImporter closeModal={props.closeModal} />
        </div>
    </Modal>
  );

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch(closeImageImport()) 
});

export default connect(
    null,
    mapDispatchToProps
)(ImageImportModal);