import React from 'react';
import PropTypes from 'prop-types';

import VM from 'scratch-vm';

import Blocks from '../../containers/blocks.js';
import DownloadButton from '../../containers/download-button.js';
import SimulatorPanelComponent from '../simulator-panel/simulator-panel.js';
import NavBar from "../../containers/navbar.js";
import GUIPanes from "./gui-panes.js";
import ProjectName from "../project-name/project-name.js";

// modals
import ImageImportModal from "../../containers/image-import-modal.js";
import ImageExportModal from "../../containers/image-export-modal.js";
import LocalProjectsModal from "../../containers/local-projects-modal.js";
import SampleProjectsModal from "../../containers/sample-projects-modal.js";
import SaveAsModal from "../../containers/save-as-modal.js";
import ShareModal from "../../containers/share-modal.js";
import CustomProcedures from "../../containers/custom-procedures.js";

import styles from './gui.scss';

const GUIComponent = props => {
    return (
        <React.Fragment>
            <NavBar vm={props.vm} />
     
            { props.sampleProjectsVisible 
              ? <SampleProjectsModal />
              : null
            }
            { props.localProjectsVisible 
              ? <LocalProjectsModal vm={props.vm} />
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
            { props.saveAsVisible
              ? <SaveAsModal />
              : null
            }
            { props.shareProjectVisible
              ? <ShareModal />
              : null
            }
            { props.customProceduresVisible
              ? <CustomProcedures />
              : null
            }

            <GUIPanes>
              <div className={styles.blocksContainer}>
                <ProjectName />
                <Blocks vm={props.vm} />
              </div>
              <div className={styles.simulatorContainer}>
                <SimulatorPanelComponent vm={props.vm} />
              </div>
            </GUIPanes>            

            <p className={styles.version}>
              v.3.2.1.0
            </p>
            <DownloadButton vm={props.vm}/>
        </React.Fragment>
    );
};

GUIComponent.propTypes = {

    vm: PropTypes.instanceOf(VM).isRequired,
    imageImportVisible: PropTypes.bool.isRequired,
    imageExportVisible: PropTypes.bool.isRequired,
    sampleProjectsVisible: PropTypes.bool.isRequired,
    localProjectsVisible: PropTypes.bool.isRequired,
    saveAsVisible: PropTypes.bool.isRequired,
    fullscreenVisible: PropTypes.bool.isRequired,
    shareProjectVisible: PropTypes.bool.isRequired,
    customProceduresVisible: PropTypes.bool.isRequired
};

export default GUIComponent;