import React, {useState} from 'react';
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
  makeStyles
} from '@material-ui/core';
import {
  PlusCircle as PlusCircleIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  XCircle as XCircleIcon,
  CheckCircle as CheckCircleIcon,
  
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import axios from '../../../utils/axios';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));

const Header = ({ className, openAddItemForm, refreshResults, ...rest }) => {
  const classes = useStyles();
  const [disabledEnablePMethodListButton, setDisabledEnablePMethodListButton] = useState(false)
  const [disabledDisablePMethodListButton, setDisabledDisablePMethodListButton] = useState(false)
  
  const { enqueueSnackbar } = useSnackbar();

  const enablePMethodList = async (e) => {
    
    setDisabledEnablePMethodListButton(true);

    try {

      const response = await axios.post(`/api/finance/pmethods/enable_active/`);

      enqueueSnackbar('Успешно все включено!', {
        variant: 'success'
      });

      refreshResults();

    } catch (err) {
      console.error(err);

      enqueueSnackbar('Ошибка!', {
        variant: 'error'
      });

    }
    setDisabledEnablePMethodListButton(false);
  }

  const disablePMethodList = async (e) => {
    
    setDisabledDisablePMethodListButton(true);

    try {

      const response = await axios.post(`/api/finance/pmethods/disable_active/`);

      enqueueSnackbar('Успешно все выключено!', {
        variant: 'success'
      });

      refreshResults();

    } catch (err) {
      console.error(err);

      enqueueSnackbar('Ошибка!', {
        variant: 'error'
      });

    }
    setDisabledDisablePMethodListButton(false);
  }

  return (
    <Grid
      container
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item>
        {/* <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            variant="body1"
            color="inherit"
            to="/app"
            component={RouterLink}
          >
            Dashboard
          </Link>
          <Link
            variant="body1"
            color="inherit"
            to="/app/management"
            component={RouterLink}
          >
            Management
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Products
          </Typography>
        </Breadcrumbs> */}
        <Typography
          variant="h3"
          color="textPrimary"
        >
          Платежные методы
        </Typography>
        {/* <Box mt={2}>
          <Button
            className={classes.action}
            startIcon={
              <SvgIcon fontSize="small">
                <UploadIcon />
              </SvgIcon>
            }
          >
            Import
          </Button>
          <Button
            className={classes.action}
            startIcon={
              <SvgIcon fontSize="small">
                <DownloadIcon />
              </SvgIcon>
            }
          >
            Export
          </Button>
        </Box> */}
      </Grid>
      <Grid item>

      <Button
          color="primary"
          variant="contained"
          className={classes.action}
          onClick={e => enablePMethodList(e)}
          startIcon={
            <SvgIcon fontSize="small">
              <CheckCircleIcon />
            </SvgIcon>
          }
          disabled={disabledEnablePMethodListButton}
        >
          Включить все
        </Button>

        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          onClick={e => disablePMethodList(e)}
          startIcon={
            <SvgIcon fontSize="small">
              <XCircleIcon />
            </SvgIcon>
          }
          disabled={disabledDisablePMethodListButton}
        >
          Выключить все
        </Button>

        <Button
          color="primary"
          variant="contained"
          className={classes.action}
          onClick={e => openAddItemForm(e, null)}
          startIcon={
            <SvgIcon fontSize="small">
              <PlusCircleIcon />
            </SvgIcon>
          }
        >
          Добавить новый
        </Button>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
