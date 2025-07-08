import React from 'react';
import {Link, Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './dashboard.css';
import {setGameMode} from "../../actions/app_actions";
import {getExperimentPaths} from "../../data/experiments";
import {isSuperAdminUser} from "../../utils/app_utils";
import "../content/prm/components/Styling/usefulClasses.css"
import iconHeader from "../../img/technion.png"
import Card from "../Design/Card";


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

    updateUser() {
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
        } catch (e) {

        }
    }

    componentDidMount() {
        this.props.setGameMode(false);
        if (this.props.auth && this.props.auth.user) {
            this.updateUser();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isAuthenticated && (prevProps.auth !== this.props.auth)) {
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
        const navLinks = [
            {path: '/account', text: 'Account'},
            {path: '/consent_form_editor', text: 'Consent forms'},
            {path: '/settings', text: 'Experiments settings'},
            {path: '/exp_details', text: 'Experiments details'},
            {path: '/chat', text: 'Chats'},
            {path: '/todo', text: 'Todo list'},
            {path: '/changes', text: 'Changes'},
            {path: '/reports', text: 'Reports'},
        ];
        return (
            <ul className='flex-col w-full flex justify-between h-full items-center m-0 p-3 overflow-y-scroll '>
                {navLinks.map(({path, text}) => (
                    <li key={path} className={"w-full flex justify-start items-center"} style={{minHeight: "50px"}}>
                        <Link to={{pathname: path}}
                              className={"text-clamping-sm font-exo text-black dashboard-option"}>
                            {text}
                        </Link>
                    </li>
                ))}
            </ul>
        )
    }

    expList() {

        return (
            <div className={"w-full h-full  overflow-y-scroll"}>
                <div className='dashboard-card-grid w-full'>
                    {this.state.Experiments.sort().map(
                        (exp, index) => (
                            <>
                                <Link key={'li-' + exp + '-' + index} state={{exp}}
                                      to={getExperimentPaths(exp).main_pathname}>
                                    <Card name={exp} image={iconHeader}/>
                                </Link>
                            </>
                        )
                    )
                    }
                </div>
            </div>
        )
    }

    header() {
        return (
            <div className={"w-full h-full flex justify-start items-center p-3 overflow-hidden gap-3"}>
                <img src={iconHeader} alt={"logo header"} className={"border "}
                     style={{borderRadius: "50%", height: "100%", aspectRatio: "1/1"}}/>
                <label className={"font-exo text-clamping-mid"}>
                    Hello {
                    !this.props.auth.user.name || this.props.auth.user.name === '' || this.props.auth.user.name === '-' ? (
                        <span className='klab-dashboard-panel-misname'>name is missing</span>
                    ) : (
                        <span className='font-exo font-bold'>{this.props.auth.user.name}</span>
                    )
                },
                </label>
            </div>
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

    render() {
        if (!this.state || this.state.isLoading)
            return <></>;
        if (this.state.navigate_to_exp)
            return <Navigate state={{exp: this.state.navigate_to_exp}} to={`${this.state.navigate_to_exp}/main`}/>;
        // return <Navigate to={`/${this.state.navigate_to_exp}/main`} />;

        /// need to add isValidExperiments for each index in this.props.auth.user_permissions.experiments
        try {
            return (
                <div
                    style={{backgroundColor: "#CEDFF6"}}
                    className='w-full h-full flex justify-center items-center'
                >
                    <div
                        className={"w-[80%] rounded-3xl overflow-hidden bg-white drop-shadow-xl flex flex-col"}
                        style={{height: "80dvh"}}>
                        <div style={{height: "10%"}} className={"w-full"}>
                            {this.header()}
                        </div>
                        <div
                            className='w-full flex ' style={{height: '90%'}}>
                            <div className={"w-[80%] border "}>
                                {this.expList()}
                            </div>
                            <div className={"border"} style={{width: '20%'}}>
                                {this.options()}
                            </div>
                            {isSuperAdminUser() && <div> {this.superAdmin()}</div>}
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            //// Create Error log from hear
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
