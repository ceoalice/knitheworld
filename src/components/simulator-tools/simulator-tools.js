import React from 'react';
import PropTypes from 'prop-types';

import ImageButtonComponent from '../image-button/image-button.js';
import PixelCountComponent from '../pixel-count/pixel-count.js';

import ringIcon from './icon--ring.svg';
import stripIcon from './icon--strip.svg';
// 12.16.20 new icon addition
import knitIcon from './icon--knit.svg';

import styles from './simulator-tools.css';

const SimulatorToolsComponent = props => {
    return (
        <>
        <div className={styles.pixelCountContainer}>
            <PixelCountComponent />
        </div>
        <div className={styles.pixelStyleTools}>
            <ImageButtonComponent
                width={40}
                height={40}
                handleClick={props.setStyleRing}
                src={ringIcon}
            />
            <ImageButtonComponent
                width={40}
                height={40}
                handleClick={props.setStyleStrip}
                src={stripIcon}
            />
            <ImageButtonComponent
                width={40}
                height={40}
                handleClick={props.setStyleKnit}
                src={knitIcon}
            />
        </div>
        </>
    );
};

SimulatorToolsComponent.propTypes = {
    setStyleRing: PropTypes.func.isRequired,
    setStyleStrip: PropTypes.func.isRequired,
    setStyleKnit: PropTypes.func.isRequired
};

export default SimulatorToolsComponent;
