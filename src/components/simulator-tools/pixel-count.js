import React, { useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {ReactComponent as AddIcon} from '../../lib/assets/icon--add.svg';
import {ReactComponent as RemoveIcon} from '../../lib/assets/icon--remove.svg';
// import stitchIcon from './icon--stitches.svg'; 

import {addPixelNode, removePixelNode} from '../../reducers/pixels.js';

import styles from './simulator-tools.css';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Input from '@material-ui/core/Input';

const PixelCountComponent = props => {
  const [pixelCount, setPixelCount] = useState(props.pixelCount);

  const updatePixelCount = (val) => {
    setPixelCount(val);
    localStorage.setItem("pixelCount",val);
  };

  useEffect(() =>  updatePixelCount(props.pixelCount), [props.pixelCount]);

  const handleBlur = () => {
    if (pixelCount > 0) {
      if (pixelCount < props.pixelCount) props.removePixel(props.pixelCount-pixelCount);
      else if (pixelCount > props.pixelCount) props.addPixel(pixelCount-props.pixelCount);
    } else {
      setPixelCount(props.pixelCount);
    }
  } 
  const handlePress = (e) => {
    if (e.key === 'Enter') document.activeElement.blur(); // unfocuses the element
  }
  const handleChange = (e) => {
    setPixelCount(e.target.value);
  }

  return (
      <div className={styles.counterContainer}>
        <div className={styles.counter}>
          Columns: 
        </div>
        <IconButton size="small" onClick={() => props.removePixel(1)}>
          <SvgIcon viewBox="0 0 50 50" component={RemoveIcon} /> 
        </IconButton>
        <Input
          className={styles.counter}
          onBlur={handleBlur}
          onKeyPress={handlePress}
          onChange={handleChange}
          value={pixelCount}
          style={{width: 50}}
          type="number"
        />
        <IconButton size="small" onClick={() => props.addPixel(1)}>
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
    addPixel: (value) => dispatch(addPixelNode(value)),
    removePixel: (value) => dispatch(removePixelNode(value))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PixelCountComponent);
