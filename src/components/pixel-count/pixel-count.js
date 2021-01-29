import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ImageButtonComponent from '../image-button/image-button.js';

import addIcon from './icon--add.svg';
import removeIcon from './icon--remove.svg';

import {
    addPixelNode,
    removePixelNode
} from '../../reducers/pixels.js';

import styles from './pixel-count.css';

const PixelCountComponent = props => {
    return (
        <div className={styles.pixelCountTools}>
            <ImageButtonComponent
                width={30}
                height={30}
                handleClick={props.removePixel}
                src={removeIcon}
            />
            <div className={styles.pixelCount}>
                {props.pixelCount}
            </div>
            <ImageButtonComponent
                width={30}
                height={30}
                handleClick={props.addPixel}
                src={addIcon}
            />
        </div>
    );
};

PixelCountComponent.propTypes = {
    removePixel: PropTypes.func.isRequired,
    addPixel: PropTypes.func.isRequired,
    pixelCount: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
    pixelCount: state.pixels.pixelCount
});

const mapDispatchToProps = dispatch => ({
    addPixel: () => dispatch(addPixelNode()),
    removePixel: () => dispatch(removePixelNode())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PixelCountComponent);
