import React from 'react';
import PropTypes from 'prop-types';

// import ImageButtonComponent from '../image-button/image-button.js';

import downloadButton from './icon--pattern_download.svg';
import unravelButton from './icon--unravel.svg';

import {ReactComponent as downloadStitchButton} from './icon--download_stitches.svg';
import {ReactComponent as downloadCodeButton} from './icon--download.svg';
import {ReactComponent as uploadCodeButton} from './icon--upload_code.svg';

import styles from './download-button.css';

import Tooltip from '@material-ui/core/Tooltip'; 
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';

const DownloadButtonComponent = props => {
    return (
        <div className={styles.pixelStyleTools}>
          <Tooltip title="Download Images" placement="right">

            <div>
            <IconButton size="small" onClick={props.openImageExport}>
              <SvgIcon
                fontSize="large"
                component={downloadStitchButton}
                viewBox="0 0 40 40"
              />
            </IconButton>  
            </div>
          </Tooltip>

          <div style={{paddingTop:18}}></div>

          <Tooltip title="Download File" placement="right">
            <div>
            <IconButton size="small" onClick={props.downloadCode}>
              <SvgIcon
                fontSize="large"
                component={downloadCodeButton}
                viewBox="0 0 40 40"
              />
            </IconButton>

              {/* <ImageButtonComponent
                  width={40}
                  height={40}
                  handleClick={props.downloadCode}
                  src={downloadCodeButton}
              /> */}
            </div>
          </Tooltip>
   
          <Tooltip title="Upload File" placement="right">
            <div> 

            <IconButton size="small" onClick={props.uploadCode}>
              <SvgIcon
                fontSize="large"
                component={uploadCodeButton}
                viewBox="0 0 40 40"
              />
            </IconButton>
              {/* <ImageButtonComponent
                  width={40}
                  height={40}
                  handleClick={props.uploadCode}
                  src={uploadCodeButton}
              /> */}
            </div>
          </Tooltip>
            <input
                type="file"
                className={styles.fileInput}
                onInput={props.loadCode}
                ref={props.fileChooser}
            />
        </div>
    );
};

DownloadButtonComponent.propTypes = {
    downloadPixels: PropTypes.func.isRequired,
    downloadCode: PropTypes.func.isRequired,
    unravelPixels: PropTypes.func.isRequired,
    openImageExport: PropTypes.func.isRequired,
    // downloadStitches: PropTypes.func.isRequired,
    uploadCode: PropTypes.func.isRequired
};

export default DownloadButtonComponent;
