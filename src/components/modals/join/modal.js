import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import { closeJoin } from '../../../reducers/modals.js';
import Modal from "../../../containers/modal.js"
import JoinFlow from '../../join-flow/join-flow.jsx';

import styles from "./modal.scss";

const JoinModal = (props) => (
    <Modal    
    noHeader
    className={styles.modalContent}
    id="joinModal"
    onRequestClose={props.closeModal}
    >
      <div className={styles.body}>
        <JoinFlow />
      </div>
    </Modal>
);


JoinModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    onHelp: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeJoin()) 
});

export default connect(
  null,
  mapDispatchToProps
)(JoinModal);