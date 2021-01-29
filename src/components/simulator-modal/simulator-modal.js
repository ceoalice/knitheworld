import React from 'react';

import closeIcon from './icon--close.svg';
import addIcon from './icon--add.svg';

import StartButton from '../../containers/start-button.js';
import FullscreenButton from '../../containers/fullscreen-button.js';
import Simulator from '../../containers/simulator.js';

import styles from './simulator-modal.css';

const SimulatorModalComponent = props => {
    return (
        <div className={styles.body}>
            <FullscreenButton
                fullscreenVisible={true}
            />
            <Simulator vm={props.vm} />
            <StartButton
                fullscreenVisible={props.fullscreenVisible}
                vm={props.vm}
            />
        </div>
    );
};

export default SimulatorModalComponent;
