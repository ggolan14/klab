import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from '../../../actions/auth';

const Navbar = ({auth: {loading}, logout}) => {
    const authLinks = (
        <ul
            style={{
                margin: 0
            }}
        >
            <li>
                <a onClick={logout} href='/'>
                    <i className='fas fa-sign-out-alt'/>{' '}
                    <span className='hide-sm'>Disconnect</span>
                </a>
            </li>
        </ul>
    );

    return (
        <nav
            className={'navbar bg-dark '}
        >
            <label
                style={{
                    margin: 0
                }}
            >
                <Link to='/'>
                    <i className='fas fa-code'/> Home
                </Link>
            </label>
            {!loading && authLinks}
        </nav>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {logout}
)(Navbar);
