import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './body.scss';

const BodyInnerContent = ({
    children,
    className
}) => (
    <div
        className={classNames(
            styles['inner-content'],
            className
        )}
    >
        {children}
    </div>
);

BodyInnerContent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

export default BodyInnerContent;