import { omit } from "lodash";
import React from 'react';
import PropTypes from 'prop-types';

// import { StylesProvider } from "@material-ui/core/styles";

import Tooltip from '@material-ui/core/Tooltip';
// import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import "./tooltip.scss";

class KnitheWorldTooltip extends React.Component {

  render() {
    return (
      // this.props.open ? 
        <div >
          <Tooltip 
            id={this.props.mode}
            title={this.props.content || '_'}
            placement={this.props.placement}
            arrow={this.props.arrow}
            {...this.props}


            // https://stackoverflow.com/questions/61139778/react-material-ui-tooltips-disable-animation
            TransitionProps={{ timeout: 0 }}
          >
            {this.props.children}
          </Tooltip>
        </div>
      // : 
      //   <div> {this.props.children} </div>
    );
  }

};

KnitheWorldTooltip.propTypes = {
  open: PropTypes.bool,
  // children: PropTypes.node.isRequired,
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
  mode: "info"
}

export default KnitheWorldTooltip;