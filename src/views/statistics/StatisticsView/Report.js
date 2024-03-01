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
import Report1 from './Report1'
import Report2 from './Report2'
import Report5 from './Report5'
import Report6 from './Report6'
import Report9 from './Report9'
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


const Report = ({ className, dateRange, ...rest }) => {
  const classes = useStyles();

  if (!dateRange) return (
    <></>
  )

  return (
    
    <Card>
        <Grid container spacing={1}>
            <Grid item xs={4}>
                <Report1 dateRange={dateRange}/>
            </Grid>
            <Grid item xs={4}>
                <Report2 dateRange={dateRange}/>
            </Grid>
            <Grid item xs={4}>
                <Report5 dateRange={dateRange}/>
                <Report6 dateRange={dateRange}/>
            </Grid>
        </Grid>
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Report9 dateRange={dateRange}/>
            </Grid>
        </Grid>
    </Card>

  )
}

export default Report;

