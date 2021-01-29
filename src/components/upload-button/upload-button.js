import React from 'react';
import classNames from 'classnames';

import uploadIcon from './icon--upload.svg';

import styles from './upload-button.css';

const UploadButtonComponent = props => {
    const stopProp = e => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
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
                src={uploadIcon}
            />
        </div>
    );
};

export default UploadButtonComponent;
