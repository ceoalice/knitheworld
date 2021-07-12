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
      onRequestClose={props.onCancel}
    >
        <div className={styles.body}>
          <ImageImporter />
        </div>
    </Modal>
  );

const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeImageImport()) 
});

export default connect(
    null,
    mapDispatchToProps
)(ImageImportModal);