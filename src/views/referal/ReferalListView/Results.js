import React, { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Grid,
  Card,
  Checkbox,
  InputAdornment,
  FormControlLabel,
  IconButton,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles,
  withStyles
} from '@material-ui/core';
// import { Link } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import {
  Image as ImageIcon,
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import Label from '../../../components/Label';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const categoryOptions = [
  {
    id: 'all',
    name: 'All'
  },
  {
    id: 'dress',
    name: 'Dress'
  },
  {
    id: 'jewelry',
    name: 'Jewelry'
  },
  {
    id: 'blouse',
    name: 'Blouse'
  },
  {
    id: 'beauty',
    name: 'Beauty'
  }
];

const avalabilityOptions = [
  {
    id: 'all',
    name: 'All'
  },
  {
    id: 'available',
    name: 'Available'
  },
  {
    id: 'unavailable',
    name: 'Unavailable'
  }
];

const sortOptions = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)'
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)'
  },
  {
    value: 'createdAt|desc',
    label: 'Creation date (newest first)'
  },
  {
    value: 'createdAt|asc',
    label: 'Creation date (oldest first)'
  }
];

const getInventoryLabel = (inventoryType) => {
  const map = {
    in_stock: {
      text: 'In Stock',
      color: 'success'
    },
    limited: {
      text: 'Limited',
      color: 'warning'
    },
    out_of_stock: {
      text: 'Out of Stock',
      color: 'error'
    }
  };

  const { text, color } = map[inventoryType];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
};

