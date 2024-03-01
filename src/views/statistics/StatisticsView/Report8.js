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
import { Pie } from 'react-chartjs-2'

const useStyles = makeStyles((theme) => ({
  root: {},
  editor: {
    '& .ql-editor': {
      height: 400
    }
  }
}));


let data = {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }


const Report8 = ({ className, dateRange, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [reportData, setReportData] = React.useState(data)

  const getReportData = useCallback(async () => {
    try {

      if (!dateRange) return

      const response = await axios.get(`/api/finance/report8/?dateRange=${dateRange}`);
      
      let labels = []
      let values = []

      response.data.deposits.forEach(element => {
        labels.push(element.payment_wallet__payment_method__name)
        values.push(element.sum)
      });

      setReportData(({...reportData, labels: labels, datasets: [{...reportData.datasets[0], data: values}]}))
      
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
            <h1 className='title'>Депозиты по методам оплаты</h1>
                
            </div>
            <Pie data={reportData} />

        </Box>
    </Card>

</>
  )
}

export default Report8;


// <Box style={{float: "right"}}>
