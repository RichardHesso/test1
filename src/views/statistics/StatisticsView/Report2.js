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
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
      //   'rgba(54, 162, 235, 0.2)',
      //   'rgba(255, 206, 86, 0.2)',
      //   'rgba(75, 192, 192, 0.2)',
      //   'rgba(153, 102, 255, 0.2)',
      //   'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
      //   'rgba(54, 162, 235, 1)',
      //   'rgba(255, 206, 86, 1)',
      //   'rgba(75, 192, 192, 1)',
      //   'rgba(153, 102, 255, 1)',
      //   'rgba(255, 159, 64, 1)',
      ],
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

const dataset1 = {
  label: 'Депозиты сумма',
  data: [],
  backgroundColor: 'rgba(0, 0, 255, 1)',
  borderColor: 'rgba(0, 0, 255, 1)',
  borderWidth: 1,
}

const dataset2 = {
  label: 'Депозиты сумма',
  data: [],
  backgroundColor: 'rgba(0, 128, 0, 1)',
  borderColor: 'rgba(0, 128, 0, 1)',
  borderWidth: 1,
}

const Report2 = ({ className, dateRange, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [reportData, setReportData] = React.useState({deposits:{days: [], count_all: [], count_success: []}, withdraws:{days: [], count_all: [], count_success: []}})

  const getReportData = useCallback(async () => {
    try {

      if (!dateRange) return
      
      const response = await axios.get(`/api/finance/report2/?dateRange=${dateRange}`);
      console.log(response.data)
      setReportData(response.data)

    } catch (err) {
      console.error(err);
    }
  }, [dateRange]);


  useEffect(() => {
    getReportData();
  }, [getReportData]);


  if (!dateRange) return (
    <></>
  )

  return (
    <>
    <Card>
        <Box>
        <div className='header'>
          <h1 className='title'>Заявки на депозиты</h1>
        </div>
        <Bar data={{...data, 
                    labels: reportData.deposits.days, 
                    datasets: [{...dataset1, data: reportData.deposits.count_all, label: 'Все заявки на депозит'}, {...dataset2, data: reportData.deposits.count_success, label: 'Успешные заявки на депозит'}]}} 
              options={options} />
        </Box>
    </Card>
    <CardInfo title="Всего заявок на депозитов" value={reportData.all_deposits_count} />
    <CardInfo title="Всего успешных депозитов" value={reportData.success_deposits_count} />
    
    <Card>
        <Box>
        <div className='header'>
          <h1 className='title'>Заявки на вывод</h1>
        </div>
        <Bar data={{...data, 
                    labels: reportData.withdraws.days, 
                    datasets: [{...dataset1, data: reportData.withdraws.count_all, label: 'Все заявки на вывод'}, {...dataset2, data: reportData.withdraws.count_success, label: 'Успешные заявки на вывод'}]}} 
              options={options} />
        </Box>
    </Card>
    <CardInfo title="Всего заявок на вывод" value={reportData.all_withdraws_count} />
    <CardInfo title="Всего успешных выводов" value={reportData.success_withdraws_count} />

</>
  )
}

export default Report2;


// <Box style={{float: "right"}}>
