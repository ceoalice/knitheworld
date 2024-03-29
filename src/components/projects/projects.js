import React from 'react';
import PropTypes from 'prop-types';

import NavBar from "../../containers/navbar.js";
import Modals from "../modals/modals.js";

import Modal from "../../containers/modal.js";

import Button from '@material-ui/core/Button';

import styles from "./projects.scss";

const ProjectViewComponent = props => {

  const handleClick = (e) => {
    if (props.project) window.location.assign(`/gui?projectID=${props.project.id}`);
  }

    return (
      <React.Fragment>
        <div className={styles.container}>
          <NavBar vm={props.vm} />
          <Modals vm={props.vm} />

          <Modal    
            noExit
            noOverlay
            contentLabel={
              <div>
                "{props.project.name}" by <a href={`../users/${props.uid}`}>@{props.username}</a> 
              </div>
              }
            className={styles.modal}
            id="projectView"
            onRequestClose={() => {}}
          >
            <div className={styles.body}>
              <div className={styles.thumbnailContainer}>
                <img
                    alt={props.project.name} 
                    className={styles.thumbnail}
                    src={props.thumbnail || "/static/images/placeholder-image.png"}
                    type="image/png"
                  />
              </div>

              <div> <Button onClick={handleClick} className={styles.demoButton} > Try Project </Button> </div>
            </div>
          </Modal>
        </div>
      </React.Fragment>
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
  username : PropTypes.string,
  uid : PropTypes.string,
}
export default ProjectViewComponent;