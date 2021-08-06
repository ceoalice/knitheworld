import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Modal from '../../../containers/modal'; '../../containers/modal';
import styles from './modal.scss';

import ProjectAPI from "../../../lib/project-api.js";
import { closeShareProject } from '../../../reducers/modals.js';

import { 
  TwitterShareButton, 
  TwitterIcon, 
  FacebookShareButton,
  FacebookIcon, 
  EmailShareButton, 
  EmailIcon } from "react-share";

const ShareProjectModal = props => {
  const isSharable = Boolean(ProjectAPI.getCurrentID());
  const url = window.location.origin + `/projects/${ProjectAPI.getCurrentID()}`;

  return (
    <Modal
        className={styles.modalContent}
        contentLabel={"Share Project"}
        headerImage={props.connectionSmallIconURL}
        id="imageExportModal"
        onRequestClose={props.onCancel}
        isRtl={false}
    >
       {
         isSharable 
         ?  (
          <div className={styles.body}>
            <div> {url} </div>
            <div>
            <EmailShareButton 
              url={url} subject="Check Out My Project" 
              body="Check out this project I made on KnitheWorld!" seperator="<br>">
              <EmailIcon size={32} round={true} />
            </EmailShareButton> 

            <FacebookShareButton 
              url={url} subject="Check Out My Project" 
              body="Check out this project I made on KnitheWorld!" seperator="<br>">
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton> 

            <TwitterShareButton 
              url={url} subject="Check Out My Project" 
              body="Check out this project I made on KnitheWorld!" seperator="<br>">
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton> 
            </div>
          </div>
         )

         : <div className={styles.body}>
           must save project before sharing
           </div>
        } 
    </Modal>
  );
}

ShareProjectModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onHelp: PropTypes.func
};


const mapDispatchToProps = dispatch => ({
  onCancel: () => dispatch(closeShareProject()) 
});

export default connect(
  null,
  mapDispatchToProps
)(ShareProjectModal);