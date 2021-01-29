import React from 'react';

import styles from './image-button.css';

const ImageButtonComponent = props => {
    return (
        <div
            className={styles.buttonContainer}
            onClick={props.handleClick}
        >
            <img
                className={styles.button}
                draggable={false}
                src={props.src}
                width={props.width}
                height={props.height}
            />
        </div>
    );
};

export default ImageButtonComponent;
