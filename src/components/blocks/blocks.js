import React from 'react';
import PropTypes from 'prop-types';

import styles from './blocks.css';

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
