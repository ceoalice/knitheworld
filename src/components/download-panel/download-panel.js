import React from 'react';

import UploadButton from '../../containers/upload-button.js';
import DownloadButton from '../../containers/download-button.js';
import PixelCountComponent from '../pixel-count/pixel-count.js';

import styles from './download-panel.css';

const DownloadPanelComponent = props => {
    return (
        <React.Fragment>
            <UploadButton />
            <DownloadButton vm={props.vm} />
            <div className={styles.pixelCountContainer}>
                <PixelCountComponent />
            </div>
        </React.Fragment>
    );
};

export default DownloadPanelComponent;
