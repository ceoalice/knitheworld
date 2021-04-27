import React from 'react';
import PropTypes from 'prop-types';

import VM from 'scratch-vm';

import Blocks from '../../containers/blocks.js';
import SimulatorModal from '../../containers/simulator-modal.js';
import WebBTButton from '../../containers/webbt-button.js';
import DownloadButton from '../../containers/download-button.js';

import StartButton from '../../containers/start-button.js';

import ImageImportModal from "../../containers/image-import-modal.js";
import ImageExportModal from "../../containers/image-export-modal.js";
import LocalProjectsModal from "../../containers/local-projects-modal.js";
import SampleProjectsModal from "../../containers/sample-projects-modal.js";

import SimulatorPanelComponent from '../simulator-panel/simulator-panel.js';
import DownloadPanelComponent from '../download-panel/download-panel.js';

import styles from './gui.css';

import knitheworldLogo from './knitheworld-logo.svg';

const GUIComponent = props => {
    const {...componentProps} = props;
    const panel = props.bluetoothConnected ?
        <DownloadPanelComponent vm={props.vm} /> :
        <SimulatorPanelComponent vm={props.vm} />;
    return (
        <React.Fragment>
            {/* <div className={styles.topnav}>
                <a role="button" style={{cursor:'pointer'}} onClick={props.openImageExport}>
                  Save Canvas
                </a>
                <a href="#" onClick={props.downloadCode}>
                  Save Project
                </a>
                <a href="#" onClick={props.uploadCode}>
                  Load Project
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={props.openLocalProjects}>
                  My Projects
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={props.openSampleProjects}>
                  Examples
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={props.openImageImport}>
                  Upload Image
                </a>

                <input
                    type="file"
                    className={styles.fileInput}
                    onInput={props.loadCode}
                    ref={props.fileChooser}
                />
            </div> */}

            <div className={styles.topnav}>
                <a href="#" onClick={props.newProject}>
                  New
                </a>
                <a href="#" onClick={props.saveProject}>
                  Save
                </a>
                <a href="#" onClick={props.uploadCode}>
                  Upload File
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={props.openImageImport}>
                  Upload Image
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={props.openLocalProjects}>
                  My Projects
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={props.openSampleProjects}>
                  Examples
                </a>
                <input
                    type="file"
                    className={styles.fileInput}
                    onInput={props.loadCode}
                    ref={props.fileChooser}
                />
            </div>

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

            <Blocks vm={props.vm} />
            <div className={styles.simulatorContainer}>
                {props.fullscreenVisible ? null : panel}
            </div>
            <DownloadButton vm={props.vm}/>
        </React.Fragment>
    );
};

GUIComponent.propTypes = {

    downloadCode: PropTypes.func.isRequired,
    uploadCode: PropTypes.func.isRequired,
    bluetoothConnected: PropTypes.bool.isRequired,
    imageImportVisible: PropTypes.bool.isRequired,
    imageExportVisible: PropTypes.bool.isRequired,
    sampleProjectsVisible : PropTypes.bool.isRequired,
    localProjectsVisible : PropTypes.bool.isRequired,
    fullscreenVisible: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
    openImageImport : PropTypes.func.isRequired,
    openImageExport: PropTypes.func.isRequired,
    openSampleProjects: PropTypes.func.isRequired,
    openLocalProjects: PropTypes.func.isRequired
};

export default GUIComponent;