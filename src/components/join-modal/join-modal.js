import PropTypes from 'prop-types';
import React from 'react';
import Modal from "../../containers/modal.js"
import JoinFlow from '../join-flow/join-flow.jsx';

import styles from "./join-modal.scss";

const JoinModal = ({
    createProjectOnComplete,
    onCompleteRegistration,
    onRequestClose,
    ...modalProps
}) => (
    <Modal    
    noHeader
    className={styles.modalContent}
    id="joinModal"
    onRequestClose={onRequestClose}
    {...modalProps}
    >
      <div className={styles.body}>
        <JoinFlow  
            createProjectOnComplete={createProjectOnComplete}
            onCompleteRegistration={onCompleteRegistration}
        />
      </div>
    </Modal>
);

JoinModal.propTypes = {
    createProjectOnComplete: PropTypes.bool,
    onCompleteRegistration: PropTypes.func,

    // onRequestClose: PropTypes.func,
    // showCloseButton: PropTypes.bool,

    onRequestClose: PropTypes.func.isRequired,
    onHelp: PropTypes.func
};

export default JoinModal;