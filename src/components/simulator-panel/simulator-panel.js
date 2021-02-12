import React from 'react';

import FullscreenButton from '../../containers/fullscreen-button.js';
import Simulator from '../../containers/simulator.js';
import SimulatorTools from '../../containers/simulator-tools.js';
import StartButton from '../../containers/start-button.js';
import DownloadButton from '../../containers/download-button.js'

import styles from './simulator-panel.css';

import knitheworldLogo from './knitheworld-logo.svg';

import ImageButtonComponent from '../image-button/image-button.js';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const SimulatorPanelComponent = props => {
    return (
        <React.Fragment>
          <img
            className={styles.logo}
            src={knitheworldLogo}
            alt="KnitheWorld Logo"
            width={225}
            height={50}
          />
          <div>
            <SimulatorTools />
            <TransformWrapper
              scale={1}
              options={{limitToBounds:false, minScale:0.5}}
              wheel={{step:50}}
              >
              <TransformComponent>
                <Simulator vm={props.vm} />
              </TransformComponent>
            </TransformWrapper>
          </div>
          <p>
            v.2.12.21.0
          </p>
        </React.Fragment>
    );
};

// can add back <FullscreenButton /> inside the return
//

export default SimulatorPanelComponent;