const applyFilters = (products, query, filters) => {
  return products.filter((product) => {
    let matches = true;

    if (query && !product.name.toLowerCase().includes(query.toLowerCase())) {
      matches = false;
    }

    if (filters.category && product.category !== filters.category) {
      matches = false;
    }

    if (filters.availability) {
      if (filters.availability === 'available' && !product.isAvailable) {
        matches = false;
      }

      if (filters.availability === 'unavailable' && product.isAvailable) {
        matches = false;
      }
    }

    if (filters.inStock && !['in_stock', 'limited'].includes(product.inventoryType)) {
      matches = false;
    }

    if (filters.isShippable && !product.isShippable) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (products, page, limit) => {
  return products.slice(page * limit, page * limit + limit);
};

const headCells = [
  { id: 'id', label: 'Id', orderBy: 'id', disabled: false },
  { id: 'chat_id', label: 'ChatId', orderBy: 'chat_id', disabled: false },
  { id: 'username', label: 'Username', orderBy: 'username', disabled: false },
  { id: 'first_name', label: 'First Name', orderBy: 'first_name', disabled: false },
  { id: 'last_name', label: 'Last Name', orderBy: 'last_name', disabled: false },
  { id: 'balance', label: 'Balance', orderBy: 'balance', disabled: false },
  { id: 'ref1_balance', label: 'Balance Ref 1', orderBy: 'ref1_balance', disabled: false },
  { id: 'ref2_balance', label: 'Balance Ref 2', orderBy: 'ref2_balance', disabled: false },
  { id: 'ref1_count', label: 'Ref 1 Count', orderBy: '', disabled: true },
  { id: 'ref2_count', label: 'Ref 2 Count', orderBy: '', disabled: true },
  { id: 'ref1_withdraw_amount', label: 'Всего выведено Ref 1', orderBy: '', disabled: true },
  { id: 'ref2_withdraw_amount', label: 'Всего выведено Ref 2', orderBy: '', disabled: true },
  { id: 'date_in', label: 'CreatedAt', orderBy: 'date_in', disabled: false },
];

const useStyles = makeStyles((theme) => ({
  root: {},
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  queryField: {
    width: 500
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  categoryField: {
    flexBasis: 200
  },
  availabilityField: {
    marginLeft: theme.spacing(2),
    flexBasis: 200
  },
  stockField: {
    marginLeft: theme.spacing(2)
  },
  shippableField: {
    marginLeft: theme.spacing(2)
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0
  },
  image: {
    height: 68,
    width: 68
  }
}));


const StyledTableCell = withStyles((theme) => ({
  // head: {
  //   backgroundColor: 'black', //theme.palette.common.black,
  //   color: 'white' //theme.palette.common.white,
  // },
  // body: {
  //   fontSize: 14,
  // },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


const Results = ({ className, clients, query, setQuery, openClientEdit, selectedClient, ...rest }) => {
  const classes = useStyles();
  const [selectedClients, setSelectedClients] = useState([]);
  const [orderBy, setOrderBy] = useState(query.ordering.replace("-", ""))
  const [orderDirection, setOrderDirection] = useState(query.ordering.startsWith('-') ? 'desc' : 'asc')

  const searchRef = useRef()

  const keyPressHandler = (event) => {
    if (event.key === 'Enter') {
        setQuery({...query, search: searchRef.current.value, page: 1})
    }
}

  const handlePageChange = (event, newPage) => {
    setQuery({...query, page: newPage})
  }

  const handleSorting = (newOrderBy) => {
    if (orderBy === newOrderBy) {
      if (orderDirection === 'asc') {
        setOrderDirection('desc')
        setQuery({...query, ordering: '-' + newOrderBy})
      } else {
        setOrderDirection('asc')
        setQuery({...query, ordering: newOrderBy})
      }
    } else {
      setOrderDirection('asc')
      setQuery({...query, ordering: newOrderBy})
      setOrderBy(newOrderBy)
    }
  }

  const isEqual = (obj1, obj2) => {
    if (obj1 && obj2) {
      if (obj1.id === obj2.id) {
        return true
      }
    }
    return false
  }

  const handleSelectAllClients = (event) => {
    setSelectedClients(event.target.checked
      ? clients.map((client) => client.id)
      : []);
  };

  const handleSelectOneClient = (event, productId) => {
    if (!selectedClients.includes(productId)) {
      setSelectedClients((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedClients((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const enableBulkOperations = selectedClients.length > 0;
  const selectedSomeClients = selectedClients.length > 0 && selectedClients.length < clients.length;
  const selectedAllClients = selectedClients.length === clients.length;

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box p={2}>
        <Box
          display="flex"
          alignItems="center"
        >
          <TextField
            className={classes.queryField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon
                    fontSize="small"
                    color="action"
                  >
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            inputRef={searchRef}
            onKeyPress={keyPressHandler}
            //onChange={handleQueryChange}
            placeholder="Поиск"
            //value={query}
            variant="outlined"
          />
          <Box flexGrow={1} />

        </Box>
        
      </Box>
      {/* {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllClients}
              indeterminate={selectedSomeClients}
              onChange={handleSelectAllClients}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              className={classes.bulkAction}
            >
              Edit
            </Button>
          </div>
        </div>
      )} */}
      <PerfectScrollbar>
        <Box minWidth={500}>
          <Table>
            <TableHead>
              <TableRow>

                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllClients}
                    indeterminate={selectedSomeClients}
                    onChange={handleSelectAllClients}
                  />
                </TableCell> */}

                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.orderBy ? orderDirection : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.orderBy}
                      direction={orderDirection}
                      disabled={headCell.disabled}
                      onClick={e => handleSorting(headCell.orderBy)}
                    >
                      {headCell.label}
                      {orderBy === headCell.orderBy ? (
                        <span className={classes.visuallyHidden}>
                          {orderDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.results.map((client) => {

                const isClientSelected = selectedClients.includes(client.id);

                return (
                  <StyledTableRow
                    hover
                    key={client.id}
                    //selected={isEqual(order, selectedOrder)}
                    onClick={e => openClientEdit(e, client)}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={isOrderSelected}
                        onChange={(event) => handleSelectOneOrder(event, order.id)}
                        value={isOrderSelected}
                      />
                    </TableCell> */}
                    
                    {headCells.map((headCell) => (
                      <TableCell key={headCell.id}>
                        {headCell['choiceMap'] ? headCell['choiceMap'](client[headCell.id]) : client[headCell.id]}
                      </TableCell>
                    ))}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>

          <Grid container justify = "center">
            <Pagination count={clients.count} showFirstButton showLastButton onChange={handlePageChange} />
          </Grid>
          
          
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  clients: PropTypes.array.isRequired
};

Results.defaultProps = {
  clients: []
};

export default Results;
