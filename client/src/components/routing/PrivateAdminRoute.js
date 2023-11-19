import React from 'react';
import { Navigate, } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {isAdminUser} from "../../utils/app_utils";

const PrivateAdminRoute = ({Component, isAuthenticated}) => {
    return (isAuthenticated && isAdminUser()) ? <Component /> : <Navigate to="/login" />
}

PrivateAdminRoute.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(PrivateAdminRoute);
