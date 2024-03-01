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


const editFields = [
    { id: 'id', label: '№', type: 'number', variant: 'outlined', disabled: false, defaultValue: ''},
    { type: 'divider', style: {marginTop: 40, marginBottom: 20}},
    { id: 'name', label: 'Название', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
    { id: 'order_bot_text', label: 'Текст заявки в  боте', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
    { id: 'confirm_payment_bot_text', label: 'Текст после подтреждния оплаты', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
    { id: 'is_blocked', label: 'IsBlocked', type: 'checkbox', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: false },
];


const addFields = [
    { id: 'name', label: 'Название', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
    { id: 'order_bot_text', label: 'Текст заявки в  боте', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
    { id: 'confirm_payment_bot_text', label: 'Текст после подтреждния оплаты', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
    { id: 'is_blocked', label: 'IsBlocked', type: 'checkbox', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: false },
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

const ItemForm = ({ className, closeItemForm, itemId, refreshResults, ...rest }) => {
  const classes = useStyles();

  const fields = itemId ? editFields : addFields
  const initFormValues = getInitFormValues(fields)
  
  const [item, setItem] = useState(initFormValues)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const refSuccessItem = useRef()

  const { enqueueSnackbar } = useSnackbar();

  const deleteItem = async (e, itemId) => {
    try {
          
      const response = await axios.delete(`/api/finance/pmethods/${itemId}/`);
      enqueueSnackbar('Успешно удален!', {
        variant: 'success'
      });
        
      refreshResults();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Ошибка! ' + JSON.stringify(err.data), {
        variant: 'error'
      });
    }
  }

  const getItem = useCallback(async () => {
    try {
      
      if (!itemId) {
        setItem(initFormValues)
        return
      }

      const response = await axios.get(`/api/finance/pmethods/${itemId}/`);

      Object.keys(response.data).forEach(function(key) {
          if(response.data[key] === null) {
              response.data[key] = '';
          }
      })
      
      setItem(response.data)

    } catch (err) {
      console.error(err);
    }
  }, [itemId]);


  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
    <Formik
      enableReinitialize
      initialValues={{
        ...item,
        submit: null
      }}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting,
      }) => {
        try {
          
          let response

          if (itemId) {
            response = await axios.patch(`/api/finance/pmethods/${itemId}/`, {
              name: values.name,
              order_bot_text: values.order_bot_text,
              confirm_payment_bot_text: values.confirm_payment_bot_text,
              is_blocked: values.is_blocked,
            });
            enqueueSnackbar('Успешно обновлено!', {
              variant: 'success'
            });
          } else {
            response = await axios.post(`/api/finance/pmethods/`, {
              name: values.name,
              order_bot_text: values.order_bot_text,
              confirm_payment_bot_text: values.confirm_payment_bot_text,
              is_blocked: values.is_blocked,
            });
            enqueueSnackbar('Успешно добавлено!', {
              variant: 'success'
            });
          }
            
            setItem({...item, ...response.data})

            setStatus({ success: true });
            setSubmitting(false);

            refreshResults();

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
                  <CardHeader title="Способ оплаты" />
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
                                    checked={values.is_blocked}
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
          <Box mt={2}>
            
            {(itemId) ? (

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
              //onClick={closeItemForm}
              component={ Link } 
              to={`/pmethods`}
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
                title="Удалить платежный способ?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={e => deleteItem(e, itemId)}
            >
                Вы уверены что хотите удалить платежный способ {item.name}?
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


  </>
  
  )
}

ItemForm.propTypes = {
  className: PropTypes.string
};

export default ItemForm;


// <Box style={{float: "right"}}>