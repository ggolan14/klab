// import React, { Fragment, } from 'react';
// import { Link, Redirect } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
//
// import './all_logs.css';
// import $ from 'jquery';
// import {getAllLogsExps, getRunsOfExp, getUsersOfRun, getLogsOfUser} from "../../actions/logger";
//
// const checkDigit = (i) => {
//     if (i < 10) {
//         i = "0" + i;
//     }
//     return i;
// };
//
// const getFormatDate = (date) => {
//     let new_date = new Date(date);
//     let format_date = checkDigit(new_date.getDate()) + '-' + checkDigit(new_date.getMonth() + 1) + '-' + checkDigit(new_date.getFullYear());
//     return format_date;
// }
//
// const getFormatTime = (date) => {
//     let new_date = new Date(date);
//     let format_time = checkDigit(new_date.getHours()) + ':' + checkDigit(new_date.getMinutes()) + ':' + checkDigit(new_date.getSeconds());
//     return format_time;
// }
//
// class AllLogs extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.props = props;
//
//         this.state = {
//             loading: true,
//             user: this.props.auth.user,
//             isAuthenticated: this.props.isAuthenticated,
//             exps_list: [],
//             runs_list: [],
//             users_list: [],
//             user_data: [],
//             selected_exp: null,
//             selected_run: null,
//             selected_user: null,
//             users_filter: ''
//         };
//     }
//
//     componentDidMount() {
//         this.setState({
//             loading: false
//         });
//         getAllLogsExps().then(
//             res => {
//                 try{
//                     this.setState({
//                         exps_list: res.data.exps_list
//                     });
//                 }
//                 catch (e) {
//
//                 }
//             }
//         )
//     }
//
//     selectExp(exp) {
//         this.setState({
//             loading: true,
//             selected_exp: exp,
//             selected_user: null,
//             selected_run: null,
//             runs_list: [],
//             users_list: [],
//             users_filter: '',
//         });
//
//         getRunsOfExp(exp).then(
//             res => {
//                 this.setState({
//                     loading: false,
//                     runs_list: res.data.runs_list
//                 })
//             }
//         );
//     }
//
//     selectRun(running_name) {
//         this.setState({
//             loading: true,
//             selected_run: running_name,
//             users_list: [],
//             selected_user: null,
//             users_filter: '',
//         });
//
//         getUsersOfRun(this.state.selected_exp, running_name).then(
//             res => {
//                 this.setState({
//                     loading: false,
//                     users_list: res.data.users_list
//                 })
//             }
//         );
//     }
//
//     selectUser(user_id) {
//         this.setState({
//             loading: true,
//             selected_user: user_id
//         });
//
//         getLogsOfUser(this.state.selected_exp, this.state.selected_run, user_id).then(
//             res => {
//                 this.setState({
//                     loading: false,
//                     user_data: res.data.user_data
//                 })
//             }
//         );
//     }
//
//     Options() {
//
//         return (
//             <div
//                 className='all-logs-options-panel'
//             >
//                 <div
//                     className='all-logs-options'
//                 >
//                     <label>Choose experiment:</label>
//                     <input
//                         className='all-logs-options-input'
//                         list="all-logs-options-input-exp"
//                         type="search"
//                         onChange={(e) => this.selectExp(e.target.value)}
//                         style={{width: 'max-content'}}
//                         placeholder={this.state.selected_exp || ''}
//                     />
//                     <datalist
//                         id="all-logs-options-input-exp"
//                     >
//                         {this.state.exps_list.length > 0 && (
//                             <option
//                                 disabled
//                                 value='Select...'
//                             />)
//                         }
//
//                         {
//                             this.state.exps_list.map(
//                                 exp => {
//                                 return (
//                                     <option
//                                         value={exp}
//                                         key={exp}
//                                     />
//                                 )
//                             })
//                         }
//                     </datalist>
//                 </div>
//
//                 <div
//                     className='all-logs-options'
//                 >
//                     <label>Choose running:</label>
//                     <input
//                         className={'all-logs-options-input ' + (this.state.selected_exp === null ? 'disabledElem' : '')}
//                         list="all-logs-options-input-runs"
//                         type="search"
//                         onChange={(e) => this.selectRun(e.target.value)}
//                         style={{width: 'max-content'}}
//                         placeholder={this.state.selected_run || ''}
//                     />
//                     <datalist
//                         id="all-logs-options-input-runs"
//                     >
//
//                         {this.state.runs_list.length > 0 && (
//                             <option
//                                 value='AllRuns'
//                             />)
//                         }
//
//                         {
//                             this.state.runs_list.map(
//                                 run => {
//                                     return (
//                                         <option
//                                             value={run}
//                                             key={run}
//                                         />
//                                     )
//                                 })
//                         }
//                     </datalist>
//                 </div>
//             </div>
//         )
//     }
//
//     UsersList() {
//
//         return (
//            <div
//                className='all-logs-users-panel'
//            >
//                <div
//                    className={'all-logs-users-list ' + (this.state.selected_run === null ? 'disabledElem' : '')}
//                >
//                    <div className='all-logs-users-list-input'>
//                        <input
//                            onChange={e => this.setState({
//                                users_filter: e.target.value})
//                            }
//                            placeholder='Search'
//                            value={this.state.users_filter}
//                        />
//                    </div>
//
//                    <div
//                        className='all-logs-users-list-li'
//                    >
//                        {this.state.users_list.length > 0 && (
//                            <label
//                                className={this.state.selected_user === 'AllUsers' ? 'selected-user' : ''}
//                                value='AllUsers'
//                                onClick={e => this.selectUser('AllUsers')}
//                            >
//                                AllUsers
//                            </label>
//                        )
//                        }
//                        {
//                            this.state.users_list.filter(
//                                usr => usr.includes(this.state.users_filter)
//                            ).map(
//                                user => {
//                                    return (
//                                        <label
//                                            className={this.state.selected_user === user ? 'selected-user' : ''}
//                                            value={user}
//                                            key={user}
//                                            onClick={e => this.selectUser(user)}
//                                        >
//                                            {user}
//                                        </label>
//                                    )
//                                })
//                        }
//                    </div>
//
//                </div>
//
//                <div
//                    className='all-logs-users-data'
//                >
//                    {/*permission*/}
//
//                    <table
//                        style={{
//                            display: this.state.user_data.length === 0 ? 'none' : ''
//                        }}
//                    >
//                        <thead>
//                            <tr>
//                                <th><u>user_id</u></th>
//                                <th><u>exp</u></th>
//                                <th><u>running_name</u></th>
//                                <th><u>action</u></th>
//                                <th><u>more_params</u></th>
//                                <th><u>time</u></th>
//                                <th><u>date</u></th>
//                            </tr>
//                        </thead>
//                        {
//                            this.state.user_data && (
//                                <tbody>
//                                {
//                                    this.state.user_data.map(
//                                        (data, i) => {
//                                            return (
//                                                <tr key={'tr' + data._id}>
//                                                    <td key={'l1' + data._id}>{data.user_id}</td>
//                                                    <td key={'l2' + data._id}>{data.exp}</td>
//                                                    <td key={'l3' + data._id}>{data.running_name}</td>
//                                                    <td key={'l4' + data._id}>{data.action}</td>
//                                                    <td key={'l5' + data._id}>
//                                                        <div key={'d11' + data._id}>
//                                                            {
//                                                                data.more_params && Object.keys(data.more_params).map(
//                                                                    param => (
//                                                                        <label
//                                                                            key={'ll1' + data._id + param}
//                                                                        >
//                                                                        <span
//                                                                            key={'ll2' + data._id + param}
//                                                                        >
//                                                                            {param}
//                                                                        </span>: {data.more_params[param]}
//                                                                        </label>
//                                                                    )
//                                                                )
//                                                            }
//                                                        </div>
//                                                    </td>
//                                                    <td key={'l6' + data._id}>{getFormatTime(data.date)}</td>
//                                                    <td key={'l7' + data._id}>{getFormatDate(data.date)}</td>
//                                                </tr>
//                                            )
//                                        }
//                                    )
//                                }
//                                </tbody>
//                            )
//                        }
//                    </table>
//                </div>
//            </div>
//         )
//     }
//
//     UsersList2() {
//
//         return (
//            <div
//                className='all-logs-users-panel'
//            >
//                <div
//                    className={'all-logs-users-list ' + (this.state.selected_run === null ? 'disabledElem' : '')}
//                >
//                    <div className='all-logs-users-list-input'>
//                        <input
//                            onChange={e => this.setState({
//                                users_filter: e.target.value})
//                            }
//                            value={this.state.users_filter}
//                        />
//                    </div>
//
//                    <div
//                        className='all-logs-users-list-li'
//                    >
//                        {this.state.users_list.length > 0 && (
//                            <label
//                                className={this.state.selected_user === 'AllUsers' ? 'selected-user' : ''}
//                                value='AllUsers'
//                                onClick={e => this.selectUser('AllUsers')}
//                            >
//                                AllUsers
//                            </label>
//                        )
//                        }
//                        {
//                            this.state.users_list.filter(
//                                usr => usr.includes(this.state.users_filter)
//                            ).map(
//                                user => {
//                                    return (
//                                        <label
//                                            className={this.state.selected_user === user ? 'selected-user' : ''}
//                                            value={user}
//                                            key={user}
//                                            onClick={e => this.selectUser(user)}
//                                        >
//                                            {user}
//                                        </label>
//                                    )
//                                })
//                        }
//                    </div>
//
//                </div>
//
//                <div
//                    className='all-logs-users-data'
//                >
//                    {/*permission*/}
//                    <div
//                        className='all-logs-users-data-head'
//                    >
//                        <label>user_id</label>
//                        <label>exp</label>
//                        <label>running_name</label>
//                        <label>action</label>
//                        <label>more_params</label>
//                        <label>time</label>
//                        <label>date</label>
//                    </div>
//
//                    <div
//                        className='all-logs-users-data-content'
//                    >
//                        {
//                            this.state.user_data.map(
//                                data => {
//                                    return (
//                                        <div
//                                            key={'div' + data._id}
//                                        >
//                                            <label key={'l1' + data._id}>{data.user_id}</label>
//                                            <label key={'l2' + data._id}>{data.exp}</label>
//                                            <label key={'l3' + data._id}>{data.running_name}</label>
//                                            <label key={'l4' + data._id}>{data.action}</label>
//                                            <label key={'l5' + data._id}>more_params</label>
//                                            <label key={'l6' + data._id}>{getFormatTime(data.date)}</label>
//                                            <label key={'l7' + data._id}>{getFormatDate(data.date)}</label>
//                                        </div>
//                                    )
//                                }
//                            )
//                        }
//                    </div>
//                </div>
//            </div>
//         )
//     }
//
//
//     render () {
//         if (this.state.loading)
//             return <></>;
//
//         if (!this.state.isAuthenticated || this.state.user.permission !== 'Admin')
//             return <Redirect to='/login' />;
//
//         return (
//             <div
//                 className='all-logs-panel'
//             >
//                 <label className='all-logs-panel-head'>Logs</label>
//                 {this.Options()}
//                 {this.UsersList()}
//             </div>
//         );
//     }
//
// }
//
// AllLogs.propTypes = {
//     isAuthenticated: PropTypes.bool,
//     auth: PropTypes.object.isRequired,
// };
//
// const mapStateToProps = state => ({
//     isAuthenticated: state.auth.isAuthenticated,
//     auth: state.auth
// });
//
// export default connect(mapStateToProps)(AllLogs);
