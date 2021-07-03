import {bindAll } from'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Formik} from 'formik';
// const {injectIntl, intlShape} = require('react-intl');

import countryData from "../../../lib/country-data.js";

import FormikSelect from '../../formik-forms/formik-select.jsx';
import FormikCheckbox from '../../formik-forms/formik-checkbox.jsx';

import JoinFlowStep from './join-flow-step.jsx';

import styles from './join-flow-steps.scss';
import rowStyles from './row.scss';

class CountryStep extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleValidSubmit',
            'validateForm',
            'validateSelect',
            'setCountryOptions'
        ]);
        this.countryOptions = [];
    }
    componentDidMount () {
        // if (this.props.sendAnalytics) {
        //     this.props.sendAnalytics('join-country');
        // }
        // this.setCountryOptions();
    }
    setCountryOptions () {
        if (this.countryOptions.length === 0) {
            this.countryOptions = [...countryData.registrationCountryNameOptions];
            this.countryOptions.unshift({ // add placeholder as first option
                disabled: true,
                label: "Select country",  
                // this.props.intl.formatMessage({id: 'registration.selectCountry'}),
                value: 'null'
            });
        }
    }
    validateSelect (selection) {
        if (selection === 'null') {
            return "Required";
            // this.props.intl.formatMessage({id: 'general.required'});
        }
        return null;
    }
    validateForm () {
        return {};
    }
    handleValidSubmit (formData, formikBag) {
        formikBag.setSubmitting(false);
        this.props.onNextStep(formData);
    }
    render () {
        this.setCountryOptions();
        return (
            <Formik
                initialValues={{
                    country: 'null'
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
                        setFieldError
                    } = props;
                    return (
                        <JoinFlowStep
                            step={this.props.step}
                            headerImgClass={styles["country-step-image"]}
                            headerImgSrc="/static/images/country-header.png"
                            innerClassName={styles["join-flow-inner-country-step"]}
                            title={
                              "What country do you live in?"
                              // this.props.intl.formatMessage({id: 'registration.countryStepTitle'})
                            }
                            titleClassName={styles["join-flow-country-title"]}
                            waiting={isSubmitting}
                            onSubmit={handleSubmit}
                        >
                            <div
                                className={classNames(
                                    'col-sm-9',
                                    rowStyles['row']
                                )}
                            >
                                <FormikSelect
                                    className={classNames(
                                        styles['join-flow-select'],
                                        styles['join-flow-select-country'],
                                        {fail: errors.country}
                                    )}
                                    error={errors.country}
                                    id="country"
                                    name="country"
                                    options={this.countryOptions}
                                    validate={this.validateSelect}
                                    validationClassName={classNames(
                                        styles['validation-full-width-input'],
                                        styles['validation-country']
                                    )}
                                    /* eslint-disable react/jsx-no-bind */
                                    onFocus={() => setFieldError('country', null)}
                                    /* eslint-enable react/jsx-no-bind */
                                />
                                {/* note that this is a hidden checkbox the user will never see */}
                                {/* <FormikCheckbox
                                    id="yesno"
                                    label={
                                      'registration.receiveEmails'
                                      // this.props.intl.formatMessage({id: 'registration.receiveEmails'})
                                    }
                                    name="yesno"
                                    outerClassName={styles["yesNoCheckbox"]}
                                /> */}
                            </div>
                        </JoinFlowStep>
                    );
                }}
            </Formik>
        );
    }
}

CountryStep.propTypes = {
    // intl: intlShape,
    onNextStep: PropTypes.func,
    sendAnalytics: PropTypes.func.isRequired
};

// const IntlCountryStep = injectIntl(CountryStep);

export default CountryStep;
