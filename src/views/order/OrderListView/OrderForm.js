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


const statusOptions = [
  {value: 'created', label: 'Создана'},
  {value: 'click_payed', label: 'Нажал оплатил'},
  {value: 'canceled', label: 'Отменена'},
  {value: 'success', label: 'Успешно завершена'},
  {value: 'error', label: 'Возникла ошибка'},
]

const order_typeOptions  = [
  {value: 'in', label: 'Депозит'},
  {value: 'out', label: 'Вывод'},
]

const withdraw_typeOptions = [
  {value: 'balance', label: 'Вывод с баланса'},
  {value: 'ref1', label: 'Вывод реф 1'},
  {value: 'ref2', label: 'Вывод реф 2'},
]

const editFields = [
    { id: 'id', label: '№', type: 'number', variant: 'outlined', disabled: false, defaultValue: ''},
    { id: 'created_at', label: 'Дата', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'amount', label: 'Сумма', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'wallet', label: 'Кошелек', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'pmethod', label: 'Платежный способ', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'order_type', label: 'Тип заявки', type: 'text', variant: 'outlined', disabled: false, options: order_typeOptions, style: {marginTop: 10}, defaultValue: '' },
    { id: 'withdraw_type', label: 'Что выводят', type: 'text', variant: 'outlined', disabled: false, options: withdraw_typeOptions, style: {marginTop: 10}, defaultValue: '' },
    { id: 'cancel_at', label: 'Дата отмены', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'operator', label: 'Оператор', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { type: 'divider', style: {marginTop: 10, marginBottom: 0, height: 7}},
    { id: 'comment', label: 'Комментарий', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 10}, defaultValue: '' },
    { id: 'status', label: 'Статус', type: 'text', variant: 'outlined', disabled: false, options: statusOptions, style: {marginTop: 10}, defaultValue: '' },
];


const addFields = []


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

