import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../../containers/modal';
import styles from './share-modal.css';
// import Button from "../button/button.js";

import ProjectManger from "../../lib/project-manager.js";
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon, EmailShareButton, EmailIcon } from "react-share";

const ShareModalComponent = props => {
  // console.log(window.location.host)
  const isSharable = Boolean(ProjectManger.getCurrentID());
  const url = "https://youtube.com" + `?projectID=${ProjectManger.getCurrentID()}`;

  return (
    <Modal
        className={styles.modalContent}
        contentLabel={"Share Project"}
        // headerClassName={styles.header}
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

ShareModalComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onHelp: PropTypes.func
};

export {
  ShareModalComponent as default
};