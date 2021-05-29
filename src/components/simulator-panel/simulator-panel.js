import React from 'react';

import Simulator from '../../containers/simulator.js';
import SimulatorTools from '../../containers/simulator-tools.js';

import styles from './simulator-panel.css';


import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const SimulatorPanelComponent = props => {
    return (
        <React.Fragment>

          <div className={styles.simToolsContainer}>
           <SimulatorTools />
          </div>
          
          <div className={styles.transformContainer}>
            <TransformWrapper
              scale={1}
              options={{limitToBounds:false, minScale:0.25}}
              wheel={{step:50}}
              >
              <TransformComponent>
                <Simulator vm={props.vm} />
              </TransformComponent>
            </TransformWrapper>
          </div>

          <p className={styles.version}>
            v.3.1.4.0
          </p>
        </React.Fragment>
    );
};

// can add back <FullscreenButton /> inside the return
//

export default SimulatorPanelComponent;
