import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {ReactComponent as AddIcon} from '../../lib/assets/icon--add.svg';
import {ReactComponent as RemoveIcon} from '../../lib/assets/icon--remove.svg';
import stitchIcon from './icon--stitches.svg';

import {addPixelNode, removePixelNode} from '../../reducers/pixels.js';

import styles from './pixel-count.css';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';

const PixelCountComponent = props => {
    return (
        <div className={styles.pixelCountTools}>
          <div className={styles.pixelCount}>
            Columns: 
          </div>
          <IconButton size="small" onClick={props.removePixel}>
            <SvgIcon viewBox="0 0 50 50" component={RemoveIcon} /> 
          </IconButton>
          
          <div className={styles.pixelCount}>
            {props.pixelCount}
          </div>
          <IconButton size="small" onClick={props.addPixel}>
            <SvgIcon viewBox="0 0 50 50" component={AddIcon} /> 
          </IconButton>
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
