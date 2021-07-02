import classNames from 'classnames';
import {bindAll} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

// const FormattedMessage = require('react-intl').FormattedMessage;
// const {injectIntl, intlShape} = require('react-intl');

import JoinFlowStep from './join-flow-step.jsx';

import styles from './join-flow-steps.scss';

class RegistrationErrorStep extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSubmit'
        ]);
    }
    componentDidMount () {
        // if (this.props.sendAnalytics) {
        //     this.props.sendAnalytics('join-error');
        // }
    }
    handleSubmit (e) {
        // JoinFlowStep includes a <form> that handles a submit action.
        // But here, we're not really submitting, so we need to prevent
        // the form from navigating away from the current page.
        e.preventDefault();
        this.props.onSubmit();
    }
    render () {
        return (
            <JoinFlowStep
                innerClassName={styles["join-flow-inner-error-step"]}
                nextButton={this.props.canTryAgain 
                    ?
                    'Try again'
                    // this.props.intl.formatMessage({id: 'general.tryAgain'}) 
                    :
                    'Start over'
                    // this.props.intl.formatMessage({id: 'general.startOver'})
                }
                title={
                  'Oops! Something went wrong'
                  // this.props.intl.formatMessage({id: 'general.error'})
                }
                titleClassName={styles["join-flow-error-title"]}
                onSubmit={this.handleSubmit}
            >
                <div className={styles["join-flow-instructions"]}>
                    KnitheWorld could not create your account.
                    {/* <FormattedMessage id="registration.cantCreateAccount" /> */}
                </div>
                {this.props.errorMsg && (
                    <div className={
                      classNames(styles["join-flow-instructions"],styles["registration-error-msg"])
                      // "join-flow-instructions registration-error-msg"
                    }>
                        {this.props.errorMsg}
                    </div>
                )}
                {this.props.canTryAgain ? (
                    <div className={styles["join-flow-instructions"]}>
                      {"Click \"Try again\"."}
                        {/* <FormattedMessage id="registration.tryAgainInstruction" /> */}
                    </div>
                ) : (
                    <div className={styles["join-flow-instructions"]}>
                      {"Click \"Start over.\""}
                        {/* <FormattedMessage id="registration.startOverInstruction" /> */}
                    </div>
                )}
            </JoinFlowStep>
        );
    }
}

RegistrationErrorStep.propTypes = {
    canTryAgain: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string,
    // intl: intlShape,
    onSubmit: PropTypes.func.isRequired,
    sendAnalytics: PropTypes.func.isRequired
};

RegistrationErrorStep.defaultProps = {
    canTryAgain: false
};

// const IntlRegistrationErrorStep = injectIntl(RegistrationErrorStep);

export default RegistrationErrorStep;
