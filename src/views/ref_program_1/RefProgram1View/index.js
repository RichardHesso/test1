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
import { useLocation, matchPath, useHistory } from 'react-router-dom';
import useSettings from '../../../hooks/useSettings';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MoneyCard from '../../../components/MoneyCard'
import MyTable from '../../../components/MyTable'
import { getStatusLabel } from './constants'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

const indexToTabName = {
  0: 'balance',
  1: 'referals',
}

const tabNameToIndex = {
  'balance': 0,
  'referals': 1,
}

const headCellsRef1Adds = [
  //{ id: 'id', label: '№', orderBy: 'id' },
  { id: 'amount', label: 'Сумма', orderBy: 'amount', disabled: false },
  { id: 'created_at', label: 'Создано', orderBy: 'created_at', disabled: false },
  //{ id: 'mes_type', label: 'Тип', orderBy: 'mes_type', choiceMap: getMesTypeLabel },
  //{ id: 'text', label: 'Текст', orderBy: 'text' },
  // { id: 'file_id', label: 'File id', orderBy: 'file_id' },
  //{ id: 'status', label: 'Статус', orderBy: 'status', choiceMap: getStatusLabel },
  //{ id: 'created_at', label: 'Создана', orderBy: 'created_at' },
  //{ id: 'finished_at', label: 'Завершена', orderBy: 'finished_at' },
];

const headCellsRef1Deposits = [
  { id: 'amount', label: 'Сумма', orderBy: 'amount', disabled: false },
  { id: 'created_at', label: 'Создано', orderBy: 'created_at', disabled: false },
]

const headCellsRef1Withdraws = [
  { id: 'amount', label: 'Сумма', orderBy: 'amount', disabled: false },
  { id: 'wallet', label: 'Кошелек', orderBy: '', disabled: true },
  { id: 'pmethod', label: 'Платежный способ', orderBy: '', disabled: true },
  { id: 'created_at', label: 'Создано', orderBy: 'created_at', disabled: false },
  { id: 'status', label: 'Статус', orderBy: 'status', choiceMap: getStatusLabel, disabled: false },
];

const headCellsRef1Users = [
  { id: 'id', label: 'Id', orderBy: 'id', disabled: false },
  { id: 'chat_id', label: 'ChatId', orderBy: 'chat_id', disabled: false },
  { id: 'username', label: 'Username', orderBy: 'username', disabled: false },
  { id: 'first_name', label: 'First Name', orderBy: 'first_name', disabled: false },
  { id: 'last_name', label: 'Last Name', orderBy: 'last_name', disabled: false },
  { id: 'balance', label: 'Balance', orderBy: 'balance', disabled: false },
  //{ id: 'ref1_balance', label: 'Balance Ref 1', orderBy: 'ref1_balance', disabled: false },
  //{ id: 'ref2_balance', label: 'Balance Ref 2', orderBy: 'ref2_balance', disabled: false },
  { id: 'date_in', label: 'CreatedAt', orderBy: 'date_in', disabled: false },
]

const RefProgram1View = () => {

  const location = useLocation();
  const history = useHistory();

  const { settings } = useSettings();

  const [selectedTab, setSelectedTab] = useState(tabNameToIndex['balance']);

  const [refInfo, setRefInfo] = useState({ref1_balance: 0, earned_total: 0, withdraw_total: 0})

  const getRefInfo = useCallback(async () => {
    try {
      
      const response = await axios.get(`/api/users/ref1_user_info/`);

      // if (isMountedRef.current) {
      //   setRefInfo(response.data);
      // }

      setRefInfo(response.data);

      
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getRefInfo();
  }, [getRefInfo]);

  // useEffect(() => {
  //   setSelectedTab(tabNameToIndex[match ? match.params.pageId : 'ref1'])
  // }, [location]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const classes = useStyles();


  return (
    <>
    <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
          <Tab label="Баланс" />
          <Tab label="Рефералы" />  
    </Tabs>

    <Page
      className={classes.root}
      title="Реферальный кабинет"
    >
      {/* <Container maxWidth={false}>
        <Header />
      </Container> */}
      <Box mt={3}>
      
      {selectedTab === 0 &&
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs>
              <MoneyCard title='Баланс' value={refInfo.ref1_balance}/>
            </Grid>
            <Grid item xs>
              <MoneyCard title='Всего заработано' value={refInfo.earned_total}/>
            </Grid>
            <Grid item xs>
              <MoneyCard title='Всего выведено' value={refInfo.withdraw_total}/>
            </Grid>
          </Grid>

          <Grid container spacing={3}>

            <Grid item xs={12}>
              <h3>Начисления</h3>
              <MyTable 
                urlPath={'/api/finance/ref_additions/'}
                headCells={headCellsRef1Adds}
                extraQuery={'ref_system=ref1'}
              />
            </Grid>
            <Grid item xs={12}>
              <h3>Выводы</h3>
              <MyTable 
                urlPath={'/api/finance/ref_withdraws/'}
                headCells={headCellsRef1Withdraws}
                extraQuery={'withdraw_type=ref1'}
              />
            </Grid>
          </Grid>

        </Container>
      }

      {selectedTab === 1 &&
        <Container maxWidth="xl">

          <Grid container spacing={3}>

            <Grid item xs={12}>
              <h3>Рефералы</h3>
              <MyTable 
                urlPath={'/api/bot/referal_users/'}
                headCells={headCellsRef1Users}
                extraQuery={'ref_system=ref1'}
              />
            </Grid>
            <Grid item xs={12}>
              <h3>Депозиты рефералов</h3>
              <MyTable 
                urlPath={'/api/finance/referal_additions/'}
                headCells={headCellsRef1Deposits}
                extraQuery={'user__ref_system=ref1'}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <h3>Выводы рефералов</h3>
              <MyTable 
                urlPath={'/api/finance/ref_withdraws/'}
                headCells={headCellsRef1Withdraws}
                extraQuery={'withdraw_type=ref1'}
              />
            </Grid> */}
          </Grid>

        </Container>
      }

      </Box>
    </Page>
    </>
  );
};

export default RefProgram1View;
