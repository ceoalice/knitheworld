import React from 'react';
import PropTypes from 'prop-types';

import VM from 'scratch-vm';

import Blocks from '../../containers/blocks.js';
// import SimulatorModal from '../../containers/simulator-modal.js';
// import WebBTButton from '../../containers/webbt-button.js';
import DownloadButton from '../../containers/download-button.js';

// import StartButton from '../../containers/start-button.js';

import ImageImportModal from "../../containers/image-import-modal.js";
import ImageExportModal from "../../containers/image-export-modal.js";
import LocalProjectsModal from "../../containers/local-projects-modal.js";
import SampleProjectsModal from "../../containers/sample-projects-modal.js";

import SimulatorPanelComponent from '../simulator-panel/simulator-panel.js';

import NavBar from "../../containers/navbar.js"

import styles from './gui.css';

import SplitPane from 'react-split-pane';


const splitPaneStyles = {
  background: '#999',
  width: '10px',
  cursor: 'col-resize',
  margin: '0 0px',
  height: '100%',
  "zIndex" : '1000'
};

const GUIComponent = props => {

    // const classes = useStyles();
    const {...componentProps} = props;
    return (
        <React.Fragment>
            <NavBar />
     
            { props.sampleProjectsVisible 
              ? <SampleProjectsModal />
              : null
            }
            { props.localProjectsVisible 
              ? <LocalProjectsModal />
              : null
            }
            { props.imageImportVisible 
              ? <ImageImportModal />
              : null
            }
            { props.imageExportVisible 
              ? <ImageExportModal />
              : null
            }

            <div 
              // resizerStyle={splitPaneStyles}
              // className={styles.flexbox}
              style={{
                height: 'calc(100vh - var(--topnav-height))',
                width: "100vw",
                display: 'flex',
                flexDirection: 'row'
              }}
              // minSize={100}
              // split="vertical"
            >
              <Blocks vm={props.vm} />
              <div className={styles.simulatorContainer}>
                <SimulatorPanelComponent vm={props.vm} />
              </div>
            </div>

            <DownloadButton vm={props.vm}/>
        </React.Fragment>
    );
};

GUIComponent.propTypes = {

    // downloadCode: PropTypes.func.isRequired,
    // uploadCode: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
    bluetoothConnected: PropTypes.bool.isRequired,
    imageImportVisible: PropTypes.bool.isRequired,
    imageExportVisible: PropTypes.bool.isRequired,
    sampleProjectsVisible : PropTypes.bool.isRequired,
    localProjectsVisible : PropTypes.bool.isRequired,
    fullscreenVisible: PropTypes.bool.isRequired,
    
    // openImageImport : PropTypes.func.isRequired,
    // openImageExport: PropTypes.func.isRequired,
    // openSampleProjects: PropTypes.func.isRequired,
    // openLocalProjects: PropTypes.func.isRequired
};

export default GUIComponent;