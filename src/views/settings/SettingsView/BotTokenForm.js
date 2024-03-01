import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import axios from '../../../utils/axios';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../../../components/ConfirmDialog'
import { useSnackbar } from 'notistack';
import { statusNametoId, statusIdtoName, order_typeIdtoName } from './constants'

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    '& .ql-editor': {
      height: 400
    }
  }
}));


const fields = [
    { id: 'token', label: 'Token', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
]

const getInitFormValues = fields => {
    let initFormValues = {}
    fields.forEach(field => {
        Object.keys(field).forEach(function(key) {
            if (key === 'defaultValue') {
                initFormValues[field['id']] = field[key]
            }
        })
    })
    
    return initFormValues
}

const BotForm = ({ className, ...rest }) => {
  const classes = useStyles();

  const initFormValues = getInitFormValues(fields)
  
  const [item, setItem] = useState(initFormValues)

  const { enqueueSnackbar } = useSnackbar();

  const getItem = useCallback(async () => {
    try {

      const response = await axios.get(`/api/settings/bot_token_config/1/`);

      Object.keys(response.data).forEach(function(key) {
          if(response.data[key] === null) {
              response.data[key] = '';
          }
      })
      
      setItem(response.data)

    } catch (err) {
      console.error(err);
    }
  }, []);


  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
    <Formik
      enableReinitialize
      initialValues={{
        ...item
      }}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting,
      }) => {
        try {
            const response = await axios.patch(`/api/settings/bot_token_config/1/`, {
              token: values.token
            });
            enqueueSnackbar('Токен успешно установлен!', {
              variant: 'success'
            });
  
            setItem({...item, ...response.data})

            setStatus({ success: true });
            setSubmitting(false);

          // NOTE: Make API request
          //   setStatus({ success: true });
          //   setSubmitting(false);
          //   history.push('/app/products');
        } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
            enqueueSnackbar('Ошибка! ' + JSON.stringify(err.data), {
              variant: 'error'
            });
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form
          onSubmit={handleSubmit}
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              lg={12}
            >
              <Box>
                <Card>
                  <CardHeader title="ТОКЕН БОТА" />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid item xs={10}>

                        {fields.map(field => (
                          <Box>
                            {field.type === 'divider' && <Divider style={field.style} />}
                            {field.type === 'checkbox' && 
                            <FormControlLabel
                                className={classes.stockField}
                                style={field.style}
                                control={(
                                <Checkbox
                                    checked={values[field.id]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name={field.id}
                                />
                                )}
                                label={field.label}
                            /> }
                            {['text', 'multiline', 'number'].includes(field.type) &&
                            <TextField
                                fullWidth
                                multiline={(field.type === 'multiline') ? true : false}
                                select={field['options'] ? true : false}
                                style={field.style}
                                disabled={field.disabled}
                                label={field.label}
                                name={field.id}
                                type={field.type}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values[field.id]}
                                variant={field.variant}
                                InputLabelProps={{ shrink: true }}
                            >
                              {field['options'] && field['options'].map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>}
                          </Box>
                        ))}

                      </Grid>
                      </Grid>
                    
                      <Box mt={2}>
            
                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Cохранить
                        </Button>

                      </Box>  

                  </CardContent>
                </Card>
              </Box>      
            </Grid>
        </Grid>
          {errors.submit && (
            <Box mt={3}>
              <FormHelperText error>
                {errors.submit}
              </FormHelperText>
            </Box>
          )}
          
        </form>
      )}
    </Formik>

  </>
  
  )
}

BotForm.propTypes = {
  className: PropTypes.string
};

export default BotForm;


// <Box style={{float: "right"}}>