import React from 'react';
import { Link, Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './dashboard.css';
import {setGameMode} from "../../actions/app_actions";
import {getExperimentPaths} from "../../data/experiments";
import {isSuperAdminUser} from "../../utils/app_utils";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            isLoading: true,
            isAuthenticated: this.props.isAuthenticated,
            Experiments: [],
            auth: this.props.auth,
            navigate_to_exp: null
        };
    }

    updateUser(){
        try {
            let Experiments = this.props.auth.user.Experiments;
            if (Experiments) {
                let sc = this.state;
                sc.isLoading = false;
                sc.Experiments = Experiments;
                // if (Experiments.length === 1){
                //     sc.navigate_to_exp = Experiments[0];
                // }
                this.setState(sc);
            }
        }
        catch (e) {

        }
    }

    componentDidMount(){
        this.props.setGameMode(false);
        if (this.props.auth && this.props.auth.user){
            this.updateUser();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isAuthenticated && (prevProps.auth !== this.props.auth)){
            this.updateUser();
        }
    }

    superAdmin() {
        return (
            <div
                className='klab-dashboard-users'
            >
                <label><b><u>Administrator:</u></b></label>
                <ul
                    className='klab-dashboard-administrator'
                >
                    <li>
                        <Link
                            to={{
                                pathname: '/manage_users'
                            }}
                        >
                            Manage user
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }

    options() {
        return (
            <div
                className='klab-dashboard-users'
            >
                <label><b><u>Options:</u></b></label>
                <ul
                    className='klab-dashboard-administrator'
                >

                    <li>
                        <Link
                            to={{
                                pathname: '/account'
                            }}
                        >
                            Account
                        </Link>
                    </li>

                    <li>
                        <Link
                            to={{
                                pathname: '/consent_form_editor'
                            }}
                        >
                            Consent forms
                        </Link>
                    </li>

                    <li>
                        <Link
                            to={{
                                pathname: '/settings'
                            }}
                        >
                            Experiments settings
                        </Link>
                    </li>

                    <li>
                        <Link
                            to={{
                                pathname: '/exp_details'
                            }}
                        >
                            Experiments details
                        </Link>
                    </li>

                    <li>
                        <Link
                            to={{
                                pathname: '/chat'
                            }}
                        >
                            Chats
                        </Link>
                    </li>

                    <li>
                        <Link
                            to={{
                                pathname: '/todo'
                            }}
                        >
                            Todo list
                        </Link>
                    </li>

                    <li>
                        <Link
                            to={{
                                pathname: '/changes'
                            }}
                        >
                            Changes
                        </Link>
                    </li>

                    <li>
                        <Link
                            to={{
                                pathname: '/reports'
                            }}
                        >
                            Reports
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }

    expList(){

        return (
            <div
                className='klab-dashboard-apps'
            >
                <label><b><u>Experiments:</u></b></label>
                <ul
                    className='klab-dashboard-apps-content'
                >
                    {
                        (
                            this.state.Experiments.sort().map(
                                (exp, index) => {
                                    return (
                                        <li
                                            key={'li-' + exp + '-' + index}
                                        >
                                            <Link
                                                to={getExperimentPaths(exp).main_pathname}
                                                state={{exp}}
                                                key={'link-' + exp + '-' + index}
                                            >
                                                {exp}
                                            </Link>
                                        </li>
                                    )
                                }
                            )
                        )
                    }

                </ul>
            </div>
        )
    }

    header() {
        return (
            <label>
                Hello {
                !this.props.auth.user.name || this.props.auth.user.name === '' || this.props.auth.user.name === '-' ? (
                    <span className='klab-dashboard-panel-misname'>name is missing</span>
                ) : (
                    <span className='klab-dashboard-panel-name'>{this.props.auth.user.name}</span>
                )
            },
            </label>
        )
    }

    non_permission() {
        return (
            <div
                className='klab-user-permissions-error'
            >
                <label>There is an error with yours permissions</label>
            </div>
        )
    }

    render () {
        if (!this.state || this.state.isLoading)
            return <></>;
        if (this.state.navigate_to_exp)
            return <Navigate state={{exp: this.state.navigate_to_exp}} to={`${this.state.navigate_to_exp}/main`} />;
            // return <Navigate to={`/${this.state.navigate_to_exp}/main`} />;

        /// need to add isValidExperiments for each index in this.props.auth.user_permissions.experiments
        try {
            return (
                <div
                    className='klab-dashboard-panel'
                >
                    {this.header()}
                    <div
                        className='klab-dashboard'
                    >
                        {this.expList()}
                        {this.options()}
                        {isSuperAdminUser() && this.superAdmin()}
                    </div>
                </div>
            );
        }
        catch (e) {
            //// Create error log from hear
            // NewLog({error_name: e.name, message: e.message})
            return <></>;
        }
    }

}

Dashboard.propTypes = {
    isAuthenticated: PropTypes.bool,
    auth: PropTypes.object.isRequired,
    setGameMode: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    auth: state.auth,
});

export default connect(mapStateToProps, {setGameMode})(Dashboard);
