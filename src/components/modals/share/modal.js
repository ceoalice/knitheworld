import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from "react-router-dom";

import Modal from '../../../containers/modal'; '../../containers/modal';
import styles from './modal.scss';

import {ProjectAPI} from "../../../lib/api";
import { closeShareProject } from '../../../reducers/modals.js';

import { 
  TwitterShareButton, TwitterIcon, 
  FacebookShareButton, FacebookIcon, 
  EmailShareButton, EmailIcon 
} from "react-share";

const ShareModal = props => {
  const { match } = props;

  const isUser = match && (match.path == "/users/:id");
  const isGUI = match && (match.path == "/gui");

  const url = isGUI 
    ? window.location.origin + `/projects/${ProjectAPI.getCurrentProjectID()}`
    : window.location.href;

  const header = isUser 
    ? "Share User"
    : "Share Project";

  const title = isUser
    ? "Check Out This User"
    : "Check Out This Project";

  const message = isUser 
    ? "Check out this user on Knitheworld!"
    : "Check out this project on KnitheWorld!";

  const isNotSharable = isGUI && !Boolean(ProjectAPI.getCurrentProjectID());

  const copyURL = () =>  {
    navigator.clipboard.writeText(url)
    .then(() => {
      window.alert("URL copied to clipboard.")
    })
    .catch(err => {
      window.alert('Something went wrong: ', err);
    })
  }

  return (
    <Modal
        className={styles.modalContent}
        contentLabel={header}
        headerImage={props.connectionSmallIconURL}
        id="imageExportModal"
        onRequestClose={props.onCancel}
        isRtl={false}
    >
       {
         isNotSharable 
         ? <div className={styles.body}>
           <h3> Must save project in order to sharing. </h3>
           </div>
         : (
          <div className={styles.body}>
            <div className={styles.urlContainer}> 
              <div className={styles.url}> {url} </div> 
              <div className={styles.copyButton} onClick={copyURL}> COPY </div>
            </div>

            <div>
              <EmailShareButton 
                className={styles.shareIcon}
                url={url} subject={title}
                body={message} seperator="<br>">
                <EmailIcon size={32} round={true} />
              </EmailShareButton> 

              <FacebookShareButton 
                className={styles.shareIcon}
                url={url} subject={title}
                body={message} seperator="<br>">
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton> 

              <TwitterShareButton 
                className={styles.shareIcon}
                url={url} subject={title}
                body={message} seperator="<br>">
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton> 
            </div>

          </div>
         )
        } 
    </Modal>
  );
}

ShareModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onHelp: PropTypes.func
};


const mapDispatchToProps = dispatch => ({
  onCancel: () => dispatch(closeShareProject()) 
});

export default connect(
  null,
  mapDispatchToProps
)(withRouter(ShareModal));