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
        label: 'IN',
        data: [],
        backgroundColor: 'rgba(0, 0, 255,1)',
        borderColor: 'rgba(0, 0, 255,1)',
        borderWidth: 1,
      },
      {
        label: 'OUT',
        data: [],
        backgroundColor: 'rgba(0, 0, 255,1)',
        borderColor: 'rgba(0, 0, 255,1)',
        borderWidth: 1,
      },
      {
        label: 'BONUS',
        data: [],
        backgroundColor: 'rgba(0, 0, 255,1)',
        borderColor: 'rgba(0, 0, 255,1)',
        borderWidth: 1,
      },
      {
        label: 'OUT REF',
        data: [],
        backgroundColor: 'rgba(0, 0, 255,1)',
        borderColor: 'rgba(0, 0, 255,1)',
        borderWidth: 1,
      },
      {
        label: 'IN - OUT - BONUS',
        data: [],
        backgroundColor: 'rgba(0, 0, 255,1)',
        borderColor: 'rgba(0, 0, 255,1)',
        borderWidth: 1,
      },
      {
        label: 'PROFIT',
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


const Report9 = ({ className, dateRange, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [reportData, setReportData] = React.useState(data)

  const getReportData = useCallback(async () => {
    try {

      if (!dateRange) return

      const response = await axios.get(`/api/finance/report9/?dateRange=${dateRange}`);
      
      const dynamic_data = response.data.dynamic_data
      //const values = response.data.diff_dynamic.values
      //const diff_summa = response.data.diff_summa

      setReportData(({...reportData, 
        labels: dynamic_data.days, 
        datasets: [{...reportData.datasets[0], data: dynamic_data.in}, 
                   {...reportData.datasets[1], data: dynamic_data.out},
                   {...reportData.datasets[2], data: dynamic_data.bonus},
                   {...reportData.datasets[3], data: dynamic_data.out_ref},
                   {...reportData.datasets[4], data: dynamic_data.in_out_bonus},
                   {...reportData.datasets[5], data: dynamic_data.profit}],
        in_summa: response.data.in_summa,
        out_summa: response.data.out_summa,
        bonus_summa: response.data.bonus_summa,
        out_ref_summa: response.data.out_ref_summa,
        in_out_bonus_summa: response.data.in_out_bonus_summa,
        profit_summa: response.data.profit_summa
      }))
      
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
        <h1 className='title'>Прибыль</h1>
            
        </div>
        <Bar data={reportData} options={options} />

        </Box>
    </Card>

    <CardInfo title="IN" value={reportData.in_summa} />
    <CardInfo title="OUT" value={reportData.out_summa} />
    <CardInfo title="BONUS" value={reportData.bonus_summa} />
    <CardInfo title="OUT REF" value={reportData.out_ref_summa} />
    <CardInfo title="IN - OUT - BONUS" value={reportData.in_out_bonus_summa} />
    <CardInfo title="PROFIT" value={reportData.profit_summa} />
</>
  )
}

export default Report9;


// <Box style={{float: "right"}}>
