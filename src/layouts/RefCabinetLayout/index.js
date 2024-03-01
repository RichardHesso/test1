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

const indexToTabName = {
  0: 'ref1',
  1: 'ref2',
}

const tabNameToIndex = {
  'ref1': 0,
  'ref2': 1,
}

const RefCabinetLayout = ({ children }) => {
  //const DashboardLayout = props => {
  // const { match, history } = children;
  // const { params } = match;
  // const { page } = params;
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();
  const { logout, user } = useAuth();

  const match = matchPath(location.pathname, {
    path: "/ref_cabinet/:pageId?",
    exact: true,
    strict: true
  });

  const [selectedTab, setSelectedTab] = useState(tabNameToIndex[match ? match.params.pageId : 'ref1']);

  console.log('selectedTab', selectedTab)

  useEffect(() => {
    setSelectedTab(tabNameToIndex[match ? match.params.pageId : 'ref1'])
  }, [location]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    history.push(`/ref_cabinet/${indexToTabName[newValue]}`)
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
                  SLOT GAMES | РЕФЕРАЛЬНЫЙ КАБИНЕТ
              </Typography>
              <Button onClick={logout} color="inherit">Выйти</Button>
          </Toolbar>
      </AppBar> 
      
      <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
          <Tab label="Реф программа №1" />
          <Tab label="Реф программа №2" />  
      </Tabs>

      {children}

    </>
  );
};

RefCabinetLayout.propTypes = {
  children: PropTypes.node
};

export default RefCabinetLayout;
