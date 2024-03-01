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
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';

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
    { id: 'balance', label: 'Balance', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref1_balance', label: 'Balance Ref 1', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref2_balance', label: 'Balance Ref 2', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref_prog1_amount', label: 'Ref 1 Bonus', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref_prog1_min_deposit', label: 'Ref 1 Min Deposit', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref_prog2_proc', label: 'Ref 2 Procent', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'comment', label: 'Comment', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'is_blocked', label: 'IsBlocked', type: 'checkbox', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: false },
    { type: 'divider', style: {marginTop: 10, marginBottom: 10, height: 7}},
    { id: 'id', label: 'Id', type: 'number', variant: 'outlined', disabled: false, defaultValue: ''},
    { id: 'chat_id', label: 'ChatId', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'username', label: 'Username', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'first_name', label: 'First Name', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'last_name', label: 'Last Name', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'date_in', label: 'CreatedAt', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref1_count', label: 'Ref 1 users count', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref2_count', label: 'Ref 2 users count', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref1_withdraw_amount', label: 'Всего выведено Ref 1', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref2_withdraw_amount', label: 'Всего выведено Ref 2', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref1_link', label: 'Ref 1 Link', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref2_link', label: 'Ref 2 Link', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'cabinet_data', label: 'Доступ в кабинет', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },  
  ];



const addFields = [
    // { id: 'username', label: 'Username', defaultValue: '', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20} },
    // { id: 'first_name', label: 'First Name', defaultValue: '', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20} },
    // { id: 'last_name', label: 'Last Name', defaultValue: '', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20} },
    // { id: 'balance', label: 'Balance', defaultValue: '', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 20} },
    // { id: 'date_in', label: 'CreatedAt', defaultValue: '', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20} },
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

const ClientForm = ({ className, closeClientEdit, clientId, refreshResults, ...rest }) => {
  const classes = useStyles();

  const fields = clientId ? editFields : addFields
  const initFormValues = getInitFormValues(editFields)
  
  const [client, setClient] = useState(initFormValues)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { enqueueSnackbar } = useSnackbar();

  const deletePost = () => {
      console.log('deletePost')
  }

  const getClient = useCallback(async () => {
    try {
      
      if (!client) {
        setClient(initFormValues)
        return
      }

        const response = await axios.get(`/api/bot/referals/${clientId}/`);

        Object.keys(response.data).forEach(function(key) {
            if(response.data[key] === null) {
                response.data[key] = '';
        }
    })
    
    setClient(response.data)

    } catch (err) {
      console.error(err);
    }
  }, [clientId]);

  useEffect(() => {
    getClient();
  }, [getClient]);

  return (
    <>

    <Formik
      enableReinitialize
      initialValues={{
        ...client,
        submit: null
      }}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting,
      }) => {
        try {
            
            const response = await axios.patch(`/api/bot/referals/${clientId}/`, {
                balance: values.balance,
                ref1_balance: values.ref1_balance,
                ref2_balance: values.ref2_balance,
                ref_prog1_amount: values.ref_prog1_amount || null,
                ref_prog1_min_deposit: values.ref_prog1_min_deposit || null,
                ref_prog2_proc: values.ref_prog2_proc || null,
                comment: values.comment,
                is_blocked: values.is_blocked
            });
            
            setClient({...client, ...response.data})
            refreshResults();
            //values.id = 1111111

            setStatus({ success: true });
            setSubmitting(false);

            enqueueSnackbar('Реферал успешно обновлен!', {
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
                  <CardHeader title="Реферал" />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >

                      <Box mt={2}>
                        
                        {(client) ? (

                        <>

                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                          disabled={isSubmitting}
                          style={{marginLeft: 10}}
                        >
                          Cохранить
                        </Button>
                      
                        {/* <Button
                          variant="contained"
                          type="button"
                          disabled={isSubmitting}
                          //onClick={closeClientEdit}
                          component={ Link } 
                          to={`/clients`}
                        >
                          Закрыть
                        </Button> */}
                        {/* <Button
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
                        </ConfirmDialog> */}
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
  
  );
};

ClientForm.propTypes = {
  className: PropTypes.string
};

export default ClientForm;
