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

const mesTypeOptions = [
  {value: 'text', label: 'Текстовое сообщение'},
  {value: 'photo', label: 'Фото'},
  {value: 'video', label: 'Видео'},
  {value: 'animation', label: 'Gif'},
]

const statusOptions = [
  {value: 'created', label: 'Создана'},
  {value: 'progress', label: 'В процессе'},
  {value: 'success', label: 'Успешно завершена'},
  {value: 'error', label: 'Ошибка'},
]

const ItemForm = ({ className, closeItemForm, itemId, refreshResults, pmethodOptions, ...rest }) => {
   
  const editFields = [
    //{ id: 'id', label: 'Id', type: 'number', variant: 'outlined', disabled: false, defaultValue: ''},
    //{ id: 'chat_id', label: 'ChatId', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'username', label: 'Username', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    //{ id: 'first_name', label: 'First Name', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    //{ id: 'last_name', label: 'Last Name', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref1_count', label: 'Ref 1 users count', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref2_count', label: 'Ref 2 users count', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref1_withdraw_amount', label: 'Всего выведено Ref 1', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref2_withdraw_amount', label: 'Всего выведено Ref 2', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref1_link', label: 'Ref 1 Link', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref2_link', label: 'Ref 2 Link', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'cabinet_data', label: 'Доступ в кабинет', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'date_in', label: 'Создан', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { type: 'divider', style: {marginTop: 10, marginBottom: 0, height: 7}},
    //{ id: 'balance', label: 'Balance', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref1_balance', label: 'Balance Ref 1', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref2_balance', label: 'Balance Ref 2', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref_prog1_amount', label: 'Ref 1 Bonus', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref_prog1_min_deposit', label: 'Ref 1 Min Deposit', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'ref_prog2_proc', label: 'Ref 2 Procent', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'comment', label: 'Comment', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    //{ id: 'is_blocked', label: 'IsBlocked', type: 'checkbox', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: false },
      
  ];

  const addFields = [
    //{ id: 'id', label: 'Id', type: 'number', variant: 'outlined', disabled: false, defaultValue: ''},
    //{ id: 'chat_id', label: 'ChatId', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'username', label: 'Название', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    //{ id: 'first_name', label: 'First Name', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    //{ id: 'last_name', label: 'Last Name', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    //{ id: 'ref1_count', label: 'Ref 1 users count', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    //{ id: 'ref2_count', label: 'Ref 2 users count', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    //{ id: 'ref1_withdraw_amount', label: 'Всего выведено Ref 1', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    //{ id: 'ref2_withdraw_amount', label: 'Всего выведено Ref 2', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    //{ id: 'date_in', label: 'Создан', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
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
  
  const classes = useStyles();

  const fields = itemId ? editFields : addFields
  const initFormValues = getInitFormValues(fields)
  
  const [item, setItem] = useState(initFormValues)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const refSuccessItem = useRef()

  const { enqueueSnackbar } = useSnackbar();

  const deleteItem = async (e, itemId) => {
    try {
          
      const response = await axios.delete(`/api/bot/refovods/${itemId}/`);
      enqueueSnackbar('Успешно удален!', {
        variant: 'success'
      });
        
      refreshResults();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, {
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

      const response = await axios.get(`/api/bot/refovods/${itemId}/`);

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
        ...item
      }}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting,
      }) => {
        try {
          
          let response

          if (itemId) {
            console.log(values)
            response = await axios.patch(`/api/bot/refovods/${itemId}/`, {
              ref1_balance: values.ref1_balance,
              ref2_balance: values.ref2_balance,
              ref_prog1_amount: values.ref_prog1_amount || null,
              ref_prog1_min_deposit: values.ref_prog1_min_deposit || null,
              ref_prog2_proc: values.ref_prog2_proc || null,
              comment: values.comment,
              //is_blocked: values.is_blocked
            });
            enqueueSnackbar('Успешно обновлено!', {
              variant: 'success'
            });
          } else {
            response = await axios.post(`/api/bot/refovods/`, {
              username: values.username,
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
                  <CardHeader title="Рефовод" />
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
          
            {/* <Button
              variant="contained"
              type="button"
              disabled={isSubmitting}
              //onClick={closeItemForm}
              component={ Link } 
              to={`/refovods`}
            >
              Закрыть
            </Button> */}

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
                title="Удалить рефовода?"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={e => deleteItem(e, itemId)}
            >
                Вы уверены что хотите удалить рефовода {item.username}?
            </ConfirmDialog>
            </>
            ) : (
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              Cоздать рефовода
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