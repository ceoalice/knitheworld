import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Field} from 'formik';

import rowStyles from './row.scss';
import inputStyles from './formik-input.scss';

import Tooltip from '../tooltip/tooltip'; 

const FormikInput = ({
    className,
    error,
    onSetRef,
    toolTip,
    validationClassName,
    wrapperClassName,
    ...props
}) => {
  const handleContent = () => {
    if (error) return error;
    if (toolTip) return toolTip;
  }
  return (
    <div
        className={classNames(
            'col-sm-9',
            rowStyles['row'],
            rowStyles['row-with-tooltip'],
            wrapperClassName
        )}
    >
        <Tooltip 
          open={
            (Boolean(toolTip) || Boolean(error))
            && toolTip !== true
          } 
          content={handleContent()} 
          mode={error ? "error" : "info" }
          placement="right">

            <div>
              <Field
              className={classNames(
                  inputStyles['formik-input'],
                  {fail: error},
                  className
              )}
              /* formik uses "innerRef" to return the actual input element */
              innerRef={onSetRef}
              {...props}
              />
            </div>
     
        </Tooltip>
    </div>
)};

FormikInput.propTypes = {
    className: PropTypes.string,
    // error and toolTip can be false, in which case we ignore them
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    onSetRef: PropTypes.func,
    toolTip: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    type: PropTypes.string,
    validationClassName: PropTypes.string,
    wrapperClassName: PropTypes.string
};

export default FormikInput;
