
import React from 'react';
import PropTypes from 'prop-types';

import Modal from "../../containers/modal.js";
import HelpIcon from '@material-ui/icons/Help';

import styles from "./404.scss";


const NotFoundComponent = props => {

  return (
    <Modal    
      noHeader
      noExit
      noOverlay
      className={styles.modal}
      id="notFound"
      onRequestClose={() => {}}
    >
      <HelpIcon fontSize="large" />
      <h1>
        {props.title}
      </h1>
      <h3 className={styles.message}>
        {props.message}
      </h3>
      <h4>
        <a href="/"> Go To Home Page </a>
      </h4>
    </Modal>
  );
};

NotFoundComponent.propTypes = {
  title : PropTypes.string.isRequired,
  message : PropTypes.string.isRequired,
}

export default NotFoundComponent;

