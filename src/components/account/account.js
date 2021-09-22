import React from 'react';
import { bindAll } from "lodash";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {openJoin, openPasswordReset} from '../../reducers/modals.js';
import { setSignedOut } from "../../reducers/user.js";

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Tooltip from "../tooltip/tooltip";

import Signin from "./signin";
import AccountTools from "./account-tools";

import styles from "./account.scss";

// import UserManager from "../../lib/user-manager";
import {AuthAPI} from "../../lib/api";


class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip : false,
      waiting: false
    }
    bindAll(this, [
      'closeTooltip',
      'openTooltip',
      'handleSignIn',
      'handleSignOut',
      'handlePasswordReset'
    ]);
  }

  async handleSignIn(form) {
    this.setState({waiting:true});
    await AuthAPI.signInUser(form);
    this.closeTooltip();
    this.setState({waiting:false});
  }
  async handleSignOut() {
    await AuthAPI.signOut();
    this.closeTooltip();
  }

  async handlePasswordReset() {
    this.closeTooltip();
    this.props.openPasswordReset();
  }

  openTooltip() {
    this.setState({tooltip : true});
  }

  closeTooltip() {
    this.setState({tooltip : false});
  }

  render() {
    return (
      !this.props.signedIn
      ? ( 
        <div className={styles.account}>
          <button onClick={this.props.openJoin}>
            Sign up
          </button>
          <ClickAwayListener onClickAway={this.closeTooltip}>
            <div>
              <Tooltip
                interactive
                open={this.state.tooltip} 
                title={<Signin 
                  waiting={this.state.waiting} 
                  onSubmit={this.handleSignIn} 
                  openPasswordReset={this.handlePasswordReset}
                  />}
                placement="bottom"
              >
                <button onClick={this.openTooltip}>
                  Sign in
                </button>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </div>
      )
      : ( 
        <div className={styles.account}>
          <div className={styles.username}> @{this.props.username} </div>
          <ClickAwayListener onClickAway={this.closeTooltip}>
            <div>
              <Tooltip
                interactive
                open={this.state.tooltip} 
                title={<AccountTools 
                    onClose={this.closeTooltip} 
                    onSignOut={this.handleSignOut} 
                  />}
                placement="bottom"
              >
                <AccountCircleIcon 
                  onClick={this.openTooltip} 
                  style={{ fontSize: 30, color: "white" }} 
                  className={styles.icon}
                />
              </Tooltip>
            </div>
          </ClickAwayListener>
          
        </div>
      )
    );
  }
}

const mapStateToProps = state => ({
  username: state.user.username,
  signedIn: state.user.userSignedIn,
});

const mapDispatchToProps = dispatch => ({
  openJoin: () => dispatch(openJoin()),
  signOut: () => dispatch(setSignedOut()),
  openPasswordReset : () => dispatch(openPasswordReset())
});

Account.propTypes = {
  openJoin: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
};

export default connect(mapStateToProps,mapDispatchToProps)(Account);