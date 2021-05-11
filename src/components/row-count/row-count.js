import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {ReactComponent as AddIcon} from '../../lib/assets/icon--add.svg';
import {ReactComponent as RemoveIcon} from '../../lib/assets/icon--remove.svg';
import rowIcon from './icon--rows.svg';

import {goToNextRow,removeLastRow} from '../../reducers/pixels.js';

import styles from './row-count.css';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';

const RowCountComponent = props => {
    return (
        <div className={styles.rowCountTools}>
          <div className={styles.rowCount}>
            Rows: 
          </div>
          <IconButton size="small" onClick={props.removeRow}>
            <SvgIcon viewBox="0 0 50 50" component={RemoveIcon} /> 
          </IconButton>
          <div className={styles.rowCount}>
            {props.rowCount}
          </div>
          <IconButton size="small" onClick={props.addRow}>
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
    addRow: () => dispatch(goToNextRow()),
    removeRow: () => dispatch(removeLastRow())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RowCountComponent);
