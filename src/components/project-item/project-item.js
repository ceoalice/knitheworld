import PropTypes from 'prop-types';
import React from 'react';
import CloseButton from '../close-button/close-button.js';
import styles from './project-item.css';
import classNames from 'classnames';


import {withStyles, makeStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';

import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';

import ProjectManager from "../../lib/project-manager.js"


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  card: {
    position: 'absolute',
    width: 350,
    backgroundColor: "#fff",
    padding: '25px',
    borderRadius: "10px",
    outline: 0
  },
  cardContent: {
    display: 'flex',
    flexDirection : "row",
    alignItems : "center",
  },
  icon: {
    '&:hover': {
      backgroundColor: "hsla(0, 0%, 0%, 0.4)",
    },
    backgroundColor: "hsla(0, 0%, 0%, 0.15)",
    borderRadius: '50%',
    padding: '2px',
    position: 'absolute',
    margin : '15px 15px',  
  },
  edit: {
    right : 0,
    bottom: 0,
  },
  save: {
    right : 0,
    bottom: 30,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    position: 'absolute',
    display: 'flex',
    flexDirection : "column",
    alignItems : "center",
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'hsla(215, 100%, 65%, 1)',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'hsla(215, 100%, 65%, 1)',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'hsla(215, 100%, 65%, 1)',
      },
      '&:hover fieldset': {
        borderColor: 'hsla(215, 100%, 65%, 1)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'hsla(215, 100%, 65%, 1)',
      },
    },
  },
})(Input);



/* eslint-disable react/prefer-stateless-function */
const ProjectItemComponent = (props) => {  
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const handleClick = (e) => {
    setOpen(true);
    e.preventDefault();
    e.stopPropagation();
  }

  const handleClose = (e) => {
    setOpen(false);
    e.preventDefault();
    e.stopPropagation();
  }

  const onChange = (e) => {
    setName(e.target.value);
  }

  const handlesubmit = (e) => {
    console.log("CHANGED NAME");
    ProjectManager.changeProjectName(props.id, name);
    handleClose(e);
  }
  
    return (
        <div className={
          classNames(
            styles.libraryItem,
            styles.featuredItem,
            props.hidden ? styles.hidden : null
          )}
          onClick={props.onClick}
        >
          <div className={styles.featuredImageContainer}>
              <img
                  className={styles.featuredImage}
                  src={props.iconURL}
              />
          </div>

          {/* {props.insetIconURL ? (
              <div className={styles.libraryItemInsetImageContainer}>
                  <img
                      className={styles.libraryItemInsetImage}
                      src={props.insetIconURL}
                  />
              </div>
          ) : null} */}
          
          <SaveAltIcon 
            onClick={handleClick}
            style={{ color: "white" }}
            className={classNames(classes.icon,classes.save)} 
          /> 

          <EditIcon 
            onClick={handleClick}
            style={{ color: "white" }}
            className={classNames(classes.icon,classes.edit)} 
          /> 

          <div className={classNames(styles.closeButton)}>
            <CloseButton
              buttonType="trash"
              size={CloseButton.SIZE_LARGE}
              onClick={props.onClickClose}
            />
          </div>

          <div className={styles.featuredText}>
            <span className={styles.libraryItemName}>{props.name}</span> 
            <br />
            <span className={styles.featuredDescription}>{props.description}</span>
          </div>
          
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <Card style={modalStyle} className={classes.card} onClick={(ev)=> ev.stopPropagation()}>
              <CardHeader
                title="Edit Project"
              />
              <CardContent className={classes.cardContent}>
                <CssTextField
                  fullWidth
                  className={classes.margin}
                  defaultValue={props.name}
                  onChange={onChange}
                  id="custom-css-outlined-input"
                />
                <Button onClick={handlesubmit} variant="contained" color="primary">
                  Update
                </Button>
              </CardContent>  
            </Card>
          </Modal>
        </div>
    )

}
/* eslint-enable react/prefer-stateless-function */


ProjectItemComponent.propTypes = {
    description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),

    disabled: PropTypes.bool,
    extensionId: PropTypes.string,
    featured: PropTypes.bool,
    hidden: PropTypes.bool,
    iconURL: PropTypes.string,
    insetIconURL: PropTypes.string,

    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),

    onClick: PropTypes.func.isRequired,
    onClickClose: PropTypes.func.isRequired,
    onNameUpdate: PropTypes.func
};

ProjectItemComponent.defaultProps = {
    disabled: false,
    showPlayButton: false
};

export default ProjectItemComponent;
