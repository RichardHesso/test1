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
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles(() => ({
root: {
    width: 300,
    },
    margin: {
    //height: theme.spacing(3),
    },
  editor: {
    '& .ql-editor': {
      height: 400
    }
  }
}));

const marks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
    value: 5,
    label: '5',
    },
  ];


const fields = [
  { id: 'payout', label: 'payout', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: 1 },
  { id: 'min_bet_per_line', label: 'min_bet_per_line', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: 1 },
  { id: 'max_bet_per_line', label: 'max_bet_per_line', type: 'number', variant: 'outlined', disabled: false, style: {marginTop: 20}, defaultValue: 25 },

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


const CasinoForm = ({ className, ...rest }) => {
  const classes = useStyles();
    
  const initFormValues = getInitFormValues(fields)
  
  const [item, setItem] = useState(initFormValues)

  const { enqueueSnackbar } = useSnackbar();

  const handleChangeSlider = async (e, value) => {
    
    try {
      
    console.log(item.payout, value)

      if (item.payout == value) {
          return
      }

      const response = await axios.patch(`/api/settings/casino_config/1/`, {payout: value});

      enqueueSnackbar('Успешно обновлено!', {
        variant: 'success'
      });

      setItem({...item, ...response.data})

    } catch (err) {
        console.error(err);
        enqueueSnackbar('Ошибка! ' + JSON.stringify(err.data), {
          variant: 'error'
        });
    }
  }

  const getItem = useCallback(async () => {
    try {

      const response = await axios.get(`/api/settings/casino_config/1/`);

      Object.keys(response.data).forEach(function(key) {
          if(response.data[key] === null) {
              response.data[key] = '';
          }
      })

      setItem({...item, ...response.data})

    } catch (err) {
      console.error(err);
    }
  }, []);


  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
        <Grid
        container
        spacing={3}
        style={{marginTop: 20}}
        >
        <Grid
            item
            xs={12}
            lg={12}
        >
            <Box>
            <Card>
                <CardHeader title="НАСТРОЙКА КАЗИНО" />
                <Divider />
                <CardContent>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid item xs={10}>

                    <Typography id="discrete-slider-always" style={{marginBottom: 40}} gutterBottom>
                        RTP
                    </Typography>

                    <Slider
                        style={{marginLeft: 20}}
                        //defaultValue={parseInt(item.payout)}
                        //getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-always"
                        step={1}
                        min={1}
                        max={5}
                        value={item.payout}
                        marks={marks}
                        valueLabelDisplay="on"
                        onChangeCommitted={handleChangeSlider}
                        //onChangeCommitted={(e, v) => console.log(222222, v)}
                    />
                    </Grid>
                </Grid>
                </CardContent>
                <Divider />

                <Grid container spacing={3}>
                  <Grid item xs={10}>

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

                          if (values.min_bet_per_line >= values.max_bet_per_line) {
                            enqueueSnackbar('Минимальная ставка не может быть больше максимальной', {
                              variant: 'error'
                            });
                            return
                          }

                          const response = await axios.patch(`/api/settings/casino_config/1/`, {
                            min_bet_per_line: values.min_bet_per_line,
                            max_bet_per_line: values.max_bet_per_line,
                          });
                          enqueueSnackbar('Успешно обновлено!', {
                            variant: 'success'
                          });
                
                          setItem({...item, ...response.data})

                          setStatus({ success: true });
                          setSubmitting(false);
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
                            <Typography id="discrete-slider-always" style={{marginLeft: 20, marginTop: 20}}>
                                Размер ставок
                            </Typography>

                            <TextField
                                fullWidth
                                style={{marginLeft: 20, marginTop: 20}}
                                label="Минимальная ставка в 1 линию"
                                name="min_bet_per_line"
                                type="number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.min_bet_per_line}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            >
                            </TextField>

                            <TextField
                                fullWidth
                                style={{marginLeft: 20, marginTop: 20}}
                                label="Максимальная ставка в 1 линию"
                                name="max_bet_per_line"
                                type="number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.max_bet_per_line}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            >
                            </TextField>
     
                          <Button
                            style={{marginLeft: 20, marginTop: 20, marginBottom: 20}}
                            color="primary"
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            Cохранить
                          </Button>
                          </Grid>
                      </Grid>
                         
                      </form>
                    )}
                  </Formik>

                  </Grid>
                </Grid>


            </Card>
            </Box>      
        </Grid>
    </Grid>
  </>
  )
}

CasinoForm.propTypes = {
  className: PropTypes.string
};

export default CasinoForm;


// <Box style={{float: "right"}}>