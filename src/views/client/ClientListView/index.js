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
import ClientForm from './ClientForm'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useLocation, matchPath, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}));

const ClientListView = () => {
  
  const location = useLocation();
  const history = useHistory();

  const match = matchPath(location.pathname, {
    path: "/clients/:clientId",
    exact: true,
    strict: true
  });
 
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [selectedClient, setSelectedClient] = useState(match ? {id: parseInt(match.params.clientId)} : null);
  const [clients, setClients] = useState({results: [], count: 0});
  
  const [query, setQuery] = useState({ordering: 'id', page: 1, search: '' })
  
  const [isClientEditOpen, setIsClientEditOpen] = useState(match ? true : false)
  
  const getClients = useCallback(async () => {
    try {
      
      let pathList = Array();

      pathList.push(`search=${query.search}`);
      pathList.push(`ordering=${query.ordering}`);
      pathList.push(`page=${query.page}`);

      const queryPath = pathList.join('&')
      
      const response = await axios.get(`/api/bot/users/?${queryPath}`);

      console.log(response.data)

      if (isMountedRef.current) {
        setClients(response.data);
      }

      if (!match) {
        setSelectedClient({id: response.data.results[0].id})
        setIsClientEditOpen(true)
      }

    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, query]);

  const openClientEdit = (event, client) => {

    if (event.target.tagName !== 'TD') {
      return
    }
    setIsClientEditOpen(true)
    setSelectedClient(client)

    history.push(`/clients/${client.id}`)
  }

  const closeClientEdit = client => {
    setIsClientEditOpen(false)
    setSelectedClient(null)
  }

  const refreshResults = () => {
    getClients();
  }

  useEffect(() => {
    getClients();
  }, [getClients]);

  return (
    <Page
      className={classes.root}
      title="Product List"
    >
      <Container maxWidth={false}>

      <Grid container spacing={1}>
        <Grid item xs={isClientEditOpen ? 8 : 12}>
          <Header 
            openClientEdit={openClientEdit}
            selectedClient={selectedClient}
          />
          <Results 
            clients={clients} 
            query={query}
            setQuery={setQuery}
            setIsClientEditOpen={setIsClientEditOpen}
            openClientEdit={openClientEdit}
            selectedClient={selectedClient}
          />
        </Grid>

        {!isClientEditOpen 
        ? null 
        : (
          <Grid 
          item xs={4}
          style={{position: 'sticky', top: 0, height: 0}}>
            <ClientForm 
              closeClientEdit={closeClientEdit}
              clientId={selectedClient.id}
              refreshResults={refreshResults}
            />
            
          </Grid>
        )}
        
      </Grid>

      </Container>
    </Page>
  );
};

export default ClientListView;
