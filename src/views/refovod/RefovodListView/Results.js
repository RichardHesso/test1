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
import { getMesTypeLabel, getStatusLabel } from './constants'
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
  //{ id: 'id', label: 'Id', orderBy: 'id', disabled: false },
  //{ id: 'chat_id', label: 'ChatId', orderBy: 'chat_id', disabled: false },
  { id: 'username', label: 'Username', orderBy: 'username', disabled: false },
  { id: 'ref1_balance', label: 'Balance Ref 1', orderBy: 'ref1_balance', disabled: false },
  { id: 'ref2_balance', label: 'Balance Ref 2', orderBy: 'ref2_balance', disabled: false },
  { id: 'ref1_count', label: 'Ref 1 Count', orderBy: '', disabled: true },
  { id: 'ref2_count', label: 'Ref 2 Count', orderBy: '', disabled: true },
  { id: 'ref1_withdraw_amount', label: 'Всего выведено Ref 1', orderBy: '', disabled: true },
  { id: 'ref2_withdraw_amount', label: 'Всего выведено Ref 2', orderBy: '', disabled: true },
  { id: 'date_in', label: 'Создан', orderBy: 'date_in', disabled: false },
];

const statusOptions = [
  {value: '__all__', label: 'Все'},
  {value: 'created', label: 'Создана'},
  {value: 'progress', label: 'В процессе'},
  {value: 'success', label: 'Успешно завершена'},
  {value: 'error', label: 'Ошибка'},
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
  }
}));

const Results = ({ className, items, query, setQuery, openItemForm, ...rest }) => {

  const classes = useStyles();
  const [selectedItems, setSelectedItems] = useState([]);
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


  const handleSelectAllItems = (event) => {
    setSelectedItems(event.target.checked
      ? items.map((item) => item.id)
      : []);
  };

  const handleSelectOneItem = (event, itemId) => {
    if (!selectedItems.includes(itemId)) {
      setSelectedItems((prevSelected) => [...prevSelected, itemId]);
    } else {
      setSelectedItems((prevSelected) => prevSelected.filter((id) => id !== itemId));
    }
  };

  const enableBulkOperations = selectedItems.length > 0;
  const selectedSomeItems = selectedItems.length > 0 && selectedItems.length < items.length;
  const selectedAllItems = selectedItems.length === items.length;

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

        </Box>
      </Box>
      

      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllItems}
              indeterminate={selectedSomeItems}
              onChange={handleSelectAllItems}
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
                    checked={selectedAllItems}
                    indeterminate={selectedSomeItems}
                    onChange={handleSelectAllItems}
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
              {items.results.map((item) => {
                
                const isOrderSelected = selectedItems.includes(item.id);

                return (
                  <StyledTableRow
                    hover
                    key={item.id}
                    //selected={isEqual(item, selectedItem)}
                    onClick={e => openItemForm(e, item)}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleSelectOneItem(event, item.id)}
                        value={isItemSelected}
                      />
                    </TableCell> */}
                    
                    {headCells.map((headCell) => (
                      <TableCell key={headCell.id}>
                        {headCell['choiceMap'] ? headCell['choiceMap'](item[headCell.id]) : item[headCell.id]}
                      </TableCell>
                    ))}
                    
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>

          <Grid container justify = "center">
            <Pagination count={items.count} showFirstButton showLastButton onChange={handlePageChange} />
          </Grid>       
          
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired
};

Results.defaultProps = {
  items: []
};

export default Results;
