import {bindAll } from'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Formik} from 'formik';
// const {injectIntl, intlShape} = require('react-intl');
// const FormattedMessage = require('react-intl').FormattedMessage;

import FormikRadioButton from '../../formik-forms/formik-radio-button.jsx';
import JoinFlowStep from './join-flow-step.jsx';

// const InfoButton = require('../info-button/info-button.jsx');

import styles from './join-flow-steps.scss';
import './row.scss'

const GenderOption = ({
    id,
    label,
    onSetFieldValue,
    selectedValue,
    value,
    ...props
}) => (
    <div
        className={classNames(
            'col-sm-9',
            'row',
            'row-inline',
            styles['gender-radio-row'],
            {[styles['gender-radio-row-selected']]: (selectedValue === value)}
        )}
        onClick={() => onSetFieldValue('gender', value, false)}
    >
        <FormikRadioButton
            className={classNames(
                'join-flow-radio' // not anywhere?
            )}
            id={id}
            label={label}
            name="gender"
            value={value}
            {...props}
        />
    </div>
);

GenderOption.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    onSetFieldValue: PropTypes.func,
    selectedValue: PropTypes.string,
    value: PropTypes.string
};

class GenderStep extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSetCustomRef',
            'handleValidSubmit'
        ]);
    }
    componentDidMount () {
        // if (this.props.sendAnalytics) {
        //     this.props.sendAnalytics('join-gender');
        // }
    }
    handleSetCustomRef (customInputRef) {
        this.customInput = customInputRef;
    }
    handleValidSubmit (formData, formikBag) {
        formikBag.setSubmitting(false);
        // handle defaults:
        // when gender is specifically made blank, use "(blank)"
        if (!formData.gender || formData.gender === '') {
            formData.gender = '(blank)';
        }
        // when user clicks Next without making any selection, use "(skipped)"
        if (formData.gender === 'null') {
            formData.gender = '(skipped)';
        }
        delete formData.custom;
        this.props.onNextStep(formData);
    }
    render () {
        return (
            <Formik
                initialValues={{
                    gender: 'null',
                    custom: ''
                }}
                onSubmit={this.handleValidSubmit}
            >
                {props => {
                    const {
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        setValues,
                        values
                    } = props;
                    return (
                        <JoinFlowStep
                            step={this.props.step}
                            description={
                              'KnitheWorld welcomes people of all genders.'
                              // this.props.intl.formatMessage({id: 'registration.genderStepDescription'})
                            }
                            descriptionClassName={styles["join-flow-gender-description"]}
                            innerClassName={styles["join-flow-inner-gender-step"]}
                            title={
                              "What's your gender?"
                              // this.props.intl.formatMessage({id: 'registration.genderStepTitle'})
                            }
                            waiting={isSubmitting}
                            onSubmit={handleSubmit}
                        >
                            <GenderOption
                                id="GenderRadioOptionFemale"
                                label={
                                  'Female'
                                  // this.props.intl.formatMessage({id: 'general.female'})
                                }
                                selectedValue={values.gender}
                                value="female"
                                onSetFieldValue={setFieldValue}
                            />
                            <GenderOption
                                id="GenderRadioOptionMale"
                                label={
                                  'Male'
                                  // this.props.intl.formatMessage({id: 'general.male'})
                                }
                                selectedValue={values.gender}
                                value="male"
                                onSetFieldValue={setFieldValue}
                            />
                            <GenderOption
                                label={
                                  'Non-binary'
                                  // this.props.intl.formatMessage({id: 'general.nonBinary'})
                                }
                                selectedValue={values.gender}
                                value="non-binary"
                                onSetFieldValue={setFieldValue}
                            />
                            <div
                                className={classNames(
                                    'col-sm-9',
                                    'row',
                                    'row-inline',
                                    styles['gender-radio-row'],
                                    {[styles['gender-radio-row-selected']]: (values.gender === values.custom)}
                                )}
                                /* eslint-disable react/jsx-no-bind */
                                onClick={() => {
                                    setFieldValue('gender', values.custom, false);
                                    if (this.customInput) this.customInput.focus();
                                }}
                                /* eslint-enable react/jsx-no-bind */
                            >
                                <FormikRadioButton
                                    isCustomInput
                                    className={classNames(
                                        'join-flow-radio' // not anywhere?
                                    )}
                                    id="GenderRadioOptionCustom"
                                    label={
                                      'Another gender:'
                                      // this.props.intl.formatMessage({id: 'registration.genderOptionAnother'})
                                    }
                                    name="gender"
                                    value={values.custom}
                                    onSetCustom={newCustomVal => setValues({
                                        gender: newCustomVal.substring(0, 25),
                                        custom: newCustomVal.substring(0, 25)
                                    })}
                                    onSetCustomRef={this.handleSetCustomRef}
                                />
                            </div>
                            <GenderOption
                                id="GenderRadioOptionPreferNot"
                                label={
                                  'Prefer not to say'
                                  // this.props.intl.formatMessage({id: 'registration.genderOptionPreferNotToSay'})
                                }
                                selectedValue={values.gender}
                                value="(Prefer not to say)"
                                onSetFieldValue={setFieldValue}
                            />
                            <div className={classNames(
                                styles["join-flow-privacy-message"],
                                styles["join-flow-gender-privacy"]
                              )}>
                                <div>registration.private</div>
                                {/* <FormattedMessage id="registration.private" /> */}
                                {/* <InfoButton
                                    message={this.props.intl.formatMessage({id: 'registration.genderStepInfo'})}
                                /> */}
                            </div>
                        </JoinFlowStep>
                    );
                }}
            </Formik>
        );
    }
}

GenderStep.propTypes = {
    // intl: intlShape,
    onNextStep: PropTypes.func,
    sendAnalytics: PropTypes.func.isRequired
};

// module.exports = injectIntl(GenderStep);

export default GenderStep;