import React, { useState, useRef, Suspense, lazy } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Grid,
  Card,
  Checkbox,
  InputAdornment,
  FormControlLabel,
  IconButton,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles,
  withStyles, Divider
} from '@material-ui/core';
//import { DateRangePicker, DateRange, DateRangeDelimiter } from "@material-ui/pickers";
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import DateRangeIcon from '@material-ui/icons/DateRange';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { DateRangePicker, DateRange } from "materialui-daterange-picker";
import AccountBoxRounded  from '@material-ui/icons/AccountBoxRounded';
import Pagination from '@material-ui/lab/Pagination';
import {
  Image as ImageIcon,
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import Label from '../../../components/Label';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { getBoolLabel } from './constants'
import {
  addDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  setYear
} from 'date-fns';
import MenuItem from '@material-ui/core/MenuItem';
import useSettings from '../../../hooks/useSettings'
import { LinearProgress } from '@material-ui/core';

import Report from './Report'
import Report1 from './Report1'
import Report2 from './Report2'
import Report3 from './Report3'
import Report4 from './Report4'
import Report5 from './Report5'
import Report6 from './Report6'
import Report7 from './Report7'
import Report8 from './Report8'

//const Report1 = lazy(() => import("./Report1"));

const useStyles = makeStyles((theme) => ({
  root: {},
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  queryField: {
    width: 500
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  categoryField: {
    flexBasis: 300,
    marginLeft: 20,
    width: 650
  },
  selectPageSize: {
    flexBasis: 300,
    marginLeft: 16,
    marginBottom: 20
  },
  availabilityField: {
    marginLeft: theme.spacing(2),
    flexBasis: 200
  },
  stockField: {
    marginLeft: theme.spacing(2)
  },
  shippableField: {
    marginLeft: theme.spacing(2)
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0
  },
  image: {
    height: 68,
    width: 68
  }
}));


const getDefaultRanges = (date) => [
  {
    label: 'Сегодня',
    startDate: date,
    endDate: date,
  },
  {
    label: 'Вчера',
    startDate: addDays(date, -1),
    endDate: addDays(date, -1),
  },
  {
    label: 'Эта неделя',
    startDate: startOfWeek(date),
    endDate: endOfWeek(date),
  },
  {
    label: 'Предыдущая неделя',
    startDate: startOfWeek(addWeeks(date, -1)),
    endDate: endOfWeek(addWeeks(date, -1)),
  },
  {
    label: 'Последние 7 дней',
    startDate: addWeeks(date, -1),
    endDate: date,
  },
  {
    label: 'Этот месяц',
    startDate: startOfMonth(date),
    endDate: endOfMonth(date),
  },
  {
    label: 'Предыдущий месяц',
    startDate: startOfMonth(addMonths(date, -1)),
    endDate: endOfMonth(addMonths(date, -1)),
  },
  {
    label: 'Всё время',
    startDate: setYear(date, 2019),
    endDate: setYear(date, 3019),
  },
];

const reportOptions = [
  {value: '0', label: 'Дашборд'},
  {value: '1', label: '1. Количество депозитов и выводов/общая сумма'},
  {value: '2', label: '2. Общее количество заявок/выполненных заявок'},
  {value: '3', label: '3. Сортировка выполненных заявок по суммам'},
  {value: '4', label: '4. Количество выданных бонусов х2/х1.5'},
  {value: '5', label: '5. Количество новых посетителей бота'},
  {value: '6', label: '6. Количество новых игроков ( сделавших депозит)'},
  {value: '7', label: '7. В какие слоты больше всего заходят/в каких больше всего выигрывают.'},
  {value: '8', label: '8. Распределения всего количества заявок по методам оплаты'},

]

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month, year].join('.');
}

const Results = ({ className, items, query, setQuery, openItemForm, ...rest }) => {

  const classes = useStyles();
  
  //const [value, setValue] = React.useState([null, null]);
  const [open, setOpen] = React.useState(false);
  //const [dateRangeText, setOpen] = React.useState(true);
  const [dateRange, setDateRange] = React.useState({startDate: '01.12.2020', endDate: '01.01.2022'});
  const [reportDateRange, setReportDateRange] = React.useState(null);
  const [report, setReport] = React.useState('0')


  const dateRangeToText = (dateRange) => {
    if (dateRange["startDate"] && dateRange["endDate"]) {
      return `${formatDate(dateRange["startDate"])} / ${formatDate(dateRange["endDate"])}`
    }
    else return " "
    // if (dateRange["label"]) {
    //   return dateRange["label"]
    // }
    // else if (dateRange["startDate"] && dateRange["endDate"]) {
    //   return `${dateRange["startDate"]} - ${dateRange["endDate"]}`
    // }
    // else return "-"
  }

  const onChangeRange = (range) => {
    console.log(range)
    setDateRange(range)
  }

  const handleChangeReport = (e, v) => {
    // console.log(e, v)
    setReport(v.props.value)
  }

  const toggle = () => setOpen(!open);

  return (
    <>
    <Card>

      <Box p={2}>
        <Box
          //display="flex"
          //alignItems="center"
        >
          
          <TextField
            className={classes.categoryField}
            label="Отчет"
            onChange={handleChangeReport}
            select
            value={report}
            variant="outlined"
          >
            {reportOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}

        </TextField>

        <FormControl style={{marginLeft:20, width:275}} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Период</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={"text"}
            value={dateRangeToText(dateRange)} //{values.password}
            //onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={toggle}
                  //onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  <DateRangeIcon />
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>

          <DateRangePicker
            open={open}
            toggle={toggle}
            onChange={(range) => onChangeRange(range)}
            definedRanges={getDefaultRanges(new Date())}
            //closeOnClickOutside={false}
          />

            {/* <Button
              color="primary"
              style={{marginLeft:20, marginTop: 20}}
              variant="contained"
              type="submit"
              //disabled={isSubmitting}
            >
              Показать
            </Button> */}
          
        </Box>
        
      </Box>

    </Card>

    <Box
      className={clsx(classes.root, className)}
      {...rest}
      style={{marginTop:20}}
    >


      {/* <Divider /> */}
        
        { report === '0' && <Report dateRange={dateRangeToText(dateRange)}/> }
        { report === '1' && <Report1 dateRange={dateRangeToText(dateRange)}/> }
        { report === '2' && <Report2 dateRange={dateRangeToText(dateRange)}/> }
        { report === '3' && <Report3 dateRange={dateRangeToText(dateRange)}/> }
        { report === '4' && <Report4 dateRange={dateRangeToText(dateRange)}/> }
        { report === '5' && <Report5 dateRange={dateRangeToText(dateRange)}/> }
        { report === '6' && <Report6 dateRange={dateRangeToText(dateRange)}/> }
        { report === '7' && <Report7 dateRange={dateRangeToText(dateRange)}/> }
        { report === '8' && <Report8 dateRange={dateRangeToText(dateRange)}/> }
      

      {/* <PerfectScrollbar>
        <Box minWidth={500}>
              
        </Box>
      </PerfectScrollbar> */}
    </Box>

    </>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired
};

Results.defaultProps = {
  items: []
};

export default Results;
