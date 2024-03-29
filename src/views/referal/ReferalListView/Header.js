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
  makeStyles
} from '@material-ui/core';
import {
  PlusCircle as PlusCircleIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  }
}));

const Header = ({ className, openClientEdit, selectedClient, ...rest }) => {
  const classes = useStyles();

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
          Рефералы
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
      {/* <Grid item>
        <Button
          color="primary"
          variant="contained"
          className={classes.action}
          onClick={e => openClientEdit(e, null)}
          startIcon={
            <SvgIcon fontSize="small">
              <PlusCircleIcon />
            </SvgIcon>
          }
        >
          Добавить клиента
        </Button>
      </Grid> */}

      <Grid item style={{display: "flex"}}>

        <Button
          //href={`/api/bot/referal/export/`}
          href={`/api/bot/referal/export/`}
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
