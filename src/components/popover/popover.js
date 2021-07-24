import React from 'react';
import PropTypes from "prop-types";
import Popover from '@material-ui/core/Popover';

import styles from "./popover.scss";

class KnitheWorldPopover extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    
  }
  render() {
    const props = {...this.props}
    return (
      props.anchorEl ? 
        <Popover
          elevation={10}
          id="Knitheworld-popoover"
          classes= {{
            root: styles.popover
          }}
          id={'id'}
          style={{margin: '0 10px'}}
          
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          {...props}
        >
          <div style = {{padding: '10px', textTransform: "none"}}>
            {props.children}
          </div>
        </Popover>
      : null
    )
  }
}

KnitheWorldPopover.propTypes = {
  anchorEl : PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
  open: PropTypes.bool,
}

export default KnitheWorldPopover;