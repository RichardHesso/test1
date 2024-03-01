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
  withStyles, Divider
} from '@material-ui/core';
import AccountBoxRounded  from '@material-ui/icons/AccountBoxRounded';
import Pagination from '@material-ui/lab/Pagination';
import {
  Image as ImageIcon,
  Edit as EditIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import Label from '../../../components/Label';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { getStatusLabel, order_typeIdtoName, withdraw_typeIdtoName, optionsPageSize } from './constants'
import MenuItem from '@material-ui/core/MenuItem';
import useSettings from '../../../hooks/useSettings'

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

const headCells = [
  { id: 'id', label: '№', orderBy: 'id', disabled: false },
  { id: 'chat_id', label: 'Id', orderBy: 'user__chat_id', disabled: false },
  { id: 'username', label: 'Юзер', orderBy: 'user__username', disabled: false },
  { id: 'fio', label: 'Имя', disabled: true },
  { id: 'created_at', label: 'Дата', orderBy: 'created_at', disabled: false },
  { id: 'pmethod', label: 'Платежный метод', orderBy: '', disabled: true },
  { id: 'wallet', label: 'Кошелек', orderBy: '', disabled: true },
  { id: 'order_type', label: 'Тип заявки', orderBy: 'order_type', choiceMap: order_typeIdtoName, disabled: false },
  //{ id: 'withdraw_type', label: 'Что выводят', orderBy: 'withdraw_type', choiceMap: withdraw_typeIdtoName, disabled: false },
  { id: 'amount', label: 'Сумма', orderBy: 'amount', disabled: false },
  { id: 'status', label: 'Статус', orderBy: 'status', choiceMap: getStatusLabel, disabled: false },
  { id: '', label: '', },
  //{ id: 'cancel_at', label: 'CancelAt', orderBy: 'cancel_at' },
];

const statusOptions = [
  {value: '__all__', label: 'Все'},
  {value: 'created', label: 'Создана'},
  {value: 'click_payed', label: 'Нажал оплатил'},
  {value: 'canceled', label: 'Отменена'},
  {value: 'success', label: 'Успешно завершена'},
  {value: 'error', label: 'Возникла ошибка'},
]

const orderTypeOptions = [
  {value: '__all__', label: 'Все'},
  {value: 'in', label: 'Депозиты'},
  {value: 'out', label: 'Выводы'},
]

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
    flexBasis: 300,
    marginLeft: 20
  },
  selectPageSize: {
    flexBasis: 300,
    marginLeft: 16,
    marginBottom: 20
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
  },
  blueCell: {
    color: 'blue'
  }
}));

const Results = ({ className, orders, query, setQuery, openOrderForm, selectedOrder, ...rest }) => {

  const classes = useStyles();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orderBy, setOrderBy] = useState(query.ordering.replace("-", ""))
  const [orderDirection, setOrderDirection] = useState(query.ordering.startsWith('-') ? 'desc' : 'asc')

  const searchRef = useRef()
  const { saveSettings, settings } = useSettings();

  const keyPressHandler = (event) => {
    if (event.key === 'Enter') {
        setQuery({...query, search: searchRef.current.value, page: 1})
    }
}

const handleFilterStatusChange = (event) => {
  setQuery({...query, filterStatus: event.target.value})
};

const handleFilterOrderTypeChange  = (event) => {
  setQuery({...query, filterOrderType: event.target.value})
};

const handlePageSizeChange = (event) => {
  setQuery({...query, page_size: event.target.value})
  saveSettings({ page_size: event.target.value });
  console.log(settings)
};

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


  const handleSelectAllOrders = (event) => {
    setSelectedOrders(event.target.checked
      ? orders.map((order) => order.id)
      : []);
  };

  const handleSelectOneOrder = (event, orderId) => {
    if (!selectedOrders.includes(orderId)) {
      setSelectedOrders((prevSelected) => [...prevSelected, orderId]);
    } else {
      setSelectedOrders((prevSelected) => prevSelected.filter((id) => id !== orderId));
    }
  };

  const enableBulkOperations = selectedOrders.length > 0;
  const selectedSomeOrders = selectedOrders.length > 0 && selectedOrders.length < orders.length;
  const selectedAllOrders = selectedOrders.length === orders.length;

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

          <TextField
            className={classes.categoryField}
            label="Статус"
            onChange={handleFilterStatusChange}
            select
            //SelectProps={{ native: true }}
            value={query.filterStatus}
            variant="outlined"
          >
            {statusOptions.map((option) => (
              // <option
              //   key={statusOption.value}
              //   value={statusOption.value}
              // >
              //   {statusOption.lable}
              // </option>
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            className={classes.categoryField}
            label="Тип заявки"
            onChange={handleFilterOrderTypeChange}
            select
            //SelectProps={{ native: true }}
            value={query.filterOrderType}
            variant="outlined"
          >
            {orderTypeOptions.map((option) => (
              // <option
              //   key={statusOption.value}
              //   value={statusOption.value}
              // >
              //   {statusOption.lable}
              // </option>
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Box flexGrow={1} />  

        </Box>
        
      </Box>

      <TextField
        className={classes.selectPageSize}
        label="записей"
        onChange={handlePageSizeChange}
        select
        //SelectProps={{ native: true }}
        value={query.page_size}
        variant="outlined"
        size="small"
      >
        {optionsPageSize.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllOrders}
              indeterminate={selectedSomeOrders}
              onChange={handleSelectAllOrders}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
            >
              Delete
            </Button>
            {/* <Button
              variant="outlined"
              className={classes.bulkAction}
            >
              Edit
            </Button> */}
          </div>
        </div>
      )}

      <Divider />

      <PerfectScrollbar>
        <Box minWidth={500}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllOrders}
                    indeterminate={selectedSomeOrders}
                    onChange={handleSelectAllOrders}
                  />
                </TableCell> */}

                {headCells.map((headCell) => (
                  <StyledTableCell
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
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.results.map((order) => {
                
                const isOrderSelected = selectedOrders.includes(order.id);

                return (
                  <StyledTableRow
                    hover
                    key={order.id}
                    //selected={isEqual(order, selectedOrder)}
                    onClick={e => openOrderForm(e, order)}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={isOrderSelected}
                        onChange={(event) => handleSelectOneOrder(event, order.id)}
                        value={isOrderSelected}
                      />
                    </TableCell> */}
                    
                    {headCells.map((headCell) => (
                      <TableCell className={ order.withdraw_type.startsWith('ref') && headCell.id === 'amount' ? classes.blueCell : null } key={headCell.id}>
                        {headCell.id === 'chat_id' ? 
                          <Link href={`/clients/${order.bot_user_id}`}>{order[headCell.id]}</Link> :
                          headCell['choiceMap'] ? headCell['choiceMap'](order[headCell.id]) : order[headCell.id]}
                      </TableCell>
                    ))}
                    {/* <TableCell align="center">
                      <IconButton
                        component={RouterLink}
                        to={`/clients/${order.bot_user_id}`}
                      >
                        <SvgIcon fontSize="small">
                          <ArrowRightIcon />
                        </SvgIcon>
                      </IconButton>
                       <IconButton>
                        <SvgIcon fontSize="small">
                          <ArrowRightIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell> */}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>

          <Grid container justify = "center">
            <Pagination count={orders.count} showFirstButton showLastButton onChange={handlePageChange} />
          </Grid>       
          
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  orders: PropTypes.array.isRequired
};

Results.defaultProps = {
  orders: []
};

export default Results;
