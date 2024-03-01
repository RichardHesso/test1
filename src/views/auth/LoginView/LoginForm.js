import React, { useState } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  makeStyles
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Redirect } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { useHistory } from "react-router-dom";
const useStyles = makeStyles(() => ({
  root: {}
}));

const LoginForm = ({ className, ...rest }) => {
  
  const classes = useStyles();
  const { login, user } = useAuth();
  let history = useHistory();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [is2FA, setIs2FA] = useState(false)
  
  return (
    <>
    {!is2FA && <Formik
      initialValues={{
        username: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required('Login is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        
        const res = await login(values.username, values.password)
        console.log(1111111111)
        console.log(1111111111, res)

        if (!res.error) {
          
          setStatus({ success: true });
          setSubmitting(false);

          if (res.data) {
            if (res.data.role === 'bot_user') history.push('/ref_cabinet/ref1')
          }
          else {
            setUsername(values.username);
            setPassword(values.password);
            setIs2FA(true);
          }
          console.log(22222222)

        } else {
          setStatus({ success: false });
          setErrors({ submit: res.data.detail});
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <TextField
            error={Boolean(touched.username && errors.username)}
            fullWidth
            autoFocus
            helperText={touched.username && errors.username}
            label="login"
            margin="normal"
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
            type="text"
            value={values.username}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Войти
            </Button>
          </Box>
          
        </form>
      )}
    </Formik>}
    
    {is2FA && <Formik
      initialValues={{
        otp: ''
      }}
      validationSchema={Yup.object().shape({
        otp: Yup.string().max(255).required('Otp password is required'),
      })}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {

        const res = await login(username, password, values.otp)
        
        console.log(res)
        if (!res.error) {
          setStatus({ success: true });
          setSubmitting(false);
          history.push('/orders')

        } else {
          setStatus({ success: false });
          setErrors({ submit: res.data.detail});
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <TextField
            error={Boolean(touched.otp && errors.otp)}
            fullWidth
            autoFocus
            helperText={touched.otp && errors.otp}
            label="otp пароль"
            margin="normal"
            name="otp"
            onBlur={handleBlur}
            onChange={handleChange}
            type="text"
            value={values.otp}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          <Box mt={2}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Войти
            </Button>
          </Box>
          
        </form>
      )}
    </Formik>}

    </>
  );
};

LoginForm.propTypes = {
  className: PropTypes.string,
};

export default LoginForm;
