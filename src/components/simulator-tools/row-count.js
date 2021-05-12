import React, { useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {ReactComponent as AddIcon} from '../../lib/assets/icon--add.svg';
import {ReactComponent as RemoveIcon} from '../../lib/assets/icon--remove.svg';
// import rowIcon from './icon--rows.svg';

import {goToNextRow,removeLastRow} from '../../reducers/pixels.js';

import styles from './simulator-tools.css';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Input from '@material-ui/core/Input';

const RowCountComponent = props => {
  const [rowCount, setRowCount] = useState(props.rowCount);
  useEffect(() => setRowCount(props.rowCount), [props.rowCount]);
  
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
            <SvgIcon viewBox="0 0 50 50" component={RemoveIcon} /> 
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
            <SvgIcon viewBox="0 0 50 50" component={AddIcon} /> 
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
