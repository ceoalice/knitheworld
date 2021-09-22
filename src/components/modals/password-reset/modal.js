import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {withStyles} from '@material-ui/core/styles';

import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import { closePasswordReset } from '../../../reducers/modals.js';
import Modal from "../../../containers/modal.js";
import { AuthAPI } from "../../../lib/api";

import styles from "./modal.scss";

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

const PasswordResetModal = (props) => {
  const [email, changeEmail] = React.useState("");

  const onChange = (e) => {
    changeEmail(e.target.value)
    // console.log(e.target.value);
  }

  const handleSubmit = () => {
    props.closeModal();
    AuthAPI.sendPasswordResetEmail(email);
  }

  return (
    <Modal    
    // noHeader
    className={styles.modalContent}
    id="passwordResetModal"
    contentLabel={"Reset Password"}
    onRequestClose={props.closeModal}
    >
      <div className={styles.body}>
        <FormControl className={styles.margin}>
          <InputLabel htmlFor="component-simple">Email</InputLabel>
          <StyledTextField
            fullWidth
            onChange={onChange}
          />
        </FormControl>

        <Button onClick={handleSubmit }> Send Reset Email </Button>
      </div>
    </Modal>
  )
};


PasswordResetModal.propTypes = {
    closeModal: PropTypes.func.isRequired,
    onHelp: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closePasswordReset()) 
});

export default connect(
  null,
  mapDispatchToProps
)(PasswordResetModal);