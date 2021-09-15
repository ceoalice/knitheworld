import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import NavBar from "../../containers/navbar.js";
import Modals from "../modals/modals.js";

import styles from "./home.scss";

/**
 * TODO : home page should open up with a Welcome Modal (using our modal component), 
 * and then show an assortment of projects from various users, but we currently do not 
 * have any of that implemented (not enough time). Home page is only the welcome modal rn, 
 * and a project explore page should be linked to from here or placed directly on the home page.
 */


const HomeViewComponent = props => {

  const goToGUI = (e) => {
    window.location.assign('/gui');
  }

  return (
    <React.Fragment>
      <NavBar vm={props.vm} />
      <Modals vm={props.vm} />

      <div className={styles.container}>

        <div  className={styles.welcomeHeader}>
          <h1> Welcome to KnitheWorld! </h1>

          <h4> Letting Students Learn Computer Science Through a Scratch Like Interface For Knitting Machines </h4>

          <Button className={styles.guiButton} onClick={goToGUI}> Get Started </Button>
        </div>

      </div>

      
    </React.Fragment>
  );
};

HomeViewComponent.propTypes = {

}

export default HomeViewComponent;