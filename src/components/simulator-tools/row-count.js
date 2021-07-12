import React, { useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';

import {goToNextRow,removeLastRow} from '../../reducers/pixels.js';

import styles from './simulator-tools.css';

const RowCountComponent = props => {
  const [rowCount, setRowCount] = useState(props.rowCount);

  const updateRowCount = (val) => {
    setRowCount(val);
    localStorage.setItem("rowCount",val);
  };

  useEffect(() =>  updateRowCount(props.rowCount), [props.rowCount]);
  
  const handleBlur = () => {
    if (rowCount > 0) {
      if (rowCount < props.rowCount) props.removeRow(props.rowCount-rowCount);
      else if (rowCount > props.rowCount) props.addRow(rowCount-props.rowCount);
    } else {
      setRowCount(props.rowCount);
    }
  }
  const handlePress = (e) => {
    if (e.key === 'Enter') document.activeElement.blur(); // unfocuses the element
  }
  const handleChange = (e) => {
    setRowCount(e.target.value);
  }
   
    return (
        <div className={styles.counterContainer}>
          <div className={styles.counter}>
            Rows: 
          </div>
          <IconButton size="small" onClick={() => props.removeRow(1)}>
            <RemoveCircleIcon style={{color:'white'}} /> 
          </IconButton>
          <Input
            className={styles.counter}
            onBlur={handleBlur}
            onKeyPress={handlePress}
            onChange={handleChange}
            value={rowCount}
            style={{width: 50}}
            type="number"
          />
          <IconButton size="small" onClick={() => props.addRow(1)}>
            <AddCircleIcon style={{color:'white'}} /> 
          </IconButton>
        </div>
    );
};

RowCountComponent.propTypes = {
    removeRow: PropTypes.func.isRequired,
    addRow: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
    rowCount: state.pixels.rowCount
});

const mapDispatchToProps = dispatch => ({
    addRow: (value) => dispatch(goToNextRow(value)),
    removeRow: (value) => dispatch(removeLastRow(value))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RowCountComponent);
