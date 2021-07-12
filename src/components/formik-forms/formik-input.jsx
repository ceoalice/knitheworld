import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Field} from 'formik';

import styles from './formik-input.scss';

import Tooltip from '../tooltip/tooltip'; 

const FormikInput = ({
    className,
    error,
    onSetRef,
    toolTip,
    wrapperClassName,
    ...props
}) => {
  const handleContent = () => {
    if (error) return error;
    if (toolTip) return toolTip;
  }
  return (
    <div
        className={wrapperClassName}
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
                  styles['formik-input'],
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
    wrapperClassName: PropTypes.string
};

export default FormikInput;
