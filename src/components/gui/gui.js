import React from 'react';
import PropTypes from 'prop-types';

import VM from 'scratch-vm';

import Blocks from '../../containers/blocks.js';
import SimulatorModal from '../../containers/simulator-modal.js';
import WebBTButton from '../../containers/webbt-button.js';
import DownloadButton from '../../containers/download-button.js';

import StartButton from '../../containers/start-button.js';

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
            <div className={styles.topnav}>
                <a href="#" onClick={props.downloadPixels}>
                  Save Canvas
                </a>
                <a href="#" onClick={props.downloadCode}>
                  Save Project
                </a>
                <a href="#" onClick={props.uploadCode}>
                  Load Project
                </a>
                <input
                    type="file"
                    className={styles.fileInput}
                    onInput={props.loadCode}
                    ref={props.fileChooser}
                />
            </div>
            <Blocks vm={props.vm} />
            <div className={styles.simulatorContainer}>
                {props.fullscreenVisible ? null : panel}
            </div>
            <DownloadButton vm={props.vm}/>
        </React.Fragment>
    );
};

GUIComponent.propTypes = {
    downloadPixels: PropTypes.func.isRequired,
    downloadCode: PropTypes.func.isRequired,
    uploadCode: PropTypes.func.isRequired,
    bluetoothConnected: PropTypes.bool.isRequired,
    fullscreenVisible: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default GUIComponent;

// {props.fullscreenVisible ? (
//     <SimulatorModal
//         {...componentProps}
//     />
// ) : null}
