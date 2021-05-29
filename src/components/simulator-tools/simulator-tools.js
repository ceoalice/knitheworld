import React from 'react';
import PropTypes from 'prop-types';

import PixelCountComponent from './pixel-count.js';
import RowCountComponent from './row-count.js';

import styles from './simulator-tools.css';

import {ReactComponent as downloadStitchButton} from '../../lib/assets/icon--download_stitches.svg';
import Tooltip from '@material-ui/core/Tooltip'; 
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';

const SimulatorToolsComponent = props => {
    return (
      <div className={styles.toolsContainer}>

        <div className={styles.halfContainer}>
          <div className={styles.rowCountContainer}>
            <RowCountComponent />
          </div>
          <div className={styles.pixelCountContainer}>
            <PixelCountComponent />
          </div>
        </div>

        <div className={styles.downloadContainer}>
          <Tooltip title="Download Pattern" placement="bottom">
            <div>
              <IconButton size="small" onClick={props.triggerDownload}>
                <SvgIcon
                  className={styles.downloadButton}
                  component={downloadStitchButton}
                  viewBox="0 0 40 40" // viewbox must match viewbox in svg file
                />
              </IconButton>  
            </div>
          </Tooltip>
        </div>
      </div>
    );
};

SimulatorToolsComponent.propTypes = {
    // setStyleRing: PropTypes.func.isRequired,
    // setStyleStrip: PropTypes.func.isRequired,
    // setStyleKnit: PropTypes.func.isRequired
};

export default SimulatorToolsComponent;
