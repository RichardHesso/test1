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
import ItemForm from './ItemForm'
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

const WalletListView = () => {

  const location = useLocation();
  const history = useHistory();

  const match = matchPath(location.pathname, {
    path: "/wallets/:itemId",
    exact: true,
    strict: true
  });

  const { settings } = useSettings();

  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [selectedItemId, setSelectedItemId] = useState(match ? parseInt(match.params.itemId) : null);
  const [items, setItems] = useState({results: [], count: 0});
  const [pmethodOptions, setPmethodOptions] = useState()
  const [query, setQuery] = useState({ordering: '-id', page: 1, search: '', filterStatus: '__all__', page_size: settings.page_size })
  const [isFormOpen, setIsFormOpen] = useState(match ? true : false)

  const getItems = useCallback(async () => {
    try {
      
      let pathList = Array();

      pathList.push(`search=${query.search}`);
      pathList.push(`ordering=${query.ordering}`);
      pathList.push(`page=${query.page}`);
      pathList.push(`page_size=${query.page_size}`);
      pathList.push(`status=${(query.filterStatus === '__all__') ? '' : query.filterStatus}`);
      
      const queryPath = pathList.join('&')
      
      const response = await axios.get(`/api/finance/wallets/?${queryPath}`);
      const response_pmethods = await axios.get(`/api/finance/pmethods/`);

      if (isMountedRef.current) {
        const options = response_pmethods.data.results.map(x => {return {value: x.id, label: x.name}})
        setPmethodOptions(options)
        setItems(response.data);
      }

      if (!match) {
        setSelectedItemId(response.data.results[0].id)
        setIsFormOpen(true)
      }
      
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, query]);

  const openAddItemForm = (event, item) => {
    setIsFormOpen(true)
    setSelectedItemId(item) 
  }

  const openItemForm = (event, item) => {

    if (event.target.tagName !== 'TD') {
      return
    }

    setIsFormOpen(true)
    setSelectedItemId(item.id)
    
    if (item) {
      history.push(`/wallets/${item.id}`)
    }
    
  }

  const closeItemForm = item => {
    setIsFormOpen(false)
    setSelectedItemId(null)
  }

  const refreshResults = () => {
    getItems();
  }

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <Page
      className={classes.root}
      title="Product List"
    >
      <Container maxWidth={false}>

      <Grid container spacing={1}>
        <Grid item xs={isFormOpen ? 8 : 12}>
          <Header 
            openAddItemForm={openAddItemForm}
          />
          <Results 
            items={items} 
            query={query}
            setQuery={setQuery}
            setIsFormOpen={setIsFormOpen}
            openItemForm={openItemForm}
            pmethodOptions={pmethodOptions}
          />
        </Grid>

        {!isFormOpen 
        ? null 
        : (
          <Grid 
          item xs={4}
          style={{position: 'sticky', top: 0, height: 0}}>
            <ItemForm 
              closeItemForm={closeItemForm}
              itemId={selectedItemId}
              refreshResults={refreshResults}
              pmethodOptions={pmethodOptions}
            />
            
          </Grid>
        )}
        
      </Grid>

      </Container>
    </Page>
  );
};

export default WalletListView;
