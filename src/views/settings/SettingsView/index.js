import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Box,
  Button,
  Container,
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
import axios from '../../../utils/axios';
import Page from '../../../components/Page';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import Header from './Header';
import Results from './Results';
import BotForm from './BotForm'
import BotTokenForm from './BotTokenForm'
import RefForm from './RefForm'
import MessageForm from './MessageForm'
import CasinoForm from './CasinoForm'
import { useLocation, matchPath, useHistory } from 'react-router-dom';
import useSettings from '../../../hooks/useSettings';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

const SettingsView = () => {

  const location = useLocation();
  const history = useHistory();

  const { settings } = useSettings();

  const classes = useStyles();


  return (
    <Page
      className={classes.root}
      title="Settings"
    >
      <Container maxWidth={false}>
        <Header />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          {/* <CustomerEditForm customer={customer} /> */}

          <BotTokenForm/>
          <BotForm/>
          <CasinoForm/>
          <RefForm/>
          <MessageForm/>

        </Container>
      </Box>
    </Page>
  );
};

export default SettingsView;
