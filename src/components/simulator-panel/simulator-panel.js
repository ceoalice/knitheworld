import React from 'react';

import FullscreenButton from '../../containers/fullscreen-button.js';
import Simulator from '../../containers/simulator.js';
import SimulatorTools from '../../containers/simulator-tools.js';
import StartButton from '../../containers/start-button.js';

const SimulatorPanelComponent = props => {
    return (
        <React.Fragment>
            <Simulator vm={props.vm} />
            <SimulatorTools />
            <StartButton
                vm={props.vm}
            />
            <FullscreenButton />
        </React.Fragment>
    );
};

export default SimulatorPanelComponent;
