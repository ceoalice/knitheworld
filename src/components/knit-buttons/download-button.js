import React from 'react';
import PropTypes from 'prop-types';

import ImageButtonComponent from '../image-button/image-button.js';

import downloadButton from './icon--pattern_download.svg';
import downloadCodeButton from './icon--download.svg';
import unravelButton from './icon--unravel.svg';
import downloadStitchButton from './icon--download_stitches.svg';

import styles from './download-button.css';

const DownloadButtonComponent = props => {
    return (
        <div className={styles.pixelStyleTools}>
            <ImageButtonComponent
                width={40}
                height={40}
                handleClick={props.downloadPixels}
                src={downloadButton}
            />
            <ImageButtonComponent
                width={40}
                height={40}
                handleClick={props.downloadCode}
                src={downloadCodeButton}
            />
            <ImageButtonComponent
                width={40}
                height={40}
                handleClick={props.unravelPixels}
                src={unravelButton}
            />
            <ImageButtonComponent
                width={40}
                height={40}
                handleClick={props.downloadStitches}
                src={downloadStitchButton}
            />
        </div>
    );
};

DownloadButtonComponent.propTypes = {
    downloadPixels: PropTypes.func.isRequired,
    downloadCode: PropTypes.func.isRequired,
    unravelPixels: PropTypes.func.isRequired,
    downloadStitches: PropTypes.func.isRequired
};

export default DownloadButtonComponent;
