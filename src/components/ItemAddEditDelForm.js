import React, { useCallback, useEffect, useState } from 'react';
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
import axios from '../../../utils/axios';
import ConfirmDialog from '../../../components/ConfirmDialog'
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    '& .ql-editor': {
      height: 400
    }
  }
}));


const editFields = [
    { id: 'id', label: 'Id', type: 'number', variant: 'outlined', disabled: true},
    { id: 'chat_id', label: 'ChatId', type: 'number', variant: 'outlined', disabled: true, style: {marginTop: 20} },
    { id: 'username', label: 'Username', type: 'text', variant: 'outlined', disabled: true, style: {marginTop: 20} },
    { id: 'first_name', label: 'First Name', type: 'text', variant: 'outlined', disabled: true, style: {marginTop: 20} },
    { id: 'last_name', label: 'Last Name', type: 'text', variant: 'outlined', disabled: true, style: {marginTop: 20} },
    { id: 'balance', label: 'Balance', type: 'number', variant: 'outlined', disabled: true, style: {marginTop: 20} },
    { id: 'date_in', label: 'CreatedAt', type: 'text', variant: 'outlined', disabled: true, style: {marginTop: 20} },
  ];

const addFields = [
    { id: 'username', label: 'Username', defaultValue: '11', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20} },
    { id: 'first_name', label: 'First Name', defaultValue: '', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20} },
    { id: 'last_name', label: 'Last Name', defaultValue: '', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20} },
    { id: 'balance', label: 'Balance', defaultValue: '', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 20} },
    { id: 'date_in', label: 'CreatedAt', defaultValue: '', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20} },
];

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

const ProductCreateForm = ({ className, closeClientEdit, client, refreshResults, ...rest }) => {
  const classes = useStyles();

  const fields = client ? editFields : addFields
  const initFormValues = client ? client : getInitFormValues(addFields)
  
  const [initialValues, setInitialValues] = useState(initFormValues)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { enqueueSnackbar } = useSnackbar();

  const deletePost = () => {
      console.log('deletePost')
  }

  const getClient = useCallback(async () => {
    try {
      
      if (!client) {
        setInitialValues(initFormValues)
        return
      }

      const response = await axios.get(`/api/bot/user/${client.id}/`);

    Object.keys(response.data).forEach(function(key) {
        if(response.data[key] === null) {
            response.data[key] = '';
        }
    })
    
    setInitialValues(response.data)

    } catch (err) {
      console.error(err);
    }
  }, [client]);

  useEffect(() => {
    getClient();
  }, [getClient]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...initialValues,
        submit: null
      }}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting,
      }) => {
        try {
            
            const response = await axios.patch(`/api/bot/update/${client.id}/`, {
                first_name: values.first_name,
                last_name: values.last_name
            });

            refreshResults();
            //values.id = 1111111

            setStatus({ success: true });
            setSubmitting(false);

            enqueueSnackbar('Product Created', {
                variant: 'success'
            });

          // NOTE: Make API request
        //   setStatus({ success: true });
        //   setSubmitting(false);
        //   history.push('/app/products');
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
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
                  <CardHeader title="Карточка клиента" />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid item xs={10}>

                        {fields.map(field => (
                            <TextField
                                fullWidth
                                style={field.style}
                                disabled={field.disabled}
                                label={field.label}
                                name={field.id}
                                type={field.type}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values[field.id]}
                                variant={field.variant}
                            />
                        ))}

                      </Grid>
                      </Grid>
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
          <Box mt={2}>
            
            {(client) ? (

            <>

            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              Cохранить
            </Button>
          
            <Button
              variant="contained"
              type="button"
              disabled={isSubmitting}
              onClick={closeClientEdit}
            >
              Закрыть
            </Button>
            <Button
              color="secondary"
              variant="contained"
              type="button"
              disabled={isSubmitting}
              onClick={() => setConfirmOpen(true)}
            >
              Удалить
            </Button>

            <ConfirmDialog
                title="Удалить клиента?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={deletePost}
            >
                Вы уверены что хотите удалить клиента?
            </ConfirmDialog>
            </>
            ) : (
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              Добавить
            </Button>
            )}

            </Box>  
        </form>
      )}
    </Formik>
  );
};

ProductCreateForm.propTypes = {
  className: PropTypes.string
};

// export default ProductCreateForm;
