import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {withStyles} from '@material-ui/core/styles';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import styles from "./account.scss";

import UserManager from "../../lib/user-manager"

const SigninInput = withStyles({
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

const Signin = props => {
  const [form, setForm] = React.useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(form);
  }

  const handleChange = async (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  };

  return (
    <form className={styles.signin} onSubmit={handleSubmit}>
      <FormControl>
        <InputLabel htmlFor="component-simple"> Email</InputLabel> { /* Username or */}
        <SigninInput
          name='identifier'
          onChange={handleChange}
          id="identifier-input"
        />
      </FormControl>

      <FormControl>
        <InputLabel htmlFor="component-simple">Password</InputLabel>
        <SigninInput
          name='password'
          // fullWidth
          type="password"
          // defaultValue={props.name}
          onChange={handleChange}
          id="password-input"
        />
      </FormControl>
      <Button
        type="submit"
        className={styles.button}
      >
          Login
      </Button>
    </form>
  );
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  // openJoin: () => dispatch(openJoin()),
});

Signin.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

Signin.defaultProps = {

}

export default connect(null,mapDispatchToProps)(Signin);