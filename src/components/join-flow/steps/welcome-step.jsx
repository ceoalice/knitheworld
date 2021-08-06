import {bindAll } from'lodash';
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Formik} from 'formik';

// const FormattedMessage = require('react-intl').FormattedMessage;
// const {injectIntl, intlShape} = require('react-intl');

import JoinFlowStep from './join-flow-step.jsx';

import styles from './join-flow-steps.scss';

class WelcomeStep extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleValidSubmit',
            'validateForm'
        ]);
    }
    componentDidMount () {
        // if (this.props.sendAnalytics) {
        //     this.props.sendAnalytics('join-welcome');
        // }
    }

    validateForm () {
        return {};
    }
    handleValidSubmit (formData, formikBag) {
        formikBag.setSubmitting(false);
        this.props.onNextStep(formData);
    }
    render () {
        return (
            <Formik
                initialValues={{}}
                validate={this.validateForm}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={this.handleValidSubmit}
            >
                {props => {
                    const {
                        handleSubmit,
                        isSubmitting
                    } = props;
                    return (
                        <JoinFlowStep
                            step={this.props.step}
                            headerImgClass={styles["welcome-step-image"]}

                            headerImgSrc={window.location.pathname == '/knitheworld/'
                              ? `${window.location.pathname}static/images/welcome-header.png`
                              : '/static/images/welcome-header.png'}
                            innerClassName={styles["join-flow-inner-welcome-step"]}
                            nextButton={
                            //   this.props.createProjectOnComplete ? (
                            //     <React.Fragment>
                            //         <div>Get Started</div>
                            //         {/* <FormattedMessage id="general.getStarted" /> */}
                            //         <img
                            //             className={styles["join-flow-next-button-arrow"]}
                            //             src="/static/r-arrow.svg"
                            //         />
                            //     </React.Fragment>
                            // ) : (
                                <div>Done</div>
                                // <FormattedMessage id="general.done" />
                            // )
                          }
                            title={
                              `Welcome to KnitheWorld, ${this.props.username}!`
                            //   `${this.props.intl.formatMessage(
                            //     {id: 'registration.welcomeStepTitleNonEducator'},
                            //     {username: this.props.username}
                            // )}`
                           }
                            titleClassName={styles["join-flow-welcome-title"]}
                            waiting={isSubmitting}
                            onSubmit={()=> console.log("HERE????")}
                        >
                            <div className={styles["join-flow-instructions"]}>
                            You’re now logged in! You can start exploring and creating projects.
                                {/* <FormattedMessage
                                    id="registration.welcomeStepDescriptionNonEducator"
                                /> */}
                            </div>
                            <div className={styles["join-flow-instructions"]}>
                            Want to share and comment? Click the link on the email we sent to {this.props.email}.
                                {/* <FormattedMessage
                                    id="registration.welcomeStepInstructions"
                                    values={{
                                        email: this.props.email
                                    }}
                                /> */}
                            </div>
                        </JoinFlowStep>
                    );
                }}
            </Formik>
        );
    }
}

WelcomeStep.propTypes = {
    createProjectOnComplete: PropTypes.bool,
    email: PropTypes.string,
    // intl: intlShape,
    onNextStep: PropTypes.func,
    sendAnalytics: PropTypes.func,
    username: PropTypes.string
};

// module.exports = injectIntl(WelcomeStep);

export default WelcomeStep;