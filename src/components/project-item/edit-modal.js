import PropTypes from 'prop-types';
import React from 'react';

import {withStyles} from '@material-ui/core/styles';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';

import Button from '@material-ui/core/Button';

import {ProjectAPI} from "../../lib/api";

import styles from "./modal.css";

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

const StyledTextField = withStyles({
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

const EditModalComponent = (props) => {  
  const [modalStyle] = React.useState(getModalStyle);
  const [name, setName] = React.useState(props.name);

  const onChange = (e) => {
    setName(e.target.value);
  }

  const handleSubmit = (e) => {
    console.log("CHANGED NAME");
    ProjectAPI.changeProjectName(props.id, name);
    props.handleClose(e);
  }
  
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Card style={modalStyle} className={styles.card} onClick={(ev)=> ev.stopPropagation()}>
        <CardHeader
          title="Edit Project"
        />
        <CardContent className={styles.editContent}>
          <FormControl className={styles.margin}>
            <InputLabel htmlFor="component-simple">Project Name</InputLabel>
            <StyledTextField
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
  )
}

EditModalComponent.propTypes = {
  id : PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

export default EditModalComponent;