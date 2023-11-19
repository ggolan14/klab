import React, {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import 'bootstrap/dist/css/bootstrap.css';
import {expsList} from "../../actions/app_actions";
import {SetSocketStatus} from "../socket/socket_";

import PrivateAdminRoute from "./PrivateAdminRoute";
import NotAuthRoute from "./NotAuthRoute";
import PrivateRoute from "./PrivateRoute";
import NotFound from "../screens/notFound/NotFound";
import Alert from "../screens/alert/Alert";
import Login from "../auth/Login";
import Dashboard from "../dashboard/Dashboard";
import Navbar from "../screens/navbar/Navbar";
import ManageUsers from "../dashboard/ManageUsers";
import LogsDisplay from "../screens/logs/LogsDisplay";
import Account from "../screens/account/Account";
import Main from "../screens/main/main";
import Settings from "../screens/settings/settings";
import ConsentFormEditor from "../screens/consentForms/consent_form_editor";
import WaitForAction from "../screens/waitForAction/wait_for_action";
import PrivateSuperAdminRoute from "./PrivateSuperAdminRoute";
import RouterWrapper from "../layout/routerWrapper";
import NewExp from "../screens/expDetails/exp_details";
import Chat from "../screens/chat/chat";
import GameHandle from "../screens/gameHandle/game_handle";
import Reports from "../screens/reports/reports";
import Todo from "../screens/todo/todo";
import WaitForAction2 from "../screens/waitForAction/wait_for_action2";
// import ExpMessages from "../screens/expMessages/exp_messages";

// import VerChanges from "../screens/verChanges/ver_changes";



const MiddleRoutes = ({isAuthenticated, isGameMode, expsList, authLoading}) => {

    useEffect(() => {
        if (isAuthenticated)
            expsList();
    }, [isAuthenticated, expsList]);

    if (authLoading)
        return <WaitForAction2 />;

    return (
        <>
            <SetSocketStatus />
            <WaitForAction />
            <Alert />
            <section className={isAuthenticated && !isGameMode ? 'admin-main' : 'main'}>
                <Router>
                    {isAuthenticated && !isGameMode && <Navbar/>}
                    <Routes>
                        <Route exact path="/:exp" element={<RouterWrapper Component={GameHandle} />} />
                        <Route exact path='/' element={<PrivateRoute Component={Dashboard} />} />
                        {
                            isAuthenticated && (
                                <>
                                    <Route exact path="/manage_users" element={<PrivateSuperAdminRoute Component={ManageUsers} />} />
                                    <Route exact path="/account" element={<PrivateAdminRoute Component={Account} />} />
                                    <Route exact path="/logs/" element={<PrivateAdminRoute Component={() => <RouterWrapper Component={LogsDisplay} /> }/>} />
                                    <Route exact path="/:exp/main/" element={<PrivateAdminRoute Component={() => <RouterWrapper Component={Main} /> }/>} />
                                    <Route exact path="/settings/" element={<PrivateAdminRoute Component={() => <RouterWrapper Component={Settings} /> }/>} />
                                    <Route exact path="/consent_form_editor/" element={<PrivateAdminRoute Component={() => <RouterWrapper Component={ConsentFormEditor} /> }/>} />} />
                                    <Route exact path="/exp_details/" element={<PrivateAdminRoute Component={() => <RouterWrapper Component={NewExp} /> } />} />
                                    {/*<Route exact path="/exp_messages" element={<PrivateAdminRoute Component={() => <RouterWrapper Component={ExpMessages} /> } />} />*/}
                                    <Route exact path="/chat/" element={<PrivateAdminRoute Component={() => <RouterWrapper Component={Chat} /> } />} />
                                    <Route exact path="/reports/" element={<PrivateAdminRoute Component={() => <RouterWrapper Component={Reports} /> } />} />
                                    <Route exact path="/todo/" element={<PrivateAdminRoute Component={() => <RouterWrapper Component={Todo} /> } />} />
                                </>
                            )
                        }
                        <Route exact path='/login' element={<NotAuthRoute Component={Login} />} />
                        {/*<Route path="/changes/" element={<PrivateAdminRoute Component={VerChanges} />} />*/}
                        {/*<PrivateRoute exact path='/consent_form/' component={ConsentForm} />*/}
                        <Route exact path='/not_found' element={<NotFound />} />
                        <Route path='*' element={<NotFound />} />

                    </Routes>
                </Router>
            </section>
        </>
    );
};

MiddleRoutes.propTypes = {
    isAuthenticated: PropTypes.bool,
    isGameMode: PropTypes.bool,
    expsList: PropTypes.func.isRequired,
    authLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isGameMode: state.app.isGameMode,
    authLoading: state.auth.authLoading,
});

export default connect(mapStateToProps, {expsList})(MiddleRoutes);


