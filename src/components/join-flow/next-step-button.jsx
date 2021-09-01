import {omit}  from "lodash";
import React from 'react';
import PropTypes from 'prop-types';
// const injectIntl = require('react-intl').injectIntl;

// const intl = require('../../lib/intl.jsx');

import CircularProgress from '@material-ui/core/CircularProgress';
import BodyTitle  from './body-title.jsx';

import styles from './next-step-button.scss';

const NextStepButton = props => (
    <button
        className={styles.modalFlushBottomButton}
        disabled={props.waiting}
        type="submit"
        {...omit(props, ['intl', 'text', 'waiting'])}
    >
        {props.waiting ? (
            <CircularProgress className={styles.nextStepSpinner} />
        ) : (
            <div className={styles.stepRow}>
              {/* {props.step
                ?             
                <BodyTitle
                  className={styles.nextStepTitle}
                  title={"Previous"}
                /> 
              : null
              } */}
            <BodyTitle
                className={styles.nextStepTitle}
                title={props.content ? props.content : "Next"
                  // ? props.content : props.intl.formatMessage({id: 'general.next'})
                }
            />
            </div>
        )}
    </button>
);

NextStepButton.propTypes = {
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    // intl: intl.intlShape,
    step: PropTypes.number,
    waiting: PropTypes.bool
};

NextStepButton.defaultProps = {
    waiting: false
};

export default NextStepButton;
