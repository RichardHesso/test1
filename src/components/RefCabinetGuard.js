import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const RefCabinetGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (user.role) {
      if (!['bot_user'].includes(user.role)) {
        return <Redirect to="/login" />;
      }
  }

  return (
    <>
      {children}
    </>
  );
};

RefCabinetGuard.propTypes = {
  children: PropTypes.node
};

export default RefCabinetGuard;
