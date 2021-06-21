import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Field} from 'formik';

import FormikInput from'.//formik-input.jsx';

import formStyles from './formik-forms.scss';
import radioStyles from './formik-radio-button.scss';
import './row.scss';

const FormikRadioButtonSubComponent = ({
    children,
    className,
    field, // field.value is the current selected value of the entire radio group
    id,
    label,
    labelClassName,
    value,
    ...props
}) => (
    <React.Fragment>
        <input
            checked={value === field.value}
            className={classNames(
              radioStyles['formik-radio-button'],
                className
            )}
            id={id}
            name={field.name}
            type="radio"
            value={value}
            onBlur={field.onBlur} /* eslint-disable-line react/jsx-handler-names */
            onChange={field.onChange} /* eslint-disable-line react/jsx-handler-names */
            {...props}
        />
        {label && (
            <label
                className={classNames(
                    formStyles['formik-label'],
                    radioStyles['formik-radio-label'],
                    labelClassName
                )}
                htmlFor={id}
            >
                {label}
            </label>
        )}
        {children}
    </React.Fragment>
);

FormikRadioButtonSubComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    field: PropTypes.shape({
        name: PropTypes.string,
        onBlur: PropTypes.function,
        onChange: PropTypes.function,
        value: PropTypes.string
    }),
    id: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};


const FormikRadioButton = ({
    className,
    id,
    isCustomInput,
    label,
    name,
    onSetCustom,
    onSetCustomRef,
    value,
    ...props
}) => (
    <Field
        className={className}
        component={FormikRadioButtonSubComponent}
        id={id}
        label={label}
        labelClassName={isCustomInput ? radioStyles['formik-radio-label-other'] : ''}
        name={name}
        value={value}
        {...props}
    >
        {isCustomInput && (
            <FormikInput
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className={radioStyles["formik-radio-input"]}
                name="custom"
                spellCheck={false}
                wrapperClassName={radioStyles["formik-radio-input-wrapper"]}
                onChange={event => onSetCustom(event.target.value)}
                onFocus={event => onSetCustom(event.target.value)}
                onSetRef={onSetCustomRef}
            />
        )}
    </Field>
);

FormikRadioButton.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    isCustomInput: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    onSetCustom: PropTypes.func,
    onSetCustomRef: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default FormikRadioButton;