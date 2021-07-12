import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Field} from 'formik';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import checkboxStyles from './formik-checkbox.scss';

const FormikCheckboxSubComponent = ({
    field,
    id,
    label,
    labelClassName,
    outerClassName,
    ...props
}) => (
    <div className={classNames('checkbox', outerClassName)}>
        <FormControlLabel
          control={
            <Checkbox
              className={checkboxStyles["formik-checkbox"]}
              checked={field.value}
              onChange={field.onChange}
              name={field.name}
              onBlur={field.onBlur}
              color="primary"
            />
          }
          label={label}
        />
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