import PropTypes from 'prop-types';
import React from 'react';

import CloseButton from '../close-button/close-button.js';
import styles from './project-item.css';
import classNames from 'classnames';


import {
  fade,
  ThemeProvider,
  withStyles,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
// import InputBase from '@material-ui/core/InputBase';
// import InputLabel from '@material-ui/core/InputLabel';
// import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

// import FormControl from '@material-ui/core/FormControl';
// import { green } from '@material-ui/core/colors';
import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';

import ProjectManager from "../../lib/project-manager.js"


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: "#fff",
    padding: '50px',
    borderRadius: "10px",
    outline: 0
  },

  edit: {
    '&:hover': {
      backgroundColor: "hsla(0, 0%, 0%, 0.4)",
    },
    backgroundColor: "hsla(0, 0%, 0%, 0.15)",
    borderRadius: '50%',
    padding: '2px',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    display: 'flex',
    flexDirection : "row",
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
    console.log("CHANGED NAME")
    ProjectManager.changeProjectName(props.id, name);
    handleClose(e);
  }

    return (
        <div
            className={classNames(
                styles.libraryItem,
                styles.featuredItem,
                // props.extensionId ? styles.libraryItemExtension : null,
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
            
            <div
                className={styles.featuredText}
            >
                <div className={styles.projectTitle}>
                  <span className={styles.libraryItemName}>{props.name}</span> 
                  <EditIcon 
                    onClick={handleClick}
                    style={{ color: "white" }}
                    className={classes.edit} 
                    fontSize="small"/> 
                </div>

                <br />
                <span className={styles.featuredDescription}>{props.description}</span>
            </div>
            
            <div className={classNames(styles.closeButton)}>
                <CloseButton
                    buttonType="trash"
                    size={CloseButton.SIZE_LARGE}
                    onClick={props.onClickClose}
                />
            </div>

 
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper} onClick={(ev)=> ev.stopPropagation()}>
                  <CssTextField
                      fullWidth
                      className={classes.margin}
                      defaultValue={props.name}
                      onChange={onChange}
                      variant="outlined"
                      id="custom-css-outlined-input"
                    />
                  <Button onClick={handlesubmit} variant="contained" color="primary">
                    Update
                  </Button>
                </div>
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
