import './App.css';
import { Router, Switch, Redirect, Route } from 'react-router-dom';
import React, { Suspense, useContext, Fragment, lazy } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import LoginView from './views/auth/LoginView'
import { LinearProgress, ThemeProvider, jssPreset, StylesProvider, } from '@material-ui/core';
import AuthContext, { AuthProvider } from './contexts/AuthContext'
import AuthGuard from './components/AuthGuard'
import useAuth from './hooks/useAuth';
import routes, { renderRoutes } from './routes';
import { createBrowserHistory } from 'history';
import useSettings from './hooks/useSettings';
import { createTheme } from './theme';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { SnackbarProvider } from 'notistack';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const history = createBrowserHistory();

function App() {

  const { settings } = useSettings();

  const theme = createTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    theme: settings.theme
  });

  return (
        
    <ThemeProvider theme={theme}>
      <StylesProvider jss={jss}>
        <SnackbarProvider dense maxSnack={3}>
          <Router history={history}>
            <AuthProvider>  
              {renderRoutes(routes)}
            </AuthProvider>
          </Router>
        </SnackbarProvider>
      </StylesProvider>
    </ThemeProvider>

  );
}

export default App;

// const Routes = () => {
//   const { isAuthenticated } = useAuth();

//   if (isAuthenticated) {
//     return (
//       <Switch>
//           <Route exact path='/:page?' render={props => <DashboardLayout {...props} />} />
//           <Redirect from='*' to='/orders' />
//       </Switch>
//     )
//   }

//   else {
//     return (
//       <Switch>
//           <Route exact path='/login' component={LoginView} />
//           <Redirect from='*' to='/login' />
//       </Switch>
//     )
//   }

// }


// const PublicRoutes = () => (
//   <Switch>
//       <Route exact path='/login' component={LoginView} />
//       <Redirect from='*' to='/login' />
//   </Switch>
// );

// const PrivateRoutes = () => (
//   <Switch>
//       <Route exact path='/:page?' render={props => <DashboardLayout {...props} />} />
//       <Redirect from='*' to='/orders' />
//   </Switch>
// );
