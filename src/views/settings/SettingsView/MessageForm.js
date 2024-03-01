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
  { id: 'oferta_text', label: 'Текст оферты', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'start_text', label: 'Текст /start', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'choose_game_text', label: 'Текст Выбор Игр', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'cabinet_text', label: 'Текст Кабинет', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'about_us', label: 'Текст О нас', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'our_chat_link', label: 'Ссылка наш чат', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'our_news_link', label: 'Ссылка Новости', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'our_otziv_link', label: 'Ссылка Отзывы', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'our_rules_link', label: 'Ссылка Правила', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'our_instructions_link', label: 'Ссылка Инструкции', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'min_add_amount_text', label: 'Текст минимальная сумма для пополнения', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'min_add_amount', label: 'Минимальная сумма для пополнения', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'ref_text', label: 'Текст Партнерка', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'ref_condition_text', label: 'Текст Условия Партнерки', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'ref_prog1_text', label: 'Текст Партнерка Программа 1', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'ref_prog2_text', label: 'Текст Партнерка Программа 2', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'ref_withdraw_text', label: 'Текст вывода в партнерке', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'ref_withdraw_link_text', label: 'Ссылка для вывода в партнерке', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'contact_text', label: 'Текст Контакты', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'contact_link_text', label: 'Ссылка для Контакты', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'tech_support_text', label: 'Текст Тех поддержка', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'tech_support_link', label: 'Ссылка Тех поддержка', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'withdraw_text', label: 'Текст вывода в кабинете', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'withdraw_link_text', label: 'Ссылка для вывода в кабинете', type: 'text', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'withdraw_min_amount_text', label: 'Текст минимальная сумма для вывода', type: 'multiline', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
  { id: 'withdraw_min_amount', label: 'Минимальная сумма для вывода', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: '' },
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

const MessageForm = ({ className, ...rest }) => {
  const classes = useStyles();

  const initFormValues = getInitFormValues(fields)
  
  const [item, setItem] = useState(initFormValues)

  const { enqueueSnackbar } = useSnackbar();

  const getItem = useCallback(async () => {
    try {

      const response = await axios.get(`/api/bot/messages/1/`);

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
            const response = await axios.patch(`/api/bot/messages/1/`, {
              oferta_text: values.oferta_text,
              start_text: values.start_text,
              choose_game_text: values.choose_game_text,
              cabinet_text: values.cabinet_text,
              about_us: values.about_us,
              our_chat_link: values.our_chat_link,
              our_news_link: values.our_news_link,
              our_otziv_link: values.our_otziv_link,
              our_rules_link: values.our_rules_link,
              our_instructions_link: values.our_instructions_link,
              min_add_amount_text: values.min_add_amount_text,
              min_add_amount: values.min_add_amount,
              ref_text: values.ref_text,
              ref_condition_text: values.ref_condition_text,
              ref_prog1_text: values.ref_prog1_text,
              ref_prog2_text: values.ref_prog2_text,
              ref_withdraw_text: values.withdraw_text,
              ref_withdraw_link_text: values.withdraw_link_text,
              withdraw_text: values.withdraw_text,
              withdraw_link_text: values.withdraw_link_text,
              contact_text: values.withdraw_text,
              contact_link_text: values.withdraw_link_text,
              tech_support_text: values.tech_support_text,
              tech_support_link: values.tech_support_link,
              withdraw_min_amount_text: values.withdraw_min_amount_text,
              withdraw_min_amount: values.withdraw_min_amount,
            });
            enqueueSnackbar('Успешно обновлено!', {
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
          style={{marginTop: 20}}
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
                  <CardHeader title="СООБЩЕНИЯ В БОТЕ" />
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

MessageForm.propTypes = {
  className: PropTypes.string
};

export default MessageForm;


// <Box style={{float: "right"}}>