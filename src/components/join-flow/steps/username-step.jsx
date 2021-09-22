import { bindAll } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Formik} from 'formik';
// const {injectIntl, intlShape} = require('react-intl');

import {AuthAPI} from "../../../lib/api";

import FormikInput from'../../formik-forms/formik-input.jsx';
import FormikCheckbox from '../../formik-forms/formik-checkbox.jsx';
import JoinFlowStep from './join-flow-step.jsx';

import styles from './join-flow-steps.scss';

/*
 * Username step
 */
class UsernameStep extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleFocused',
            'handleSetUsernameRef',
            'handleValidSubmit',
            'validatePasswordIfPresent',
            'validatePasswordConfirmIfPresent',
            'validateUsernameIfPresent',
            // 'validateUsernameRemotelyWithCache',
            'validateForm'
        ]);
        this.state = {
            focused: null
        };
        // simple object to memoize remote requests for usernames.
        // keeps us from submitting multiple requests for same data.
        // this.usernameRemoteCache = Object.create(null);
    }
    componentDidMount () {
        // Send info to analytics when we aren't on the standalone page.
        // If we are on the standalone join page, the page load will take care of this.

        // automatically start with focus on username field
        if (this.usernameInput) {
          setTimeout(()=> {
            if (this.usernameInput && this.usernameInput !== document.activeElement) {
              this.usernameInput.focus();
            }
          }, 2000);
        }
    }
    // track the currently focused input field, to determine whether each field should
    // display a tooltip. (We only display it if a field is focused and has never been touched.)
    handleFocused (fieldName) {
        this.setState({focused: fieldName});
    }
    handleSetUsernameRef (usernameInputRef) {
        this.usernameInput = usernameInputRef;
    }
    // we allow username to be empty on blur, since you might not have typed anything yet
    async validateUsernameIfPresent (username) {
        // console.log("validating")
        if (!username) return null; // skip validation if username is blank; null indicates valid
        // if username is not blank, run both local and remote validations
        const localResult = AuthAPI.validateUsernameLocally(username);
        // console.log(localResult);
        // return localResult.valid;
        if (!localResult.valid) return localResult.errMsgId;

        else { // do remote check
        return AuthAPI.validateUsernameRemotely(username).then(
            remoteResult => {
                // console.log(remoteResult);
                // there may be multiple validation errors. Prioritize vulgarity, then
                // length, then having invalid chars, then all other remote reports
                // if (remoteResult.valid === false && remoteResult.errMsgId === 'registration.validationUsernameVulgar') {
                //     return this.props.intl.formatMessage({id: remoteResult.errMsgId});
                // } else if (localResult.valid === false) {
                //     return this.props.intl.formatMessage({id: localResult.errMsgId});
                if (remoteResult.valid === false) {
                    return remoteResult.errMsgId;
                    // return  this.props.intl.formatMessage({id: remoteResult.errMsgId});
                }
                return null;
            }
          );
        }

        return false;
    }
    validatePasswordIfPresent (password, username) {
        if (!password) return null; // skip validation if password is blank; null indicates valid
        const localResult = AuthAPI.validatePassword(password, username);
        if (localResult.valid) return null;
        return localResult.errMsgId; // this.props.intl.formatMessage({id: localResult.errMsgId});
    }
    validatePasswordConfirmIfPresent (password, passwordConfirm) {
        if (!passwordConfirm) return null; // allow blank password if not submitting yet
        const localResult = AuthAPI.validatePasswordConfirm(password, passwordConfirm);
        if (localResult.valid) return null;
        return  localResult.errMsgId; // this.props.intl.formatMessage({id: localResult.errMsgId});
    }
    // called asynchonously when form submit is initially requested,
    // along with all of the individual field validation functions
    validateForm (values) {
        // in addition to field-level username/password validations, we need to additionally
        // check that these values aren't blank.
        const errors = {};
        const usernameResult = AuthAPI.validateUsernameLocally(values.username);
        if (!usernameResult.valid) {
            errors.username = usernameResult.errMsgId; //this.props.intl.formatMessage({id: usernameResult.errMsgId});
        }
        const passwordResult = AuthAPI.validatePassword(values.password, values.username);
        if (!passwordResult.valid) {
            errors.password = passwordResult.errMsgId;
            //  this.props.intl.formatMessage({id: passwordResult.errMsgId});
        }
        const passwordConfirmResult = AuthAPI.validatePasswordConfirm(values.password, values.passwordConfirm);
        if (!passwordConfirmResult.valid) {
            errors.passwordConfirm = passwordConfirmResult.errMsgId; 
            // this.props.intl.formatMessage({id: passwordConfirmResult.errMsgId});
        }
        return errors;
    }
    // called after all validations pass with no errors
    handleValidSubmit (formData, formikBag) {
        formikBag.setSubmitting(false); // formik makes us do this ourselves
        delete formData.showPassword;
        this.props.onNextStep(formData);
    }
    render () {
        return (
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    passwordConfirm: '',
                    showPassword: false
                }}
                validate={this.validateForm}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={this.handleValidSubmit}
            >
                {props => {
                    const {
                        errors,
                        handleSubmit,
                        isSubmitting,
                        setFieldError,
                        setFieldTouched,
                        setFieldValue,
                        touched,
                        validateField,
                        values
                    } = props;
                    return (
                        <JoinFlowStep
                            step={this.props.step}
                            description={
                              "Create projects, share ideas, make friends. It’s free!"
                            //   this.props.intl.formatMessage({
                            //     id: 'registration.usernameStepDescriptionNonEducator'
                            // })
                          }
                            innerClassName={styles["join-flow-inner-username-step"]}
                            title={
                              "Join KnitheWorld"
                              // this.props.intl.formatMessage({id: 'general.joinScratch'})
                            }
                            waiting={isSubmitting}
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <div className={styles["join-flow-input-title"]}>
                                    {
                                      "Create a username"
                                    // this.props.intl.formatMessage({id: 'registration.createUsername'})
                                    }
                                </div>
                                <FormikInput
                                    autoCapitalize="off"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    className={classNames(
                                      styles['join-flow-input']
                                    )}
                                    error={errors.username}
                                    id="username"
                                    name="username"
                                    placeholder={
                                      "Username"
                                      // this.props.intl.formatMessage({id: 'general.username'})
                                    }
                                    spellCheck={false}
                                    toolTip={this.state.focused === 'username' 
                                      && !touched.username && "Don't use your real name"
                                    // && this.props.intl.formatMessage({id: 'registration.usernameAdviceShort'})
                                      }
                                    validate={this.validateUsernameIfPresent}
                                    onBlur={() => {
                                      // this.handleFocused(null);
                                      validateField('username');
                                    }}
                                    onChange={e => {
                                        setFieldValue('username', e.target.value.substring(0, 30));
                                        setFieldTouched('username');
                                        setFieldError('username', null);
                                    }}
                                    onFocus={() => this.handleFocused('username')}
                                    onSetRef={this.handleSetUsernameRef}
                                />
                                <div className={styles["join-flow-password-section"]}>
                                    <div className={styles["join-flow-input-title"]}>
                                        {
                                          "Create a password"
                                        // this.props.intl.formatMessage({id: 'registration.choosePasswordStepTitle'})
                                        }
                                    </div>
                                    <FormikInput
                                        autoCapitalize="off"
                                        autoComplete={values.showPassword ? 'off' : 'new-password'}
                                        autoCorrect="off"
                                        className={classNames(
                                            styles['join-flow-input'],
                                            {[styles['join-flow-input-password']]:
                                                !values.showPassword && values.password.length > 0}
                                        )}
                                        error={errors.password}
                                        id="password"
                                        name="password"
                                        placeholder={
                                          "Password"
                                          // this.props.intl.formatMessage({id: 'general.password'})
                                        }
                                        spellCheck={false}
                                        toolTip={this.state.focused === 'password' && !touched.password 
                                          && "Write it down so you remember. Don’t share it with others!"
                                            // this.props.intl.formatMessage({id: 'registration.passwordAdviceShort'})
                                          }
                                        type={values.showPassword ? 'text' : 'password'}
                                        validate={password => this.validatePasswordIfPresent(password, values.username)}
                                        onBlur={() => validateField('password')}
                                        onChange={e => {
                                            setFieldValue('password', e.target.value);
                                            setFieldTouched('password');
                                            setFieldError('password', null);
                                        }}
                                        onFocus={() => this.handleFocused('password')}   
                                    />

                                    <FormikInput
                                        autoCapitalize="off"
                                        autoComplete={values.showPassword ? 'off' : 'new-password'}
                                        autoCorrect="off"
                                        className={classNames(
                                          styles['join-flow-input'],
                                          styles['join-flow-password-confirm'],
                                            {
                                                [styles['join-flow-input-password']]:
                                                    !values.showPassword && values.passwordConfirm.length > 0,
                                                'fail': errors.passwordConfirm
                                            }
                                        )}
                                        error={errors.passwordConfirm}
                                        id="passwordConfirm"
                                        name="passwordConfirm"
                                        placeholder={
                                          "Type password again"
                                        //   this.props.intl.formatMessage({
                                        //     id: 'registration.confirmPasswordInstruction'
                                        // })
                                        }
                                        spellCheck={false}
                                        toolTip={
                                            this.state.focused === 'passwordConfirm' && !touched.passwordConfirm 
                                            && "Type password again"                                          
                                                // this.props.intl.formatMessage({
                                                //     id: 'registration.confirmPasswordInstruction'
                                                // })
                                        }
                                        type={values.showPassword ? 'text' : 'password'}
                                        validate={() =>
                                            this.validatePasswordConfirmIfPresent(values.password,
                                                values.passwordConfirm)
                                        }
                                        onBlur={() => validateField('passwordConfirm')}
                                        onChange={e => {
                                            setFieldValue('passwordConfirm', e.target.value);
                                            setFieldTouched('passwordConfirm');
                                            setFieldError('passwordConfirm', null);
                                        }}
                                        onFocus={() => this.handleFocused('passwordConfirm')}
                                    />

                                    <FormikCheckbox
                                        id="showPassword"
                                        label={
                                          "Show password"
                                          // this.props.intl.formatMessage({id: 'registration.showPassword'})
                                        }
                                        labelClassName={styles["join-flow-input-title"]}
                                        name="showPassword"
                                    />
                                </div>
                            </div>
                        </JoinFlowStep>
                    );
                }}
            </Formik>
        );
    }
}

UsernameStep.propTypes = {
    // intl: intlShape,
    onNextStep: PropTypes.func,
    sendAnalytics: PropTypes.func.isRequired
};

// const IntlUsernameStep = injectIntl(UsernameStep);

export default UsernameStep;
