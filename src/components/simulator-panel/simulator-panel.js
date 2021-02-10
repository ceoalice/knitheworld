import React from 'react';

import FullscreenButton from '../../containers/fullscreen-button.js';
import Simulator from '../../containers/simulator.js';
import SimulatorTools from '../../containers/simulator-tools.js';
import StartButton from '../../containers/start-button.js';
import DownloadButton from '../../containers/download-button.js'

import styles from './simulator-panel.css';

import knitheworldLogo from './knitheworld-logo.svg';

import ImageButtonComponent from '../image-button/image-button.js';

const SimulatorPanelComponent = props => {
    return (
        <React.Fragment>
            <Simulator vm={props.vm} />
            <SimulatorTools />
            <div className={styles.start_button}>
              <StartButton vm={props.vm}/>
            </div>
            <div className={styles.download_buton}>
              <DownloadButton vm={props.vm}/>
            </div>
            <div className={styles.logo}>
              <ImageButtonComponent
                  width={225}
                  height={50}
                  handleClick={props.addPixel}
                  src={knitheworldLogo}
                  alt="KnitheWorld Logo"
              />
            </div>
        </React.Fragment>
    );
};

// can add back <FullscreenButton /> inside the return

export default SimulatorPanelComponent;
