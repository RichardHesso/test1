import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  SvgIcon,
  Typography,
  InputAdornment,
  FormControlLabel,
  IconButton,
  TextField,
  makeStyles
} from '@material-ui/core';
import {
  PlusCircle as PlusCircleIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from 'react-feather';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import DateRangeIcon from '@material-ui/icons/DateRange';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { DateRangePicker, DateRange } from "materialui-daterange-picker";
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

const useStyles = makeStyles((theme) => ({
  root: {},
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
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

const Header = ({ className, openOrderForm, selectedOrder, ...rest }) => {
  
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({startDate: '2019-01-01T00:00', endDate: '2022-01-01T00:00'});
  
  const dateRangeToText = (dateRange) => {
    if (dateRange["startDate"] && dateRange["endDate"]) {
      return `${dateRange["startDate"]} / ${dateRange["endDate"]}`
    }
    else return " "
  }

  const getUrl = (dateRange) => {
    return `/api/finance/orders/export/?dateRange=${dateRangeToText(dateRange)}`
  }

  const onChangeRange = (range) => {
    console.log(range)
    setDateRange(range)
  }

  const handlerExportButton = (e) => {
    window.open(getUrl(dateRange))
  }
  
  const toggle = () => setOpen(!open);
  
  return (
    <Grid
      container
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item>
        <Typography variant="h3" color="textPrimary" >
          Заявки
        </Typography>
      </Grid>
      <Grid item style={{display: "flex"}}>

        {/* <FormControl style={{marginLeft:20, width:275}} variant="outlined">
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
        /> */}

      <TextField
          id="datetime-local"
          label="С"
          type="datetime-local"
          defaultValue={dateRange.startDate}
          onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
            id="datetime-local"
            label="По"
            type="datetime-local"
            defaultValue={dateRange.endDate}
            onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />

        <Button
          //href={`/api/finance/orders/export/?dateRange=${dateRangeToText(dateRange)}`}
          href={`/api/finance/orders/export/?dateRange=${dateRangeToText(dateRange)}`}
          className={classes.action}
          //onClick={handlerExportButton}
          startIcon={
            <SvgIcon fontSize="small">
              <DownloadIcon />
            </SvgIcon>
          }
        >
          Export
        </Button>
        

      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
