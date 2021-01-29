import React from 'react';
import classNames from 'classnames';

import startIcon from './icon--start.svg';
import pauseIcon from './icon--pause.svg';

import styles from './start-button.css';

const StartButtonComponent = props => {
    const stopProp = e => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    const icon = props.projectRunning ? pauseIcon : startIcon;
    return (
        <div
            className={classNames(styles.container, {
                [styles.fullscreen]: props.fullscreenVisible
            })}
            onClick={props.handleClick}
        >
            <img
                className={styles.image}
                draggable={false}
                src={icon}
            />
        </div>
    );
};

export default StartButtonComponent;
