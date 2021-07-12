import PropTypes from 'prop-types';
import React from 'react';
import {Field} from 'formik';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';

import Tooltip from '../tooltip/tooltip'; 

import styles from './formik-select.scss';

const SelectSubComponent = ({
  field, // { name, value, onChange, onBlur }
  ...props
}) => {
  return (
      <FormControl style={{minWidth:'100%'}}>
        <InputLabel shrink>
          {props.label}
        </InputLabel>
        <Select
          fullWidth
          input={<InputBase className={styles['formik-select']} />}
          {...field}
        >
          {props.children}
        </Select>
      </FormControl>
)};

const FormikSelect = ({
    className,
    error,
    options,
    ...props
}) => {
    const optionsList = options.map((item, index) => (
        <MenuItem
            disabled={item.disabled}
            key={index}
            value={item.value}
        >
            {item.label}
        </MenuItem>
    ));
    return (
        <div className={className}
        >
        <Tooltip 
          open={Boolean(error)} 
          content={error} 
          mode={error ? "error" : "info" }
          placement="right">
            <div>
              <Field
                type='select'
                className={className} 
                component={SelectSubComponent} 
                {...props}
              >
                {optionsList}
              </Field> 
            </div>
          </Tooltip>

        </div>
    );
};


FormikSelect.propTypes = {
    className: PropTypes.string,
    error: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        disabled: PropTypes.bool,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    })).isRequired,
    // selected value
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default FormikSelect;