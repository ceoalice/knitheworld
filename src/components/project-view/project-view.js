import React from 'react';

import Modal from "../../containers/modal.js";

import styles from "./project-view.scss";

const ProjectViewComponent = props => {
    return (
      <Modal    
        noHeader
        noExit
        contentLabel={"Project View"}
        className={styles.modalContent}
        id="projectView"
        onRequestClose={props.closeModal}
      >
        <div className={styles.body}>
          HELLO PROJECT VIEW
        </div>
      </Modal>
    );
};

export default ProjectViewComponent;