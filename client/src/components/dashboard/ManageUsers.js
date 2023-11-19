import React, {Fragment, useEffect, useState,} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './manage_users.css';
import {AddNewExp, getUsersAndExpsList} from "../../actions/exp_actions";
import {setGameMode, setWaitForAction} from "../../actions/app_actions";
import {setAlert} from "../../actions/alert";
import {addNewUsers, ModifyUser, ResetPassword, RemoveUser} from "../../actions/auth";
import PromptMessage from "../screens/promptMessage/PromptMessage";
import {Header} from "../layout/header/header";
import {preventPageGoBack, setCurrentExp} from "../../utils/helpers";

const MailFormat = /^[.a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const beforeAddUsers = () => {

    return (
        <label
            style={{
                textAlign: 'center',
                fontSize: 'x-large'
            }}
        >
            Are you sure you want to add users?
        </label>
    );
};

const afterAddMsg = ({addNumber, notAddNumber, users_errors, users_added}) => {

    const AddedUsers = (
        <label
            style={{
                textAlign: 'center',
                fontSize: 'x-large'
            }}
        >
            {addNumber === 1 && <span style={{color: 'blue', marginLeft: 5, marginRight: 5}}>One</span>}
            {addNumber > 1 && notAddNumber === 0 && <span style={{color: 'blue', marginLeft: 5, marginRight: 5}}>All</span>}
            {addNumber > 1 && notAddNumber !== 0 && <span style={{color: 'blue', marginLeft: 5, marginRight: 5}}>{addNumber}</span>}
            user{addNumber > 1 ? 's' : ''} added and the password was set to
            <span style={{color: 'blue', marginLeft: 5, marginRight: 5}}>12345</span>
            <br/>
            Needs to change the password please its to easy
        </label>
    );

    const NotAddedUsers = (
        <label
            style={{
                textAlign: 'center',
                fontSize: 'x-large'
            }}
        >
            <span style={{color: 'red', marginLeft: 5, marginRight: 5}}>{notAddNumber+' users not added'}</span>
        </label>
    );

    const userList = ({users, color, msg}) => {
        return (
            <div
                style={{
                    display: 'grid',
                    border: '1px solid black',
                    padding: '0.3rem',
                    color,
                    height: 'max-content',
                    maxHeight: '10rem',
                    width: 'max-content',
                    maxWidth: '12rem',
                    overflow: 'auto',
                    gridRowGap: '0.5rem',
                    margin: 'auto'
                }}
            >
                <label>{msg}:</label>
                {
                    users.map(
                        usr => <label>{usr}</label>
                    )
                }
            </div>
        )
    }

    return (
        <>
            {addNumber>0 && AddedUsers}
            {notAddNumber>0 && NotAddedUsers}

            {
                users_errors.length>0 && (
                    <div
                        style={{
                            display: 'grid',
                            gridColumnGap: '2rem',
                            gridAutoFlow: 'column'
                        }}
                    >
                        {userList({
                            users: users_errors,
                            color: 'red',
                            msg: 'User not added'
                        })}
                        {userList({
                            users: users_added,
                            color: 'green',
                            msg: 'User added'
                        })}
                    </div>
                )
            }

        </>
    )
};

const AddNewUsers = ({users_list, setWaitForAction, updateLists}) => {
    const [usersList, setUsersList] = useState([]);
    const [newUsersList, setNewUsersList] = useState([]);
    const [newUser, setNewUser] = useState('');

    const [promptProp, setPromptProp] = useState(null);
    const [promptMsg, setPromptMsg] = useState(null);

    const AddNewUsers = (usr_lst) => {
        setWaitForAction(true);

        addNewUsers(usr_lst)
            .then(
                res => {
                    try {
                        let prop = {
                            show: true,
                            buttons: [
                                {
                                    text: 'OK',
                                    result: 'OK',
                                    className: '',
                                    callbackFunc: () => {
                                        setPromptProp(null);
                                        setPromptMsg(null);
                                    }
                                }
                            ]
                        }

                        if (res.data.error){
                            setPromptProp(null);
                            setPromptMsg(null);
                            setWaitForAction(false);
                            setAlert(res.data.error, 'danger');
                        }
                        else {
                            if (res.data.users_added.length > 0){
                                prop.messageType = 'success';
                            }
                            else {
                                prop.messageType = 'danger';
                            }
                            setPromptProp(prop);

                            const users_added = res.data.users_added;
                            const users_errors = res.data.users_errors;

                            setPromptMsg(afterAddMsg({
                                addNumber: users_added.length,
                                notAddNumber: users_errors.length,
                                users_errors: users_errors,
                                users_added: users_added
                            }));

                            setNewUsersList(users_errors);

                            updateLists({
                                AllUsers: res.data.users_list,
                                AllExperiments: res.data.exps_list
                            });
                            setWaitForAction(false);
                        }
                    }
                    catch (e) {
                        setPromptProp(null);
                        setPromptMsg(null);
                        setWaitForAction(false);
                        setAlert('Some errors happened', 'danger');
                    }
                }
            )
            .catch(err => {
                setPromptProp(null);
                setPromptMsg(null);
                setWaitForAction(false);
                setAlert('Some errors happened', 'danger');
            })

    }

    const BeforeAddNewUsers = () => {
        const prop = {
            show: true,
            messageType: 'danger',
            action_on: 'new users',
            buttons: [
                {
                    text: 'Yes',
                    result: 'YES',
                    className: '',
                    callbackFunc: () => AddNewUsers(newUsersList)
                },
                {
                    text: 'No',
                    result: 'NO',
                    className: '',
                    callbackFunc: () => {
                        setPromptProp(null);
                        setPromptMsg(null);
                    }
                }
            ]
        }
        setPromptProp(prop);
        setPromptMsg(beforeAddUsers());
    }

    useEffect(() => {
        setUsersList(users_list);
    }, [users_list]);

    const deleteUser = (new_user) => {
        let new_users_list = newUsersList.filter(
            ul => ul !== new_user
        );
        setNewUsersList(new_users_list);
    };

    const addUsers = () => {
        if (!newUser || newUsersList.indexOf(newUser) > -1 || usersList.indexOf(newUser) > -1) return;
        setNewUsersList([
            ...newUsersList,
            newUser
        ]);
        setNewUser('');
    }


    return (
        <>
            <PromptMessage
                {...promptProp}
            >
                {promptMsg}
            </PromptMessage>

            <div
                className='admin-manage-users_add'
            >
                <label>Add new users</label>
                <div
                    className='admin-manage-users_add_input'
                >
                    <input
                        value={newUser}
                        style={{
                            color: (newUsersList.indexOf(newUser) > -1 || usersList.indexOf(newUser) > -1) ? 'red' : 'black'
                        }}
                        onChange={e => {
                            setNewUser(e.target.value);
                        }}
                    />
                    <button
                        className={(!newUser || !newUser.match(MailFormat) || newUsersList.indexOf(newUser) > -1 || usersList.indexOf(newUser) > -1) ? 'disabledElem' : ''}
                        onClick={addUsers}
                    >
                        Add user to List
                    </button>
                    <button
                        className={(newUsersList.length === 0 ? 'disabledElem' : '')}
                        onClick={BeforeAddNewUsers}
                    >
                        Add users
                    </button>
                </div>

                <div
                    className='admin-manage-users_add_list'
                >
                    {
                        newUsersList.map(new_user => (
                            <Fragment key={'new_user'+new_user+'new_user'}>
                                <label key={new_user}>{new_user}</label>
                                <label key={new_user+'new_user'} onClick={() => deleteUser(new_user)}>X</label>
                            </Fragment>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

// const EditUser = ({user}) => {
//     return (
//         <>
//             <label>{new_user}</label>
//             <label onClick={() => deleteUser(new_user)}>X</label>
//         </>
//     )
// }




const EditUsers = ({users_list, AllExperiments, setWaitForAction, setAlert, updateLists}) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedExps, setSelectedExps] = useState([]);

    const ModifyUserExp = () => {
        setWaitForAction(true);

        ModifyUser({
            id: selectedUser._id,
            Experiments: selectedExps
        })
            .then(
                res => {
                    try {
                        let type, msg;

                        if (res.data.error){
                            type = 'danger';
                            msg = res.data.error;
                        }
                        else {
                            msg = 'User experiments update success';
                            type = 'success';
                            updateLists({
                                AllUsers: res.data.users_list,
                                AllExperiments: res.data.exps_list
                            });
                        }
                        setAlert(msg, type);
                        setWaitForAction(false);
                    }
                    catch (e) {
                        setWaitForAction(false);
                        setAlert('Some errors happened', 'danger');
                    }
                }
            )
            .catch(err => {
                setWaitForAction(false);
                setAlert('Some errors happened', 'danger');
            })
    }

    return (
        <div
            className='admin-manage-users_edit'
        >
            <label>Modify users permissions</label>

            <div>
                <div
                    className='admin-manage-users_edit_usr_list'
                >
                    {
                        users_list && users_list.map(
                            usr => (
                                <label
                                    className={selectedUser && selectedUser._id === usr._id ? 'admin-mu_edit_usr_select' : ''}
                                    key={usr._id}
                                    onClick={() => {
                                        setSelectedUser(usr);
                                        setSelectedExps(usr.Experiments);
                                    }}
                                >
                                    {usr.email}
                                </label>
                            )
                        )
                    }
                </div>

                <div
                    className='admin-manage-users_edit_exp_list'
                >
                    {
                        selectedUser && AllExperiments.map(
                            exp => (
                                <label
                                    key={exp}
                                >
                                    <input
                                        key={'checkbox'+exp}
                                        type='checkbox'
                                        checked={selectedExps.includes(exp)}
                                        onChange={e => {
                                            if (!e.target.checked)
                                                setSelectedExps(selectedExps.filter(exp_ => exp_ !== exp));
                                            else
                                                setSelectedExps([
                                                    ...selectedExps,
                                                    exp
                                                ])
                                        }}
                                    />
                                    {exp}
                                </label>
                            )
                        )
                    }
                </div>

                <button
                    onClick={ModifyUserExp}
                >
                    Save user experiments
                </button>
            </div>

        </div>
    )
}



const beforeResetMsg = (user_email) => {

    return (
        <label
            style={{
                textAlign: 'center',
                fontSize: 'x-large'
            }}
        >
            Are you sure you want to
            <span style={{color: 'red', marginLeft: 5, marginRight: 5}}>reset password</span>to
            <span style={{fontWeight: 'bold', color: 'darkblue', marginLeft: 5, marginRight: 5}}>{user_email}</span>
            ?
        </label>
    );
};

const beforeAddExpMsg = (exp) => {

    return (
        <label
            style={{
                textAlign: 'center',
                fontSize: 'x-large'
            }}
        >
            Are you sure you want to
            <span style={{color: 'red', marginLeft: 5, marginRight: 5}}>add new exp</span>
            <span style={{fontWeight: 'bold', color: 'darkblue', marginLeft: 5, marginRight: 5}}>{exp}</span>
            ?
        </label>
    );
};

const afterResetMsg = (user_email, success, msg) => {

    const success_msg = (
        <label
            style={{
                textAlign: 'center',
                fontSize: 'x-large'
            }}
        >
            The
            <span style={{color: 'blue', marginLeft: 5, marginRight: 5}}>password</span>of
            <span style={{fontWeight: 'bold', color: 'darkblue', marginLeft: 5, marginRight: 5}}>{user_email}</span>
            was reset to
            <span style={{color: 'blue', marginLeft: 5, marginRight: 5}}>12345</span>
            <br/>
            Needs to change the password please its to easy
        </label>
    );

    const failed_msg = (
        <label
            style={{
                textAlign: 'center',
                fontSize: 'x-large'
            }}
        >
            The
            <span style={{color: 'red', marginLeft: 5, marginRight: 5}}>password</span>of
            <span style={{fontWeight: 'bold', color: 'darkblue', marginLeft: 5, marginRight: 5}}>{user_email}</span>
            was not reset because:
            <br/>
            <span style={{color: 'red', marginLeft: 5, marginRight: 5}}>{msg || 'Error'}</span>
        </label>
    )

    if (success) return success_msg;
    return failed_msg;
};

const ResetPass = ({users_list, setWaitForAction, setAlert}) => {

    const [promptProp, setPromptProp] = useState(null);
    const [promptMsg, setPromptMsg] = useState(null);

    const ResetUserPassword = (usr) => {
        setWaitForAction(true);
        ResetPassword({id: usr._id})
            .then(
                res => {
                    try {
                        let prop = {
                            show: true,
                            action_on: usr.email,
                            buttons: [
                                {
                                    text: 'OK',
                                    result: 'OK',
                                    className: '',
                                    callbackFunc: () => {
                                        setPromptProp(null);
                                        setPromptMsg(null);
                                    }
                                }
                            ]
                        }
                        let success, msg;

                        if (res.data.error){
                            prop.messageType = 'danger';
                            success = false;
                            msg = res.data.error;
                        }
                        else {
                            success = true;
                            prop.messageType = 'success';
                        }

                        setPromptProp(prop);
                        setPromptMsg(afterResetMsg(usr.email, success, msg));
                        setWaitForAction(false);
                    }
                    catch (e) {
                        setPromptProp(null);
                        setPromptMsg(null);
                        setWaitForAction(false);
                        setAlert('Some errors happened', 'danger');
                    }
                }
            )
            .catch(err => {
                setPromptProp(null);
                setPromptMsg(null);
                setWaitForAction(false);
                setAlert('Some errors happened', 'danger');
            })
    }

    const BeforeResetPassword = user => {
      const prop = {
          show: true,
          messageType: 'danger',
          action_on: user,
          buttons: [
              {
                  text: 'Yes',
                  result: 'YES',
                  className: '',
                  callbackFunc: result => ResetUserPassword(result.action_on)
              },
              {
                  text: 'No',
                  result: 'NO',
                  className: '',
                  callbackFunc: a => {
                      setPromptProp(null);
                      setPromptMsg(null);
                  }
              }
          ]
      }
      setPromptProp(prop);
      setPromptMsg(beforeResetMsg(user.email));
    }

    return (
        <>
            <PromptMessage
                {...promptProp}
            >
                {promptMsg}
            </PromptMessage>

            <div
                className='admin-manage-users_reset'
            >
                <label>Reset user password</label>

                <div
                    className='admin-manage-users_reset_usr_list'
                >
                    {
                        users_list && users_list.map(
                            usr => (
                                <Fragment key={usr._id + 'usr._id'+ usr._id}>
                                    <label key={'usr._id'+ usr._id}>{usr.email}</label>
                                    <button
                                        key={usr._id+'usr._id'}
                                        onClick={() => BeforeResetPassword(usr)}
                                    >Reset
                                    </button>
                                </Fragment>
                            )
                        )
                    }
                </div>
            </div>
        </>
    )
}



const beforeRemoveMsg = (user_email) => {

    return (
        <label
            style={{
                textAlign: 'center',
                fontSize: 'x-large'
            }}
        >
            Are you sure you want to
            <span style={{color: 'red', marginLeft: 5, marginRight: 5}}>Remove</span>
            <span style={{fontWeight: 'bold', color: 'darkblue', marginLeft: 5, marginRight: 5}}>{user_email}</span>
            ?
        </label>
    );
};

const RemoveUserPanel = ({users_list, setWaitForAction, setAlert, updateLists}) => {

    const [promptProp, setPromptProp] = useState(null);
    const [promptMsg, setPromptMsg] = useState(null);

    const removeUser = (usr) => {
        setWaitForAction(true);
        setPromptProp(null);
        setPromptMsg(null);
        RemoveUser({id: usr._id})
            .then(
                res => {
                    try {
                        let type, msg;

                        if (res.data.error){
                            type = 'danger';
                            msg = res.data.error;
                        }
                        else {
                            type = 'success';
                            msg = 'User was removed successfully';
                            updateLists({
                                AllUsers: res.data.users_list,
                                AllExperiments: res.data.exps_list
                            });
                        }

                        setAlert(msg, type);
                        setWaitForAction(false);
                    }
                    catch (e) {
                        setWaitForAction(false);
                        setAlert('Some errors happened', 'danger');
                    }
                }
            )
            .catch(err => {
                setWaitForAction(false);
                setAlert('Some errors happened', 'danger');
            })
    }

    const BeforeRemove = user => {
      const prop = {
          show: true,
          messageType: 'danger',
          action_on: user,
          buttons: [
              {
                  text: 'Yes',
                  result: 'YES',
                  className: '',
                  callbackFunc: result => removeUser(result.action_on)
              },
              {
                  text: 'No',
                  result: 'NO',
                  className: '',
                  callbackFunc: () => {
                      setPromptProp(null);
                      setPromptMsg(null);
                  }
              }
          ]
      }
      setPromptProp(prop);
      setPromptMsg(beforeRemoveMsg(user.email));
    }

    return (
        <>
            <PromptMessage
                {...promptProp}
            >
                {promptMsg}
            </PromptMessage>

            <div
                className='admin-manage-users_remove'
            >
                <label>Remove user</label>

                <div
                    className='admin-manage-users_remove_usr_list'
                >
                    {
                        users_list && users_list.map(
                            usr => (
                                <Fragment key={usr._id + 'usr._id'+ usr._id}>
                                    <label key={'usr._id'+ usr._id}>{usr.email}</label>
                                    <button
                                        key={usr._id+'usr._id'}
                                        onClick={() => BeforeRemove(usr)}
                                    >Remove
                                    </button>
                                </Fragment>
                            )
                        )
                    }
                </div>
            </div>
        </>
    )
}

const NewExperiment = ({addNewExperiment, AllExp}) => {

    const [promptProp, setPromptProp] = useState(null);
    const [promptMsg, setPromptMsg] = useState(null);
    const [newExpText, setNewExpText] = useState('');

    const ConfirmAdd = (new_exp) => {
        setPromptProp(null);
        setPromptMsg(null);
        addNewExperiment(new_exp);
    }

    const BeforeAddExp = () => {
        const prop = {
            show: true,
            messageType: 'danger',
            action_on: newExpText,
            buttons: [
                {
                    text: 'Yes',
                    result: 'YES',
                    className: '',
                    callbackFunc: result => ConfirmAdd(result.action_on)
                },
                {
                    text: 'No',
                    result: 'NO',
                    className: '',
                    callbackFunc: a => {
                        setPromptProp(null);
                        setPromptMsg(null);
                    }
                }
            ]
        }
        setPromptProp(prop);
        setPromptMsg(beforeAddExpMsg(newExpText));
    }

    return (
        <>
            <PromptMessage
                {...promptProp}
            >
                {promptMsg}
            </PromptMessage>

            <div
                className='admin-manage-new_exp'
            >
                <label>Add new experiment</label>

                <div>
                    <input
                        className={AllExp.indexOf(newExpText) > -1 ? 'exist' : ''}
                        value={newExpText}
                        onChange={e => setNewExpText(e.target.value)}
                    />
                    <button
                        className={newExpText?'':'disabledElem'}
                        onClick={BeforeAddExp}
                    >
                        Add new exp
                    </button>
                </div>
            </div>
        </>
    )
}


class ManageUsers extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            isLoading: true,
            users_list: null,
            AllExperiments: [],
            AllUsers: [],
        };

        setCurrentExp(undefined);

        this.updateExpsList = this.updateExpsList.bind(this);
    }

    componentDidMount(){
        let _this = this;
        this.props.setGameMode(false);
        _this.props.setWaitForAction(true);
        preventPageGoBack();
        let sc = this.state;
        sc.isLoading = false;
        this.setState(sc, () => this.updateExpsList());
    }

    updateExpsList(){
        getUsersAndExpsList().then(
            res => {
                let sc = this.state;
                sc.AllExperiments = res.data.exps_list.sort();
                sc.AllUsers = res.data.users_list.sort();
                sc.isLoading = false;
                this.setState(sc, () => {
                    this.props.setWaitForAction(false);
                });
            }
        )
    }

    updateLists = ({AllExperiments, AllUsers}) => {
        let sc = this.state;
        sc.AllExperiments = AllExperiments.sort();
        sc.AllUsers = AllUsers.sort();
        this.setState(sc);
    }

    addNewExperiment = (NewExp) => {
        this.props.setWaitForAction(true);
        AddNewExp({NewExp}).then(
            res => {

                let sc = this.state;
                if (res.data.exps_list)
                    sc.AllExperiments = res.data.exps_list.sort();
                this.setState(sc, () => {
                    this.props.setWaitForAction(false);
                    let msg = res.data.error || res.data.msg;
                    this.props.setAlert(msg, res.data.error ? 'danger' : 'success');
                });
            }
        )

    }

    render () {
        return (
            <div
                className='admin-manage-users'
            >
                <Header
                    only_back_btn={true}
                />

                <NewExperiment
                    addNewExperiment={this.addNewExperiment}
                    AllExp={this.state.AllExperiments}
                />
                <AddNewUsers
                    users_list={this.state.AllUsers.map(usr => usr.email)}
                    setWaitForAction={this.props.setWaitForAction}
                    updateLists={this.updateLists}
                />

                <EditUsers
                    users_list={this.state.AllUsers}
                    AllExperiments={this.state.AllExperiments}
                    setWaitForAction={this.props.setWaitForAction}
                    setAlert={this.props.setAlert}
                    updateLists={this.updateLists}

                />

                <ResetPass
                    users_list={this.state.AllUsers}
                    setWaitForAction={this.props.setWaitForAction}
                    setAlert={this.props.setAlert}
                />

                <RemoveUserPanel
                    users_list={this.state.AllUsers}
                    setWaitForAction={this.props.setWaitForAction}
                    setAlert={this.props.setAlert}
                    updateLists={this.updateLists}
                />
            </div>
        );
    }

}

ManageUsers.propTypes = {
    setGameMode: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
};

export default connect(null, {setGameMode, setWaitForAction, setAlert})(ManageUsers);
