import React from 'react';

import styles from './image-item.css';

const ImageItemComponent = props => {
    return (
        <div className={styles.container}>
            <div className={styles.itemOrder}>{props.order}</div>
            <img height={75} src={'data:image/png;base64,' + props.src} />
            <div className={styles.itemName}>
                <p>{props.name}</p>
            </div>
        </div>
    );
};

export default ImageItemComponent;
