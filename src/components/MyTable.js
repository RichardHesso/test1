import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import Label from './Label';
import TableSortLabel from '@material-ui/core/TableSortLabel';
// import { getMesTypeLabel, getStatusLabel } from './constants'
import MenuItem from '@material-ui/core/MenuItem';
import useSettings from '../hooks/useSettings'
import useIsMountedRef from '../hooks/useIsMountedRef';
import axios from '../utils/axios';

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
  { id: 'id', label: '№', orderBy: 'id' },
  //{ id: 'mes_type', label: 'Тип', orderBy: 'mes_type', choiceMap: getMesTypeLabel },
  { id: 'text', label: 'Текст', orderBy: 'text' },
  // { id: 'file_id', label: 'File id', orderBy: 'file_id' },
  //{ id: 'status', label: 'Статус', orderBy: 'status', choiceMap: getStatusLabel },
  { id: 'created_at', label: 'Создана', orderBy: 'created_at' },
  { id: 'finished_at', label: 'Завершена', orderBy: 'finished_at' },

  // { id: 'username', label: 'Юзер', orderBy: 'user__username' },
  // { id: 'created_at', label: 'Дата', orderBy: 'created_at' },
  // { id: 'wallet', label: 'Кошелек', orderBy: 'payment_wallet__wallet' },
  // { id: 'order_type', label: 'Тип заявки', orderBy: 'order_type', choiceMap: order_typeIdtoName },
  // { id: 'amount', label: 'Сумма', orderBy: 'amount' },
  // { id: 'status', label: 'Статус', orderBy: 'status', choiceMap: getStatusLabel },
  // { id: '', label: '', },
  //{ id: 'cancel_at', label: 'CancelAt', orderBy: 'cancel_at' },
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

const MyTable = ({ className, urlPath, headCells, extraQuery, ...rest }) => {

  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [selectedItems, setSelectedItems] = useState([]);
  const { saveSettings, settings } = useSettings();

  const [items, setItems] = useState({results: [], count: 0});
  
  const [query, setQuery] = useState({ordering: '-id', page: 1, search: '', filterStatus: '__all__', page_size: settings.page_size })
  const [orderBy, setOrderBy] = useState(query.ordering.replace("-", ""))
  const [orderDirection, setOrderDirection] = useState(query.ordering.startsWith('-') ? 'desc' : 'asc')

  const searchRef = useRef()
  

  const getItems = useCallback(async () => {
    try {
      
      let pathList = Array();

      pathList.push(`search=${query.search}`);
      pathList.push(`ordering=${query.ordering}`);
      pathList.push(`page=${query.page}`);
      pathList.push(`page_size=${query.page_size}`);
      //pathList.push(`status=${(query.filterStatus === '__all__') ? '' : query.filterStatus}`);
      
      const queryPath = pathList.join('&')
      
      const response = await axios.get(`${urlPath}?${queryPath}&${extraQuery}`);

      if (isMountedRef.current) {
        setItems(response.data);
      }

      
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef, query]);

  useEffect(() => {
    getItems();
  }, [getItems]);

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


console.log(headCells)

return (
  <Card
    className={clsx(classes.root, className)}
    {...rest}
  >

    <PerfectScrollbar>
      <Box>
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
                    onClick={e => handleSorting(headCell.orderBy)}
                    disabled={headCell.disabled}
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
                  //onClick={e => openItemForm(e, item)}
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

MyTable.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired
};

MyTable.defaultProps = {
  items: []
};

export default MyTable;
