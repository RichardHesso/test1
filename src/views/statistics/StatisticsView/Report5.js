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
        label: 'Новые пользователи',
        data: [],
        backgroundColor: 'rgba(0, 0, 255,1)',
        borderColor: 'rgba(0, 0, 255,1)',
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


const Report5 = ({ className, dateRange, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [reportData, setReportData] = React.useState(data)

  const getReportData = useCallback(async () => {
    try {

      if (!dateRange) return

      const response = await axios.get(`/api/bot/report5/?dateRange=${dateRange}`);
      
      const days = response.data.new_users.days
      const values = response.data.new_users.values
      const new_users_count = response.data.new_users_count

      setReportData(({...reportData, labels: days, datasets: [{...reportData.datasets[0], data: values}], new_users_count: new_users_count}))
      
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
        <h1 className='title'>Новые пользователи</h1>
            
        </div>
        <Bar data={reportData} options={options} />

        </Box>
    </Card>
    <CardInfo title="Общее количество" value={reportData.new_users_count} />
</>
  )
}

export default Report5;


// <Box style={{float: "right"}}>
