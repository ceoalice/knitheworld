import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Field} from 'formik';

import Tooltip from '../tooltip/tooltip'; 

import selectStyles from '../forms/select.scss';
import rowStyles from './row.scss';
import './formik-select.scss';

const FormikSelect = ({
    className,
    error,
    options,
    validationClassName,
    ...props
}) => {
    const optionsList = options.map((item, index) => (
        <option
            disabled={item.disabled}
            key={index}
            value={item.value}
        >
            {item.label}
        </option>
    ));
    return (
        <div className={classNames(
          selectStyles['select'],
          rowStyles['row-with-tooltip']
        )}
        // "select row-with-tooltip"
        >
        <Tooltip 
          open={Boolean(error)} 
          content={error} 
          mode={error ? "error" : "info" }
          placement="right">
            <div>
            < Field
                  className={className}
                  component="select"
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
    validationClassName: PropTypes.string,
    // selected value
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default FormikSelect;
