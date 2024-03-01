import React, { useState, useContext, lazy, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useLocation, matchPath, useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
//import ClientsListView from '../../views/client/ClientsListView';
//import OrdersListView from '../../views/order/OrdersListView';
import useAuth from '../../hooks/useAuth'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));


//const OrdersListView = lazy(() => import('../../views/order/OrdersListView'))

const DashboardLayout = ({ children }) => {
//const DashboardLayout = props => {
  // const { match, history } = children;
  // const { params } = match;
  // const { page } = params;
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();
  const { logout, user } = useAuth();

  const match = matchPath(location.pathname, {
    path: "/:page?/:itemId?",
    exact: true,
    strict: true
  });

  const indexToTabName = {
      0: 'orders',
      1: 'clients',
      2: 'pmethods',
      3: 'wallets',
      4: 'settings',
      5: 'statistics',
      6: 'compaigns',
      7: 'periodic_compaigns',
      8: 'entry_logs',
      9: 'referals',
      10: 'refovods',
      11: 'users',
  }

  const tabNameToIndex = {
    'orders': 0,
    'clients': 1,
    'pmethods': 2,
    'wallets': 3,
    'settings': 4,
    'statistics': 5,
    'compaigns': 6,
    'periodic_compaigns': 7,
    'entry_logs': 8,
    'referals': 9,
    'refovods': 10,
    'users': 11,
  }

  const [selectedTab, setSelectedTab] = useState(tabNameToIndex[match ? match.params.page : 'orders']);

  //console.log(selectedTab, tabNameToIndex[match ? match.params.page : 'orders'])

  useEffect(() => {
    setSelectedTab(tabNameToIndex[match ? match.params.page : 'orders'])
  }, [location]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    history.push(`/${indexToTabName[newValue]}`)
  };

  return (
    // <div className={classes.root}>
    <>

    <AppBar position="static">
        <Toolbar>
            {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
            </IconButton> */}
            <Typography variant="h6" className={classes.title}>
                SLOT GAMES
            </Typography>
            <Button onClick={logout} color="inherit">Выйти</Button>
        </Toolbar>
    </AppBar> 
    
    <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto" >
        {['admin', 'support', 'support2'].includes(user.role) && <Tab value={0} label="Заявки" />}
        {['admin', 'support'].includes(user.role) && <Tab value={1} label="Клиенты" />}
        {['admin', 'support', 'support2'].includes(user.role) && <Tab value={2} label="Способы оплаты" />}
        {['admin', 'support', 'support2'].includes(user.role) && <Tab value={3} label="Кошельки" />}
        {['admin', 'support'].includes(user.role) && <Tab value={4} label="Настройки" />}
        {['admin', 'support'].includes(user.role) && <Tab value={5} label="Статистика" />}
        {['admin', 'support'].includes(user.role) && <Tab value={6} label="Рассылки" />}
        {['admin', 'support'].includes(user.role) && <Tab value={7} label="Переодические рассылки" />}
        {['admin', 'support'].includes(user.role) && <Tab value={8} label="Логи входов" />}
        {['admin', 'support'].includes(user.role) && <Tab value={9} label="Рефералка" />}
        {['admin', 'support'].includes(user.role) && <Tab value={10} label="Рефоводы" />}
        {['admin'].includes(user.role) && <Tab value={11} label="Пользователи" />}
    </Tabs>

     {children}

    {/* {selectedTab === 0 && <OrdersListView />}
    {selectedTab === 1 && <ClientsListView />} */}

    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node
};

export default DashboardLayout;
