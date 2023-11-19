import React from 'react';
import { Navigate, } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({Component, isAuthenticated}) => {
  return (
      isAuthenticated ? <Component/> : <Navigate to="/login"/>
)}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);
