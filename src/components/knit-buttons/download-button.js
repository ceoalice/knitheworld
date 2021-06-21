import React from 'react';
import PropTypes from 'prop-types';

import {ReactComponent as downloadCodeButton} from '../../lib/assets/icon--download.svg';
import {ReactComponent as uploadCodeButton} from '../../lib/assets/icon--upload_code.svg';

import styles from './download-button.css';

import Tooltip from '../tooltip/tooltip.js'; 

import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';

const DownloadButtonComponent = props => {
    return (
        <div className={styles.pixelStyleTools}>

          <Tooltip title="Download File" placement="right">
            <div>
            <IconButton size="small" onClick={props.downloadCode}>
              <SvgIcon
                className={styles.button}
                component={downloadCodeButton}
                viewBox="0 0 40 40"
              />
            </IconButton>
            </div>
          </Tooltip>
   
          <Tooltip title="Upload File" placement="right">
            <div> 
            <IconButton size="small" onClick={props.uploadCode}>
              <SvgIcon
                className={styles.button}
                component={uploadCodeButton}
                viewBox="0 0 40 40"
              />
            </IconButton>
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
