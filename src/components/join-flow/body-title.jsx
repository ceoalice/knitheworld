import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './body.scss';

const BodyTitle = ({
    className,
    title
}) => (
    <div
        className={classNames(
            styles['title'],
            className
        )}
    >
        {title}
    </div>
);

BodyTitle.propTypes = {
    className: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default BodyTitle;
