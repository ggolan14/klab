import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Link, Redirect, useParams} from "react-router-dom";
import {setGameMode} from "../../../actions/app_actions";
import {isValidExperiment} from "../../../utils/app_utils";

const ExpMessages = ({auth, isAuthenticated, setGameMode}) => {
    let { exp } = useParams();

    useEffect(() => {
        setGameMode(false);
    }, []);

    if (!isAuthenticated)
        return <Redirect to='/login' />;

    if (!isValidExperiment(exp))
        return <Redirect to='/not_found' />;

    if (auth.user_permissions.experiments.indexOf(exp) < 0){
        return <Redirect to='/dashboard' />;
    }

    return (
        <div className='admin-exp-msg-page'>
            <label>Exp msg {exp}</label>
        </div>
    );
};

ExpMessages.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {setGameMode})(ExpMessages);


