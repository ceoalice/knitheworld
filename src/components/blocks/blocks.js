import React from 'react';
import styles from './blocks.scss';

const BlocksComponent = props => {
    const {
        containerRef,
        ...componentProps
    } = props;
    return React.createElement('div', {
        className: styles.blocks,
        ref: containerRef,
        ...componentProps
    }, props.children);
};

export default BlocksComponent;
