import PropTypes from 'prop-types';
import React from 'react';
import CloseButton from '../close-button/close-button.js';
import styles from './project-item.css';
import classNames from 'classnames';


import {withStyles, makeStyles} from '@material-ui/core/styles';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';

import ProjectManager from "../../lib/project-manager.js"

import JSZip from "jszip";
import { saveAs } from 'file-saver';


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
  editContent: {
    display: 'flex',
    flexDirection : "row",
    alignItems : "center",
  },
  downloadContent: {
    display: 'flex',
    flexDirection : "column",
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
    margin : '10px 15px',  
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

function projectSize(bytes) {
  if (bytes > 1e+6) {
    return `${Math.floor(Number(bytes/1e+6))} GB`
  } else if (bytes > 1e+3) {
    return `${Math.floor(Number(bytes/1e+3))} MB`
  } else {
    return `${Number(bytes)} KB`
  }
}

/* eslint-disable react/prefer-stateless-function */
const ProjectItemComponent = (props) => {  
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  const [state, setState] = React.useState({
    thumbnail: false,
    xml: false,
  });

  const [openDownload, setOpenDownload] = React.useState(false);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };


  const handleClickDownload = (e) => {
    setOpenDownload(true);
    e.preventDefault();
    e.stopPropagation();
  }

  const handleCloseDownload = (e) => {
    setOpenDownload(false);
    e.preventDefault();
    e.stopPropagation();
  }
 
  const handleSubmitDownload = (e) => {
    let zip = new JSZip();
    console.log(props.xml);
    if (state.xml) { 
      zip.file(`${props.name}.xml`, props.xml);
    }

    if (state.thumbnail) { // && !props.isExample
      zip.file(
        `thumbnail.png`, 
        props.iconURL.replace(/^data:image\/(png|jpg);base64,/, ""), 
        {base64: true}
      );
    }

    if (state.xml || state.thumbnail) {
      zip.generateAsync({type:"blob"})
        .then(function(content) {
            // see FileSaver.js
            saveAs(content, `${props.name}.zip`);
        });
    }

    handleCloseDownload(e);
  }

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

  const handleSubmit = (e) => {
    console.log("CHANGED NAME");
    ProjectManager.changeProjectName(props.id, name);
    handleClose(e);
  }

  const { thumbnail, xml } = state;
  
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
              {
                props.lateUrl
                ? 
                <img
                className={styles.featuredImage}
                src={props.lateUrl}
                />
                :
                !props.expectingPromise
                  ?
                  <img
                  className={styles.featuredImage}
                  src={props.iconURL}
                  />
                  :
                  null
              }
          </div>

          {props.insetIconURL ? (
              <div className={styles.libraryItemInsetImageContainer}>
                  <img
                      className={styles.libraryItemInsetImage}
                      src={props.insetIconURL}
                  />
              </div>
          ) : null}

          <div className={styles.featuredText}>
            {
              !props.isExample 
              ? <span className={styles.projectSize}> {projectSize(props.size)} </span>
              : null
            }
            <span className={styles.libraryItemName}>{props.name}</span> 
            <br />
            <span className={styles.featuredDescription}>{props.description}</span>
          </div>
          
          <SaveAltIcon 
            onClick={handleClickDownload}
            style={{ color: "white" }}
            className={classNames(classes.icon,classes.save)} 
          /> 

          {
            !props.isExample 
              ? (
                <EditIcon 
                onClick={handleClick}
                style={{ color: "white" }}
                className={classNames(classes.icon,classes.edit)} 
                /> 
              ) 
              : null
          }

          {
            !props.isExample 
              ? (
                <div className={classNames(styles.closeButton)}>
                  <CloseButton
                    buttonType="trash"
                    size={CloseButton.SIZE_LARGE}
                    onClick={props.onClickClose}
                  />
                </div>
              ) 
              : null
          }
          
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
              <CardContent className={classes.editContent}>
                <FormControl className={classes.margin}>
                  <InputLabel htmlFor="component-simple">Project Name</InputLabel>
                  <CssTextField
                    fullWidth
                    defaultValue={props.name}
                    onChange={onChange}
                    id="custom-css-outlined-input"
                  />
                </FormControl>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                  Update
                </Button>
              </CardContent>  
            </Card>
          </Modal>


          <Modal
            open={openDownload}
            onClose={handleCloseDownload}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <Card style={modalStyle} className={classes.card} onClick={(ev)=> ev.stopPropagation()}>
              <CardHeader
                title="Download Project"
              />
              <CardContent className={classes.downloadContent}>
                <FormControl className={classes.margin}>
                  <FormLabel component="legend">Select Files to Download</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox color= "default" checked={thumbnail} onChange={handleChange} name="thumbnail" />}
                      label="Thumbnail"
                    />
                    <FormControlLabel
                      control={<Checkbox color= "default" checked={xml} onChange={handleChange} name="xml" />}
                      label="XML file"
                    />
                  </FormGroup>
                </FormControl>
                <Button onClick={handleSubmitDownload} variant="contained" color="primary">
                  Download
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
    size : PropTypes.number,
    disabled: PropTypes.bool,
    extensionId: PropTypes.string,
    featured: PropTypes.bool,
    hidden: PropTypes.bool,
    iconURL: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Promise)
    ]),
    insetIconURL: PropTypes.string,

    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    isExample : PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    onClickClose: PropTypes.func.isRequired,
};

ProjectItemComponent.defaultProps = {
    disabled: false,
    isExample: false,
    showPlayButton: false
};

export default ProjectItemComponent;