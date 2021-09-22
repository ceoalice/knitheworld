import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from "./account.scss";

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
    const target = event.target;
    setForm({ ...form, 
      [target.name] : (target.type == "checkbox") 
        ? target.checked 
        : target.value 
    })
  };

  return (
    props.waiting
    ? <div className={styles.loading}> <CircularProgress /> </div>
    : <form className={styles.signin} onSubmit={handleSubmit}>
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
          type="password"
          onChange={handleChange}
          id="password-input"
        />
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            className={styles.rememberMe}
            checked={form.rememberMe}
            onChange={handleChange}
            name="rememberMe"
          />
        }
        label="Remember Me"
        id="remember-me-input"
      />

      <div onClick={props.openPasswordReset} className={styles.forgotPassword}> Forgot Password? </div>

      <Button
        type="submit"
        className={styles.button}
      >
          Login
      </Button>
    </form>
  );
}

Signin.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  openPasswordReset: PropTypes.func.isRequired
};

export default Signin;