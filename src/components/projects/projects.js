import React from 'react';
import PropTypes from 'prop-types';

import Modal from "../../containers/modal.js";
import Button from '@material-ui/core/Button';

import styles from "./projects.scss";

const ProjectViewComponent = props => {

  const handleClick = (e) => {
    console.log("CLICKED")
    if (props.project) window.location.assign(`/gui?projectID=${props.project.id}`);
  }

    return (
      <Modal    
        // noHeader
        noExit
        contentLabel={`"${props.project.name}" by @${props.username}`}
        className={styles.modalContent}
        id="projectView"
        onRequestClose={() => {}}
      >
        <div className={styles.body}>
          <div className={styles.thumbnailContainer}>
            <object
                className={styles.thumbnailImage}
                data={props.thumbnail}
                type="image/png"
              >
                {props.project.name}
            </object>
          </div>

          <div> <Button onClick={handleClick} className={styles.demoButton} > Try Project </Button> </div>
        </div>
      </Modal>
    );
};

ProjectViewComponent.propTypes = {
  project : PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    xml: PropTypes.string.isRequired,
    size: PropTypes.number,
    timestamp: PropTypes.object
  }).isRequired,
  thumbnail : PropTypes.string,
  username : PropTypes.string
}
export default ProjectViewComponent;