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
      label: 'Бонусы',
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

const Report4 = ({ className, dateRange, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [reportData, setReportData] = React.useState({bonuses_1_5x: {days: [], values: []}, bonuses_2x: {days: [], values: []}})

  const getReportData = useCallback(async () => {
    try {

      if (!dateRange) return
      
      const response = await axios.get(`/api/finance/report4/?dateRange=${dateRange}`);
      
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
          <h1 className='title'>Бонусы 1.5х Количество</h1>
        </div>
        <Bar data={{...data, 
                    labels: reportData.bonuses_1_5x.days, 
                    datasets: [{...data.datasets[0], data: reportData.bonuses_1_5x.values, label: 'Бонусы 1.5x'}]}} 
              options={options} />
        </Box>
    </Card>
    <CardInfo title="Количество выданных бонусов 1.5х" value={reportData.bonuses_1_5x_count} />
    <CardInfo title="Сумма выданных бонусов 1.5х" value={reportData.bonuses_1_5x_summa} />
    
    <Card>
        <Box>
        <div className='header'>
          <h1 className='title'>Бонусы 2х Количество</h1>
        </div>
        <Bar data={{...data, 
                    labels: reportData.bonuses_2x.days, 
                    datasets: [{...data.datasets[0], data: reportData.bonuses_2x.values, label: 'Бонусы 2x'}]}} 
              options={options} />
        </Box>
    </Card>
    <CardInfo title="Количество выданных бонусов 2х" value={reportData.bonuses_2x_count} />
    <CardInfo title="Сумма выданных бонусов 2х" value={reportData.bonuses_2x_summa} />

</>
  )
}

export default Report4;


// <Box style={{float: "right"}}>
