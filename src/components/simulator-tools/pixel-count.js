import React, { useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';

import {addPixelNode, removePixelNode} from '../../reducers/pixels.js';

import styles from './simulator-tools.css';

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
          <RemoveCircleIcon style={{color:'white'}} /> 
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
          <AddCircleIcon style={{color:'white'}} /> 
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
