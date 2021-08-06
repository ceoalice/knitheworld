// import { injectIntl } from 'react-intl';

import {bindAll, defaults} from 'lodash';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import Progression from './progression.jsx';
import UsernameStep from './steps/username-step.jsx';
import CountryStep from'./steps/country-step.jsx';
import BirthDateStep from'./steps/birthdate-step.jsx';
import GenderStep from './steps/gender-step.jsx';
import EmailStep from './steps/email-step.jsx';
import WelcomeStep from './steps/welcome-step.jsx';
import RegistrationErrorStep from './steps/registration-error-step.jsx';

import {closeJoin} from "../../reducers/modals.js"


import UserManager from "../../lib/user-manager";
import validate from "../../lib/validate";

class JoinFlow extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAdvanceStep',
            'handleCaptchaError',
            'handleErrorNext',
            'handlePrepareToRegister',
            'handleRegistrationResponse',
            'handleSubmitRegistration'
        ]);
        this.initialState = {
            numAttempts: 0,
            formData: {},
            registrationError: null,
            step: 0,
            waiting: false
        };
        // it's ok to set state by reference, because state is treated as immutable,
        // so any changes to its fields will result in a new state which does not
        // reference its past fields
        this.state = this.initialState;
    }
    canTryAgain () {
        return (this.state.registrationError.errorAllowsTryAgain && this.state.numAttempts <= 1);
    }
    handleCaptchaError () {
        this.setState({
            registrationError: {
                errorAllowsTryAgain: false,
                errorMsg: 'There was a problem with the CAPTCHA test.'
                // this.props.intl.formatMessage({
                //     id: 'registration.errorCaptcha'
                // })
            }
        });
    }
    handlePrepareToRegister (newFormData) {
        newFormData = newFormData || {};
        const newState = { //used to be default
            formData: defaults({}, newFormData, this.state.formData)
        };
        this.setState(newState, () => {
            this.handleSubmitRegistration(this.state.formData);
        });
    }
    getErrorsFromResponse (err, body, res) {
        const errorsFromResponse = [];
        if (!err && res.statusCode === 200 && body && body[0]) {
            const responseBodyErrors = body[0].errors;
            if (responseBodyErrors) {
                Object.keys(responseBodyErrors).forEach(fieldName => {
                    const errorStrs = responseBodyErrors[fieldName];
                    errorStrs.forEach(errorStr => {
                        errorsFromResponse.push({fieldName: fieldName, errorStr: errorStr});
                    });
                });
            }
        }
        return errorsFromResponse;
    }
    getCustomErrMsg (errorsFromResponse) {
        if (!errorsFromResponse || errorsFromResponse.length === 0) return null;
        let customErrMsg = '';
        // body can include zero or more error objects. Here we assemble
        // all of them into a single string, customErrMsg.
        errorsFromResponse.forEach(errorFromResponse => {
            if (customErrMsg.length) customErrMsg += '; ';
            customErrMsg += `${errorFromResponse.fieldName}: ${errorFromResponse.errorStr}`;
        });
        const problemsStr = 'The problems are:'; //this.props.intl.formatMessage({id: 'registration.problemsAre'});
        return `${problemsStr}: "${customErrMsg}"`;
    }
    registrationIsSuccessful (err, body, res) {
        return !!(!err && res.statusCode === 200 && body && body[0] && body[0].success);
    }
    // example of failing response:
    // [
    //   {
    //     "msg": "This field is required.",
    //     "errors": {
    //       "username": ["This field is required."],
    //       "recaptcha": ["Incorrect, please try again."]
    //     },
    //     "success": false
    //   }
    // ]
    //
    // username messages:
    //   * "username": ["username exists"]
    //   * "username": ["invalid username"] (length, charset)
    //   * "username": ["bad username"] (cleanspeak)
    // password messages:
    //   * "password": ["Ensure this value has at least 6 characters (it has LENGTH_NUM_HERE)."]
    // recaptcha messages:
    //   * "recaptcha": ["This field is required."]
    //   * "recaptcha": ["Incorrect, please try again."]
    //   * "recaptcha": [some timeout message?]
    // other messages:
    //   * "birth_month": ["Ensure this value is less than or equal to 12."]
    //   * "birth_month": ["Ensure this value is greater than or equal to 1."]
    handleRegistrationResponse (res) {
      console.log("GOT HERE")
      console.log(res);

        this.setState({
            numAttempts: this.state.numAttempts + 1
        }, () => {
            if (res.isSuccess) {
                // this.props.refreshSessionWithRetry().then(() => {
                    this.setState({
                        step: this.state.step + 1,
                        waiting: false
                    });
                // });
                return;
            }
        //     // now we know something went wrong -- either an actual error (client-side
        //     // or server-side), or just a problem with the registration content.

            // if an actual error, prompt user to try again.
            if (!res.isSuccess) {
                this.setState({
                    registrationError: {errorAllowsTryAgain: true},
                    waiting: false
                });
                return;
            }

            // now we know there was a problem with the registration content.
            // If the server provided us info on why registration failed,
            // build a summary explanation string
            let errorMsg = null;
            const errorsFromResponse = this.getErrorsFromResponse(err, body, res);
            // if there was exactly one error, check if we have a pre-written message
            // about that precise error
            if (errorsFromResponse.length === 1) {
                const singleErrMsgId = validate.responseErrorMsg(
                    errorsFromResponse[0].fieldName,
                    errorsFromResponse[0].errorStr
                );
                if (singleErrMsgId) { // one error that we have a predefined explanation string for
                    errorMsg = singleErrMsgId; // this.props.intl.formatMessage({id: singleErrMsgId});
                }
            }
            // if we have more than one error, build a custom message with all of the
            // server-provided error messages
            if (!errorMsg && errorsFromResponse.length > 0) {
                errorMsg = this.getCustomErrMsg(errorsFromResponse);
            }
            this.setState({
                registrationError: {
                    errorAllowsTryAgain: false,
                    errorMsg: errorMsg
                },
                waiting: false
            });
        });
    }
    handleSubmitRegistration (formData) {
      // console.log("formData: ", formData);
        this.setState({
            registrationError: null, // clear any existing error
            waiting: true
        }, () => {
          UserManager.createUser(formData)
            .then((res) => {

              this.handleRegistrationResponse(res);
            });
        //     api({
        //         host: '',
        //         uri: '/accounts/register_new_user/',
        //         method: 'post',
        //         useCsrf: true,
        //         formData: {
        //             'username': formData.username,
        //             'email': formData.email,
        //             'password': formData.password,
        //             'birth_month': formData.birth_month,
        //             'birth_year': formData.birth_year,
        //             'g-recaptcha-response': formData['g-recaptcha-response'],
        //             'gender': formData.gender,
        //             'country': formData.country,
        //             'is_robot': formData.yesno
        //             // no need to include csrfmiddlewaretoken; will be provided in
        //             // X-CSRFToken header, which scratchr2 looks for in
        //             // scratchr2/middleware/csrf.py line 237.
        //         }
        //     }, (err, body, res) => {
        //         this.handleRegistrationResponse(err, body, res);
        //     });

        });
    }
    handleAdvanceStep (newFormData) {
        newFormData = newFormData || {};
        this.setState({
            formData: defaults({}, newFormData, this.state.formData),
            step: this.state.step + 1
        });
    }
    handleErrorNext () {
        if (this.canTryAgain()) {
            this.handleSubmitRegistration(this.state.formData);
        } else {
            this.resetState();
        }
    }
    resetState () {
        this.setState(this.initialState);
    }
    sendAnalytics (path) {
      console.log("sending analytics")
        // const gaID = window.GA_ID;
        // if (!window.ga) {
        //     return;
        // }
        // window.ga('send', {
        //     hitType: 'pageview',
        //     page: path,
        //     tid: gaID
        // });
    }


    render () {
        return (
            <React.Fragment>
                {this.state.registrationError ? 
                  <RegistrationErrorStep
                      canTryAgain={this.canTryAgain()}
                      errorMsg={this.state.registrationError.errorMsg}
                      sendAnalytics={this.sendAnalytics}
                      onSubmit={this.handleErrorNext}
                  />
                 : (
                    <Progression step={this.state.step}>
                      <UsernameStep
                          step={this.state.step}
                          sendAnalytics={this.sendAnalytics}
                          onNextStep={this.handleAdvanceStep}
                      />
                      <CountryStep
                          step={this.state.step}
                          sendAnalytics={this.sendAnalytics}
                          onNextStep={this.handleAdvanceStep}
                      />
                      <BirthDateStep
                          step={this.state.step}
                          sendAnalytics={this.sendAnalytics}
                          onNextStep={this.handleAdvanceStep}
                      />
                      <GenderStep
                          step={this.state.step}
                          sendAnalytics={this.sendAnalytics}
                          onNextStep={this.handleAdvanceStep}
                      />
                      <EmailStep
                          step={this.state.step}
                          sendAnalytics={this.sendAnalytics}
                          waiting={this.state.waiting}
                          onCaptchaError={this.handleCaptchaError}
                          onNextStep={this.handlePrepareToRegister}
                      />
                      <WelcomeStep
                          step={this.state.step}
                          createProjectOnComplete={false}
                          email={this.state.formData.email}
                          sendAnalytics={this.sendAnalytics}
                          username={this.state.formData.username}
                          onNextStep={this.props.closeJoinModal}
                      />
                    </Progression>
                )}
            </React.Fragment>
        );
    }
}



JoinFlow.propTypes = {    
    refreshSessionWithRetry: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
    closeJoinModal : () => (dispatch(closeJoin()))
});

// Allow incoming props to override redux-provided props. Used to mock in tests.
const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
    {}, stateProps, dispatchProps, ownProps
);

export default connect(
    mapDispatchToProps,
    mergeProps
)(JoinFlow);