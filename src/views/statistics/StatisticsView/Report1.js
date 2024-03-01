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
import Label from '../../../components/Label';
import MenuItem from '@material-ui/core/MenuItem';
import axios from '../../../utils/axios';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../../../components/ConfirmDialog'
import { useSnackbar } from 'notistack';
import { statusNametoId, statusIdtoName, order_typeIdtoName } from './constants'
import CardInfo from "./CardInfo"
import { Bar } from 'react-chartjs-2'

const useStyles = makeStyles((theme) => ({
  root: {},
  editor: {
    '& .ql-editor': {
      height: 400
    }
  }
}));


const data = {
  labels: [],
  datasets: [
    {
      label: 'Депозиты сумма',
      data: [],
      backgroundColor: 'rgba(0, 0, 255, 1)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
}

const options = {
  scales: {
      
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
}


const Report1 = ({ className, dateRange, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [reportData, setReportData] = React.useState({deposits_dynamic: {days: [], values: []}, withdraws_dynamic: {days: [], values: []}})

  const getReportData = useCallback(async () => {
    try {

      if (!dateRange) return

      const response = await axios.get(`/api/finance/report1/?dateRange=${dateRange}`);
      
      setReportData(response.data)
      // setReportData(({...reportData, labels: days, datasets: [{...reportData.datasets[0], data: values}]}))

    } catch (err) {
      console.error(err);
    }
  }, [dateRange]);


  useEffect(() => {
    getReportData()
  }, [getReportData]);

  if (!dateRange) return (
    <></>
  )

  return (
    <>
    
    <Card>
        <Box>
        <div className='header'>
          <h1 className='title'>Депозиты сумма</h1>
        </div>
        <Bar 
             data={{...data, 
                    labels: reportData.deposits_dynamic.days, 
                    datasets: [{...data.datasets[0], data: reportData.deposits_dynamic.values, label: 'Депозиты сумма по дням'}]}} 
              options={options} />
        </Box>
    </Card>
    <CardInfo title="Всего сумма депозитов" value={`${reportData.deposits_summa} ₽`} />
    <CardInfo title="Всего количество депозитов" value={reportData.deposits_count} />

    <Card>
        <Box>
        <div className='header'>
          <h1 className='title'>Выводы сумма</h1>
        </div>
        <Bar data={{...data, 
                    labels: reportData.withdraws_dynamic.days, 
                    datasets: [{...data.datasets[0], data: reportData.withdraws_dynamic.values, label: 'Выводы сумма по дням'}]}} 
              options={options} />
        </Box>
    </Card>
    <CardInfo title="Всего сумма выводов" value={`${reportData.withdraws_summa} ₽`} />
    <CardInfo title="Всего количество выводов" value={reportData.withdraws_count} />

    
    

</>
  )
}

export default Report1;


// <Box style={{float: "right"}}>
