import React from 'react';
import PropTypes from 'prop-types';
import VM from 'scratch-vm';

import Blocks from '../../containers/blocks.js';
import SimulatorPanelComponent from '../simulator-panel/simulator-panel.js';
import NavBar from "../../containers/navbar.js";
import GUIPanes from "./gui-panes.js";
import ProjectName from "../project-name/project-name.js";
import Modals from "../modals/modals.js";

import styles from './gui.scss';

const GUIComponent = props => {
    return (
        <React.Fragment>
            <NavBar vm={props.vm} />
            <Modals vm={props.vm} />
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
              v.4.1.0.0
            </p>
        </React.Fragment>
    );
};

GUIComponent.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default GUIComponent;