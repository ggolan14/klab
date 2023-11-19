import React from 'react';
import { Navigate, } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {isSuperAdminUser} from "../../utils/app_utils";

const PrivateSuperAdminRoute = ({Component, isAuthenticated}) => {
    return (isAuthenticated && isSuperAdminUser()) ? <Component /> : <Navigate to="/" />
}

PrivateSuperAdminRoute.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(PrivateSuperAdminRoute);
