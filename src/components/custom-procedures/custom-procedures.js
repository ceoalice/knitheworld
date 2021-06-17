import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.js';

import booleanInputIcon from './icon--boolean-input.svg';
import textInputIcon from './icon--text-input.svg';
import colorInputIcon from "./icon--color-input.svg";
import labelIcon from './icon--label.svg';

import styles from './custom-procedures.css';

const messages = {
    myblockModalTitle: {
        defaultMessage: 'Make a Block',
        description: 'Title for the modal where you create a custom block.',
        id: 'gui.customProcedures.myblockModalTitle'
    }
};

const CustomProcedures = props => (
    <Modal
        id={"customProceduresModal"}
        className={styles.modalContent}
        contentLabel={messages.myblockModalTitle.defaultMessage}
        onRequestClose={props.onCancel}
    >
        <div
            className={styles.workspace}
            ref={props.componentRef}
        />
        <div className={styles.body}>
            <div className={styles.optionsRow}>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddTextNumber}
                >
                    <img
                        className={styles.optionIcon}
                        src={textInputIcon}
                    />
                    <div className={styles.optionTitle}>
                      Add an input
                    </div>
                    <div className={styles.optionDescription}>
                      number or text
                    </div>
                </div>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddColor}
                >
                    <img
                        className={styles.optionIcon}
                        src={colorInputIcon}
                    />
                    <div className={styles.optionTitle}>
                      Add an input
                    </div>
                    <div className={styles.optionDescription}>
                      color
                    </div>
                </div>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddBoolean}
                >
                    <img
                        className={styles.optionIcon}
                        src={booleanInputIcon}
                    />
                    <div className={styles.optionTitle}>
                      Add an input
                    </div>
                    <div className={styles.optionDescription}>
                      boolean
                    </div>
                </div>
                <div
                    className={styles.optionCard}
                    role="button"
                    tabIndex="0"
                    onClick={props.onAddLabel}
                >
                    <img
                        className={styles.optionIcon}
                        src={labelIcon}
                    />
                    <div className={styles.optionTitle}>
                      Add a label
                        {/* <FormattedMessage
                            defaultMessage="Add a label"
                            description="Label for button to add a label"
                            id="gui.customProcedures.addALabel"
                        /> */}
                    </div>
                </div>
            </div>
            <div className={styles.checkboxRow}>
                <label>
                    <input
                        checked={props.warp}
                        type="checkbox"
                        onChange={props.onToggleWarp}
                    /> 
                    Run without screen refresh
                </label>
            </div>
            <div className={styles.buttonRow}>
                <button
                    className={styles.cancelButton}
                    onClick={props.onCancel}
                >
                  Cancel
                </button>
                <button
                    className={styles.okButton}
                    onClick={props.onOk}
                >
                  OK
                </button>
            </div>
        </div>
    </Modal>
);

CustomProcedures.propTypes = {
    componentRef: PropTypes.func.isRequired,
    // intl: intlShape,
    onAddBoolean: PropTypes.func.isRequired,
    onAddLabel: PropTypes.func.isRequired,
    onAddTextNumber: PropTypes.func.isRequired,
    onAddColor: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onToggleWarp: PropTypes.func.isRequired,
    warp: PropTypes.bool.isRequired
};

export default CustomProcedures;
