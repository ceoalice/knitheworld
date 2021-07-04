import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import styles from "./account.scss";
import {openLocalProjects} from "../../reducers/modals.js";

import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "rgba(125,125,125,0.2)",
    color: 'white'
  },
}));

const AccountTools = props => {
  const classes = useStyles();

  const handleLogoutClick = () => {
    props.onSignOut().then(()=> {
       window.location.reload();
    })
   
  }

  const handleOpenProjects = () => {
    props.onClose();
    props.openLocalProjects();
  }
  
  return (
    <Paper className={classes.paper}>
      <MenuList>
        <MenuItem>Profile</MenuItem>
        <MenuItem onClick={handleOpenProjects}>My Projects</MenuItem>
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </MenuList>
  </Paper>
  );
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  openLocalProjects: () => dispatch(openLocalProjects()),
});

AccountTools.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired
};

AccountTools.defaultProps = {

}

export default connect(null,mapDispatchToProps)(AccountTools);