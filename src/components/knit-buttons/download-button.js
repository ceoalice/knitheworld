import React from 'react';
import PropTypes from 'prop-types';

import ImageButtonComponent from '../image-button/image-button.js';

import downloadButton from './icon--pattern_download.svg';
import downloadCodeButton from './icon--download.svg';
import unravelButton from './icon--unravel.svg';
import downloadStitchButton from './icon--download_stitches.svg';
import uploadCodeButton from './icon--upload_code.svg'

import styles from './download-button.css';

import Tooltip from '@material-ui/core/Tooltip';

const DownloadButtonComponent = props => {
    return (
        <div className={styles.pixelStyleTools}>
          <Tooltip title="Download Images" placement="right">

            <div>
              <ImageButtonComponent
                      width={40}
                      height={40}
                      // handleClick={props.downloadStitches}
                      handleClick={props.openImageExport}
                      src={downloadStitchButton}
                  />
            </div>
          </Tooltip>

          <div style={{paddingTop:18}}></div>

          <Tooltip title="Download File" placement="right">
            <div>
              <ImageButtonComponent
                  width={40}
                  height={40}
                  handleClick={props.downloadCode}
                  src={downloadCodeButton}
              />
            </div>
          </Tooltip>
   
          <Tooltip title="Upload File" placement="right">
            <div> 
              <ImageButtonComponent
                  width={40}
                  height={40}
                  handleClick={props.uploadCode}
                  src={uploadCodeButton}
              />
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
