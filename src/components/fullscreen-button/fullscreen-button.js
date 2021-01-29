import React from 'react';
import classNames from 'classnames';

import fullscreenIcon from './icon--fullscreen.svg';
import unfullscreenIcon from './icon--unfullscreen.svg';

import styles from './fullscreen-button.css';

const FullscreenButtonComponent = props => {
    const icon = props.fullscreenVisible ? unfullscreenIcon : fullscreenIcon;
    const preventDefault = e => {e.preventDefault()};
    return (
        <div
            className={classNames(styles.container, {
                [styles.fullscreen]: props.fullscreenVisible
            })}
            onClick={props.handleClick}
            onMouseDown={preventDefault}
        >
            <img
                draggable={false}
                className={styles.startButton}
                src={icon}
            />
        </div>
    );
};

export default FullscreenButtonComponent;
