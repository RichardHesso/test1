import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Typography,
  makeStyles
} from '@material-ui/core';
import Label from './Label';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    height: 48,
    width: 48
  }
}));

const MoneyCard = ({ className, title, value, ...rest }) => {
  const classes = useStyles();
  const data = {
    value: value,
    currency: '₽',
    difference: 4
  };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box flexGrow={1}>
        <Typography
          component="h3"
          gutterBottom
          variant="overline"
          color="textSecondary"
        >
          {title}
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography
            variant="h3"
            color="textPrimary"
          >
            {data.value}
            {data.currency}
          </Typography>
          {/* <Label
            className={classes.label}
            color={data.difference > 0 ? 'success' : 'error'}
          >
            {data.difference > 0 ? '+' : ''}
            {data.difference}
            %
          </Label> */}
        </Box>
      </Box>
    </Card>
  );
};

MoneyCard.propTypes = {
  className: PropTypes.string
};

export default MoneyCard;