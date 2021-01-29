import React from 'react';
import classNames from 'classnames';

import startIcon from './icon--start.svg';
// import pauseIcon from './icon--pause.svg';

import styles from './download-button.css';

const DownloadButtonComponent = props => {
    // const icon = props.projectRunning ? pauseIcon : startIcon;
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
                src={startIcon}
            />
        </div>
    );
};

export default DownloadButtonComponent;
