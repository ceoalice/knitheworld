import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Field} from 'formik';

import FormikInput from'./formik-input.jsx';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import styles from './formik-radio-button.scss';

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
      <FormControlLabel 
        className={labelClassName}
        control={
          <Radio 
            color="primary"
            className={className}
            id={id}
            checked={value === field.value}
            value={value}
            name={field.name}
            onBlur={field.onBlur} 
            onChange={field.onChange}
          />
        } 
        label={label}
      />
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
        className={classNames(styles['formik-radio-button'], className)}
        component={FormikRadioButtonSubComponent}
        id={id}
        label={label}
        labelClassName={styles['formik-radio-label']}
        name={name}
        value={value}
        {...props}
    >
        {isCustomInput && (
            <FormikInput
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className={styles["formik-radio-input"]}
                name="custom"
                spellCheck={false}
                wrapperClassName={styles["formik-radio-input-wrapper"]}
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