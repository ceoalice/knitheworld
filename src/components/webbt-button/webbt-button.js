import React from 'react';

import bluetoothIconNormal from './icon--bluetooth.svg';
import bluetoothIconConnected from './icon--bluetooth-connected.svg';

import styles from './webbt-button.css';

const WebBTButtonComponent = props => {
    return (
        <div
            className={styles.buttonContainer}
            onClick={props.handleClick}
        >
            <img
                className={styles.button}
                draggable={false}
                src={bluetoothIconNormal}
                width={40}
            />
        </div>
    );
};

export default WebBTButtonComponent;
