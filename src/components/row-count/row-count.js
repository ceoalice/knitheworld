import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ImageButtonComponent from '../image-button/image-button.js';

import addIcon from './icon--add.svg';
import removeIcon from './icon--remove.svg';

import {
    goToNextRow,
    removeLastRow
} from '../../reducers/pixels.js';

import styles from './row-count.css';

const RowCountComponent = props => {
    return (
        <div className={styles.rowCountTools}>
            <ImageButtonComponent
                width={30}
                height={30}
                handleClick={props.removeRow}
                src={removeIcon}
            />
            <div className={styles.rowCount}>
                {props.rowCount}
            </div>
            <ImageButtonComponent
                width={30}
                height={30}
                handleClick={props.addRow}
                src={addIcon}
            />
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
