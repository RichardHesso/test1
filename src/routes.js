import React, {
    Suspense,
    Fragment,
    lazy
  } from 'react';
  import {
    Switch,
    Redirect,
    Route
  } from 'react-router-dom';
  import DashboardLayout from './layouts/DashboardLayout';
  import RefCabinetLayout from './layouts/RefCabinetLayout';
  //import LoadingScreen from 'src/components/LoadingScreen';
  import AuthGuard from './components/AuthGuard';
  import AuthAdminGuard from './components/AuthAdminGuard';
  import AuthAdminSupport from './components/AuthAdminSupport';
  import AuthAdminSupportSupport2 from './components/AuthAdminSupportSupport2';
  import GuestGuard from './components/GuestGuard';
  import RefCabinetGuard from './components/RefCabinetGuard';
  import { LinearProgress } from '@material-ui/core';
  
  export const renderRoutes = (routes = []) => (
    <Suspense fallback={<LinearProgress />}>
      <Switch>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;
  
          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes
                      ? renderRoutes(route.routes)
                      : <Component {...props} />}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
  
  // <Route exact path='/:page?' render={props => <DashboardLayout {...props} />} />


  const routes = [
    // {
    //   exact: true,
    //   path: '/404',
    //   component: lazy(() => import('src/views/errors/NotFoundView'))
    // },

    {
      exact: true,
      guard: GuestGuard,
      path: '/login',
      component: lazy(() => import('./views/auth/LoginView'))
    },
    {
      path: '/ref_cabinet',
      guard: RefCabinetGuard,
      layout: RefCabinetLayout,
      routes: [
        {
          exact: true,
          path: '/ref_cabinet/ref1',
          component: lazy(() => import('./views/ref_program_1/RefProgram1View'))
        },
        {
          exact: true,
          path: '/ref_cabinet/ref2',
          component: lazy(() => import('./views/ref_program_2/RefProgram2View'))
        },
      ]
    },
    {
      path: '/',
      guard: AuthGuard,
      layout: DashboardLayout,
      routes: [
        {
          guard: AuthAdminSupportSupport2,
          exact: true,
          path: '/orders',
          component: lazy(() => import('./views/order/OrderListView'))
        },
        {
          guard: AuthAdminSupportSupport2,
          exact: true,
          path: '/orders/:orderId',
          component: lazy(() => import('./views/order/OrderListView'))
        },
        {
          guard: AuthAdminSupport,
          exact: true,
          path: '/clients',
          component: lazy(() => import('./views/client/ClientListView'))
        },
        {
          guard: AuthAdminSupport,
          exact: true,
          path: '/clients/:clientId',
          component: lazy(() => import('./views/client/ClientListView'))
        },
        {
          guard: AuthAdminSupportSupport2,
          exact: true,
          path: '/pmethods',
          component: lazy(() => import('./views/pmethod/PMethodListView'))
        },
        {
          guard: AuthAdminSupportSupport2,
          exact: true,
          path: '/pmethods/:pmethodId',
          component: lazy(() => import('./views/pmethod/PMethodListView'))
        },
        {
          guard: AuthAdminSupportSupport2,
          exact: true,
          path: '/wallets',
          component: lazy(() => import('./views/wallet/WalletListView'))
        },
        {
          guard: AuthAdminSupportSupport2,
          exact: true,
          path: '/wallets/:walletId',
          component: lazy(() => import('./views/wallet/WalletListView'))
        },
        {
          guard: AuthAdminSupport,
          exact: true,
          path: '/settings',
          component: lazy(() => import('./views/settings/SettingsView'))
        },
        {
          guard: AuthAdminSupport,
          exact: true,
          path: '/statistics',
          component: lazy(() => import('./views/statistics/StatisticsView'))
        },
        {
          exact: true,
          path: '/compaigns',
          component: lazy(() => import('./views/compaign/CompaignListView'))
        },
        {
          guard: AuthAdminSupport,
          exact: true,
          path: '/compaigns/:compaignId',
          component: lazy(() => import('./views/compaign/CompaignListView'))
        },
        {
          guard: AuthAdminSupport,
          exact: true,
          path: '/periodic_compaigns/:compaignId',
          component: lazy(() => import('./views/periodicCompaign/PeriodicCompaignListView'))
        },
        {
          guard: AuthAdminSupport,
          exact: true,
          path: '/periodic_compaigns',
          component: lazy(() => import('./views/periodicCompaign/PeriodicCompaignListView'))
        },
        {
          //exact: true,
          guard: AuthAdminGuard,
          path: '/users',
          component: lazy(() => import('./views/user/UserListView'))
        },
        {
          guard: AuthAdminSupport,
          //exact: true,
          path: '/entry_logs',
          component: lazy(() => import('./views/entryLog/EntryLogListView'))
        },
        {
          guard: AuthAdminSupport,
          //exact: true,
          path: '/referals',
          component: lazy(() => import('./views/referal/ReferalListView'))
        },
        {
          guard: AuthAdminSupport,
          //exact: true,
          path: '/refovods',
          component: lazy(() => import('./views/refovod/RefovodListView'))
        },
        {
          guard: AuthAdminSupportSupport2,
          exact: true,
          path: '/',
          component: () => <Redirect to="/orders" />
        },
      ]
    },
  ];
  
  export default routes;
  