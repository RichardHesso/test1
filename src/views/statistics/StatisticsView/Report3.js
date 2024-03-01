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


let data1 = {
    labels: ['<1000', '1000-3000', '>3000'],
    datasets: [
      {
        label: '# of Votes',
        data: [6000, 2000, 0],
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

  let data2 = {
    labels: ['<1000', '1000-3000', '>3000'],
    datasets: [
      {
        label: '# of Votes',
        data: [1, 2, 3],
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


const Report3 = ({ className, dateRange, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [reportData1, setReportData1] = React.useState(data1)
  const [reportData2, setReportData2] = React.useState(data2)

  const getReportData = useCallback(async () => {
    try {

      if (!dateRange) return

      const response = await axios.get(`/api/finance/report3/?dateRange=${dateRange}`);
      
      const d = response.data.deposits
      const w = response.data.withdraws

      setReportData1(({...reportData1, datasets: [{...reportData1.datasets[0], data: [d['<1000'], d['1000-3000'], d['>3000']]}]}))
      setReportData2(({...reportData2, datasets: [{...reportData2.datasets[0], data: [w['<1000'], w['1000-3000'], w['>3000']]}]}))

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
        <h1 className='title'>Депозиты</h1>
            
        </div>
        <Pie data={reportData1} />

        <div className='header'>
        <h1 className='title'>Выводы</h1>
            
        </div>
        <Pie data={reportData2} />


        </Box>
    </Card>

</>
  )
}

export default Report3;


// <Box style={{float: "right"}}>