const OrderForm = ({ className, closeOrderForm, orderId, refreshResults, ...rest }) => {
  const classes = useStyles();

  const fields = orderId ? editFields : addFields
  const initFormValues = getInitFormValues(fields)
  
  const [order, setOrder] = useState(initFormValues)
  const [disabledSuccessOrderButton, setDisabledSuccessOrderButton] = useState(false)
  const [disabledCancelOrderButton, setDisabledCancelOrderButton] = useState(false)
  
  console.log(initFormValues)

  const refSuccessOrder = useRef()
  const refCancelOrder = useRef()

  const { enqueueSnackbar } = useSnackbar();

  const deletePost = () => {
      console.log('deletePost')
  }

  const getOrder = useCallback(async () => {
    try {
      
      if (!order) {
        setOrder(initFormValues)
        return
      }

      const response = await axios.get(`/api/finance/order/${orderId}/`);

      Object.keys(response.data).forEach(function(key) {
          if(response.data[key] === null) {
              response.data[key] = '';
          }
      })
      
      setOrder(response.data)

    } catch (err) {
      console.error(err);
    }
  }, [orderId]);

  const successOrder = async (e, multiply) => {
    
    setDisabledSuccessOrderButton(true)

    try {
      
      console.log(order.status)
      
      if ( !((order.order_type === 'in'  && order.status === 'click_payed') ||
             (order.order_type === 'out' && order.status === 'created')) 
         ) 
      {
        enqueueSnackbar('Невозвожно выполнить это действие!', {
          variant: 'error'
        });
        setDisabledSuccessOrderButton(false)
        return
      }

      const response = await axios.post(`/api/finance/set_success/${orderId}/`, {
        multiply
      });

      getOrder()

      enqueueSnackbar('Успешно начислено!', {
        variant: 'success'
      });

      refreshResults();

    } catch (err) {
      console.error(err);

      enqueueSnackbar('Ошибка!', {
        variant: 'error'
      });

    }

    setDisabledSuccessOrderButton(false)

  }

  const cancelOrder = async (e) => {
    
    setDisabledCancelOrderButton(true)

    try {
      
      console.log(order.status)
      
      if ( !(order.order_type === 'in' && (order.status === 'created' || order.status === 'click_payed')) )
      {
        enqueueSnackbar('Невозвожно выполнить это действие!', {
          variant: 'error'
        });
        setDisabledCancelOrderButton(false)
        return
      }

      const response = await axios.post(`/api/finance/cancelOrder/${orderId}/`);

      getOrder()

      enqueueSnackbar('Успешно отменено!', {
        variant: 'success'
      });

      refreshResults();

    } catch (err) {
      console.error(err);

      enqueueSnackbar('Ошибка!', {
        variant: 'error'
      });

    }

    setDisabledCancelOrderButton(false)

  }

  useEffect(() => {
    getOrder();
  }, [getOrder]);

  return (
    <>
    <Formik
      enableReinitialize
      initialValues={{
        ...order,
        submit: null
      }}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting,
      }) => {
        try {

            const response = await axios.patch(`/api/finance/order/update/${orderId}/`, {
              status: values.status,
              comment: values.comment,
            });
            
            setOrder({...order, ...response.data})

            setStatus({ success: true });
            setSubmitting(false);

            enqueueSnackbar('Заявка успешно обновлена!', {
                variant: 'success'
            });

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
                  <CardHeader title="Заявка" />
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

                        {(order.status === 'created' && order.order_type === 'in') &&
                        <Box style={{float: "right"}}>
                        <Button
                          color="primary"
                          ref={refCancelOrder}
                          variant="contained"
                          style={{marginTop: 20}}
                          type="button"
                          disabled={disabledSuccessOrderButton}
                          onClick={e => cancelOrder(e)}
                        >
                          Отменить
                        </Button>
                        </Box>}

                        {(order.status === 'click_payed' && order.order_type === 'in') &&
                        <Box style={{float: "right"}}>
                        <Button
                          color="primary"
                          ref={refSuccessOrder}
                          variant="contained"
                          style={{marginTop: 20}}
                          type="button"
                          disabled={disabledSuccessOrderButton}
                          onClick={e => successOrder(e, 1)}
                        >
                          Начислить 1.0X
                        </Button>
                        <br/>
                        <Button
                          color="primary"
                          ref={refSuccessOrder}
                          variant="contained"
                          style={{marginTop: 20}}
                          type="button"
                          disabled={disabledSuccessOrderButton}
                          onClick={e => successOrder(e, 1.5)}
                        >
                          Начислить 1.5Х
                        </Button>
                        <br/>
                        <Button
                          color="primary"
                          ref={refSuccessOrder}
                          variant="contained"
                          style={{marginTop: 20}}
                          type="button"
                          disabled={disabledSuccessOrderButton}
                          onClick={e => successOrder(e, 2)}
                        >
                          Начислить 2.0Х
                        </Button>
                        <br/>
                        <Button
                          color="primary"
                          ref={refCancelOrder}
                          variant="contained"
                          style={{marginTop: 20}}
                          type="button"
                          disabled={disabledSuccessOrderButton}
                          onClick={e => cancelOrder(e)}
                        >
                          Отменить
                        </Button>

                        </Box>}

                        {(order.status === 'created' && order.order_type === 'out') &&
                        <Box style={{float: "right"}}>
                          <Button
                            color="primary"
                            ref={refSuccessOrder}
                            variant="contained"
                            style={{marginTop: 20}}
                            type="button"
                            disabled={disabledSuccessOrderButton}
                            onClick={e => successOrder(e, null)}
                          >
                            Выполнить
                          </Button>
                        </Box>}
                      </Grid>
                    </Grid>

                    <Box mt={2}>
            
                        {(order) ? (

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
                          //onClick={closeOrderForm}
                          component={ Link } 
                          to={`/orders`}
                        >
                          Закрыть
                        </Button>
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


    <Formik
      enableReinitialize
      initialValues={{
        add_amount: 0
      }}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting,
      }) => {
        try {

          if (values.add_amount <= 0) {
            enqueueSnackbar('Сумма должна быть больше нуля!', {
                variant: 'error'
            });
            return
          }

          const response = await axios.post(`/api/bot/add_balance/${order.bot_user_id}/`, {
              add_amount: values.add_amount,
          });

          //refreshResults();

          setStatus({ success: true });
          setSubmitting(false);
          values.add_amount = 0

          enqueueSnackbar('Баланс успешно пополнен!', {
              variant: 'success'
          });

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
        <Box mt={3}>
          <Card>
            <CardHeader title="Начислить дополнительно" />
            <Divider />
            <CardContent>
            <TextField
              fullWidth
              //style={field.style}
              //disabled={field.disabled}
              label="Сумма"
              name="add_amount"
              type="number"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.add_amount}
              variant='outlined'
            />
              <Button
                color="primary"
                variant="contained"
                type="submit"
                style={{marginTop: 20}}
                disabled={isSubmitting}
              >
                Начислить
              </Button>

            </CardContent>
          </Card>
        </Box>
        </form>
  )}
  </Formik>
  
  </>
  
  )
}

OrderForm.propTypes = {
  className: PropTypes.string
};

export default OrderForm;
