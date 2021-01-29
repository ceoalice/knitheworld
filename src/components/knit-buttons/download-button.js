import React from 'react';

import downloadButton from './icon--pattern_download.svg';

import styles from './download-button.css';

const DownloadButtonComponent = props => {
    return (
        <div
            className={styles.buttonContainer}
            onClick={props.handleClick}
        >
            <img
                className={styles.button}
                draggable={false}
                src={downloadButton}
                width={50}
            />
        </div>
    );
};

export default DownloadButtonComponent;
