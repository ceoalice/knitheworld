import React from 'react';
import PropTypes from 'prop-types';
import classNames  from "classnames";

import PixelCountComponent from './pixel-count.js';
import RowCountComponent from './row-count.js';

import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '../tooltip/tooltip'; 

import {ReactComponent as downloadStitchIcon} from './icon--download_stitches.svg';
import CameraEnhanceIcon from '@material-ui/icons/CameraEnhance';

import styles from './simulator-tools.css';

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

        <div className={classNames(styles.halfContainer, styles.rightHalf)}>
          <Tooltip title="Save Pattern as Thumbnail" placement="bottom">
              <IconButton size="small" onClick={() => props.savePattern('thumbnail')}>
                <CameraEnhanceIcon style={{color: "white"}} className={styles.icon}/>
              </IconButton>  
          </Tooltip>
          
          {props.showMinecraft
          ? <Tooltip title="Save Pattern as Minecraft Skin" placement="bottom">
              <IconButton size="small" onClick={() => props.savePattern('minecraft')}>
                <SvgIcon className={styles.icon}>
                  <image 
                    href={`${window.location.pathname}static/images/minecraft-icon.png`} 
                    height="100%" width="100%"
                  />
                </SvgIcon>
              </IconButton>
            </Tooltip>
          : null
          }

          <Tooltip title="Download Pattern" placement="bottom">
            <div>
              <IconButton size="small" onClick={() => props.savePattern('download')}>
                <SvgIcon
                  className={styles.icon}
                  component={downloadStitchIcon}
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
    showMinecraft : PropTypes.bool.isRequired,
    savePattern : PropTypes.func.isRequired,
};

export default SimulatorToolsComponent;
