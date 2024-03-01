import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const GuestGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && ['admin', 'support', 'support2'].includes(user.role)) {
    return <Redirect to="/orders" />;
  }

  if (isAuthenticated && ['bot_user'].includes(user.role)) {
    return <Redirect to="/ref_cabinet/ref1" />;
  }

  return (
    <>
      {children}
    </>
  );
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
