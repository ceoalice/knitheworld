import React from 'react';
import PropTypes from 'prop-types';

import VM from 'scratch-vm';

import Blocks from '../../containers/blocks.js';
import SimulatorModal from '../../containers/simulator-modal.js';
import WebBTButton from '../../containers/webbt-button.js';
import DownloadButton from '../../containers/download-button.js';

import SimulatorPanelComponent from '../simulator-panel/simulator-panel.js';
import DownloadPanelComponent from '../download-panel/download-panel.js';

import styles from './gui.css';

const GUIComponent = props => {
    const {...componentProps} = props;
    const panel = props.bluetoothConnected ?
        <DownloadPanelComponent vm={props.vm} /> :
        <SimulatorPanelComponent vm={props.vm} />;
    return (
        <React.Fragment>
            <Blocks vm={props.vm} />
            <div className={styles.simulatorContainer}>
                {props.fullscreenVisible ? null : panel}
            </div>
            <WebBTButton />
            <DownloadButton />
            {props.fullscreenVisible ? (
                <SimulatorModal
                    {...componentProps}
                />
            ) : null}
        </React.Fragment>
    );
};

GUIComponent.propTypes = {
    bluetoothConnected: PropTypes.bool.isRequired,
    fullscreenVisible: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default GUIComponent;
