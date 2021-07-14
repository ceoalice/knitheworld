import classNames from "classnames";
import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';

import styles from "./tooltip.scss";

const KnitheWorldTooltip = props =>  {
    return (
        <div>
          <Tooltip  
            id ={props.mode}  
            // className doesn't override for Tooltip use classes   
            classes={{
              tooltip: styles[props.mode],
              arrow: styles[props.mode],
            }}  
            title={props.content || '_'}
            {...props}

            // https://stackoverflow.com/questions/61139778/react-material-ui-tooltips-disable-animation
            TransitionProps={{ timeout: 0 }}
          >
            {props.children}
          </Tooltip>
        </div>
    );
};

KnitheWorldTooltip.propTypes = {
  open: PropTypes.bool,
  placement: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  arrow: PropTypes.bool,
  mode: PropTypes.string,
};

KnitheWorldTooltip.defaultProps = {
  arrow: true,
  mode: "info",
}

export default KnitheWorldTooltip;