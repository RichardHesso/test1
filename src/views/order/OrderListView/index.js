import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import axios from '../../../utils/axios';
import Page from '../../../components/Page';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import Header from './Header';
import Results from './Results';
import OrderForm from './OrderForm'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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

const OrderListView = () => {

  const location = useLocation();
  const history = useHistory();

  const match = matchPath(location.pathname, {
    path: "/orders/:orderId",
    exact: true,
    strict: true
  });

  const { settings } = useSettings();

  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [selectedOrder, setSelectedOrder] = useState(match ? {id: parseInt(match.params.orderId)} : null);
  const [orders, setOrders] = useState({results: [], count: 0});
  
  const [query, setQuery] = useState({ordering: '-id', page: 1, search: '', filterStatus: '__all__', filterOrderType: '__all__', page_size: settings.page_size })
  
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(match ? true : false)

  const getOrders = useCallback(async () => {
    try {
      
      let pathList = Array();

      pathList.push(`search=${query.search}`);
      pathList.push(`ordering=${query.ordering}`);
      pathList.push(`page=${query.page}`);
      pathList.push(`status=${(query.filterStatus === '__all__') ? '' : query.filterStatus}`);
      pathList.push(`order_type=${(query.filterOrderType === '__all__') ? '' : query.filterOrderType}`);
      pathList.push(`page_size=${query.page_size}`);
      
      const queryPath = pathList.join('&')
      
      const response = await axios.get(`/api/finance/orders/?${queryPath}`);

      console.log(response.data)

      if (isMountedRef.current) {
        setOrders(response.data);
      }
      
      if (!match) {
        setSelectedOrder({id: response.data.results[0].id})
        setIsOrderFormOpen(true)
      }

    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, query]);

  const openOrderForm = (event, order) => {

    if (event.target.tagName !== 'TD') {
      return
    }
    setIsOrderFormOpen(true)
    setSelectedOrder(order)

    history.push(`/orders/${order.id}`)
  }

  const closeOrderForm = order => {
    setIsOrderFormOpen(false)
    setSelectedOrder(null)
  }

  const refreshResults = () => {
    getOrders();
  }

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <Page
      className={classes.root}
      title="Product List"
    >
      <Container maxWidth={false}>

      <Grid container spacing={1}>
        <Grid item xs={isOrderFormOpen ? 8 : 12}>
          <Header 
            openOrderForm={openOrderForm}
            selectedOrder={selectedOrder}
          />
          <Results 
            orders={orders} 
            query={query}
            setQuery={setQuery}
            setIsOrderFormOpen={setIsOrderFormOpen}
            openOrderForm={openOrderForm}
            selectedOrder={selectedOrder}
          />
        </Grid>

        {!isOrderFormOpen 
        ? null 
        : (
          <Grid 
          item xs={4} 
          style={{position: 'sticky', top: 0, height: 0}}>
            <OrderForm 
              closeOrderForm={closeOrderForm}
              orderId={selectedOrder.id}
              refreshResults={refreshResults}
            />
            
          </Grid>
        )}
        
      </Grid>

      </Container>
    </Page>
  );
};

export default OrderListView;
