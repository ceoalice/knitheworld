import PropTypes from 'prop-types';
import React from 'react';

import CloseButton from '../close-button/close-button.js';
import styles from './project-item.css';
import classNames from 'classnames';

/* eslint-disable react/prefer-stateless-function */
class ProjectItemComponent extends React.PureComponent {
    render () {
        return (
            <div
                className={classNames(
                    styles.libraryItem,
                    styles.featuredItem,
                    // this.props.extensionId ? styles.libraryItemExtension : null,
                    this.props.hidden ? styles.hidden : null
                )}
                onClick={this.props.onClick}
            >
                <div className={styles.featuredImageContainer}>
                    <img
                        className={styles.featuredImage}
                        src={this.props.iconURL}
                    />
                </div>

                {this.props.insetIconURL ? (
                    <div className={styles.libraryItemInsetImageContainer}>
                        <img
                            className={styles.libraryItemInsetImage}
                            src={this.props.insetIconURL}
                        />
                    </div>
                ) : null}
                
                <div
                    className={styles.featuredText}
                >
                    <span className={styles.libraryItemName}>{this.props.name}</span>
                    <br />
                    <span className={styles.featuredDescription}>{this.props.description}</span>
                </div>
                
                <div className={classNames(styles.closeButton)}>
                    <CloseButton
                        buttonType="trash"
                        size={CloseButton.SIZE_LARGE}
                        onClick={this.props.onClickClose}
                    />
                </div>
            </div>
        )
    }
}
/* eslint-enable react/prefer-stateless-function */


ProjectItemComponent.propTypes = {
    description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),

    disabled: PropTypes.bool,
    extensionId: PropTypes.string,
    featured: PropTypes.bool,
    hidden: PropTypes.bool,
    iconURL: PropTypes.string,
    insetIconURL: PropTypes.string,

    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),

    onClick: PropTypes.func.isRequired,
    onClickClose: PropTypes.func.isRequired,
};

ProjectItemComponent.defaultProps = {
    disabled: false,
    showPlayButton: false
};

export default ProjectItemComponent;
