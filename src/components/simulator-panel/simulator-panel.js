import React from 'react';

// import FullscreenButton from '../../containers/fullscreen-button.js';
import Simulator from '../../containers/simulator.js';
import SimulatorTools from '../../containers/simulator-tools.js';
// import StartButton from '../../containers/start-button.js';
// import DownloadButton from '../../containers/download-button.js'

import styles from './simulator-panel.css';

// import knitheworldLogo from './knitheworld-logo.svg';

// import ImageButtonComponent from '../image-button/image-button.js';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const SimulatorPanelComponent = props => {
    return (
        <React.Fragment>

          <div>
           <SimulatorTools />
          </div>
          
          {/* <img
            className={styles.logo}
            src={knitheworldLogo}
            alt="KnitheWorld Logo"
          />  */}

          <div className={styles.transformContainer}>
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

          <p style={{ margin: "5px", right: 0, bottom: 0, zIndex : 1000, position:"absolute"}}>
            v.3.1.1.0
          </p>
        </React.Fragment>
    );
};

// can add back <FullscreenButton /> inside the return
//

export default SimulatorPanelComponent;
