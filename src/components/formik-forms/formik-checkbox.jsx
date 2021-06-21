import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Field} from 'formik';

import checkboxStyles from './formik-checkbox.scss';
import formStyles from './formik-forms.scss';

const FormikCheckboxSubComponent = ({
    field,
    id,
    label,
    labelClassName,
    outerClassName,
    ...props
}) => (
    <div className={classNames('checkbox', outerClassName)}>
        <input
            checked={field.value}
            className={checkboxStyles["formik-checkbox"]}
            id={id}
            name={field.name}
            type="checkbox"
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
            {...props}
        />
        {label && (
            <label
                className={classNames(
                    checkboxStyles['formik-checkbox-label'],
                    formStyles['formik-label'],
                    labelClassName
                )}
                htmlFor={id}
            >
                {label}
            </label>
        )}
    </div>
);

FormikCheckboxSubComponent.propTypes = {
    field: PropTypes.shape({
        name: PropTypes.string,
        onBlur: PropTypes.function,
        onChange: PropTypes.function,
        value: PropTypes.bool
    }),
    id: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    outerClassName: PropTypes.string
};


const FormikCheckbox = ({
    id,
    label,
    labelClassName,
    name,
    outerClassName,
    ...props
}) => (
    <Field
        component={FormikCheckboxSubComponent}
        id={id}
        label={label}
        labelClassName={labelClassName}
        name={name}
        outerClassName={outerClassName}
        {...props}
    />
);

FormikCheckbox.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    name: PropTypes.string,
    outerClassName: PropTypes.string
};

export default FormikCheckbox;
