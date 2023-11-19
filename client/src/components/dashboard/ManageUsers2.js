import React, { Fragment, } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './manage_users.css';
import $ from 'jquery';
import {loadUser, checkExistUser, addNewAdminUser, getAdminsPermissions, updateAdminUser} from "../../actions/auth";

let MESSAGE_MODE = false;

class EditUser extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.setMessage = this.props.setMessage;
        this.setUpdating = this.props.setUpdating;
        this.getAdmins = this.props.getAdmins;

        this.state = {
            users_list: this.props.usersList,
            selected_user: null,
            changes: {},
            confirm_message: false,
            allExperiments: this.props.allExperiments
        };

        this.usersListPanel = this.usersListPanel.bind(this);
        this.userDetailsPanel = this.userDetailsPanel.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snap) {
        if(prevProps.usersList !== this.props.usersList){

            this.setState({
                users_list: this.props.usersList
            });
        }
    }

    userDetailsPanel(){

        const updateUser = (user, action) => {
            let _this = this;
            this.setUpdating(true);

            let user_up = Object.assign({}, this.state.users_list[user], {email: user});
            this.setState({
                users_list: null,
                selected_user: null,
                confirm_message: false
            }, () => {
                updateAdminUser({
                    action,
                    user: user_up
                }).then(
                    res => {
                        _this.getAdmins();
                        _this.setMessage(true, res.data.msg);
                        _this.setUpdating(false);
                    }
                )
            });
        };

        const confirm = (confirm) => {
            this.setState({
                confirm_message: confirm
            });
        };

        const changeValue = (attr, value, checked) => {
            let sc = this.state;

            if(attr === 'permission'){
                sc.users_list[sc.selected_user].permission = value;
            }
            else if (attr === 'experiments'){
                if(checked){
                    sc.users_list[sc.selected_user].experiments.push(value);
                }
                else {
                    sc.users_list[sc.selected_user].experiments = sc.users_list[sc.selected_user].experiments.filter(
                        exp => exp !== value
                    )
                }
            }
            this.setState(sc);
        };

        return (
            <div
                className='klab-manage-users-edit-user-det'
            >
                {
                    !this.state.confirm_message && this.state.users_list && this.state.selected_user && (
                        <Fragment>

                            <div>
                                <label><b><u>User permission:</u></b></label>
                                <select
                                    value={this.state.users_list[this.state.selected_user].permission}
                                    onChange={e => changeValue('permission', e.target.value, null)}
                                >
                                    <option>Admin</option>
                                    <option>SuperAdmin</option>
                                </select>
                            </div>

                            <div>
                                <label><b><u>User experiments:</u></b></label>

                                <div
                                    className='klab-manage-all-exp-list'
                                >
                                    {
                                        this.state.allExperiments && this.state.allExperiments.map(
                                            (val, index) => {
                                                return (
                                                    <div
                                                        className='klab-manage-all-exp-item'
                                                        key={'AllExp-experiments' + val + index}
                                                    >
                                                        <label key={'AllExp_experiments_label' + val + index}>
                                                            <input
                                                                key={'AllExp-experiment' + val + index}
                                                                type='checkbox'
                                                                checked={this.state.users_list[this.state.selected_user].experiments.indexOf(val) > -1}
                                                                onChange={e => changeValue('experiments', val, e.target.checked)}
                                                            />
                                                            {val}
                                                        </label>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </div>

                            </div>

                            <div
                                className='klab-manage-edit-btns'
                            >
                                <button className='klab-manage-btn-update' onClick={() => updateUser(this.state.selected_user, 'update')}>Update user</button>
                                {/*<button className='klab-manage-btn-remove' onClick={() => updateUser(this.state.selected_user, 'remove')}>Remove user</button>*/}
                                <button className='klab-manage-btn-remove' onClick={() => confirm(true)}>Remove user</button>
                            </div>
                        </Fragment>
                    )
                }

                {
                    this.state.confirm_message && (
                        <Fragment>
                            <div
                                className='klab-manage-users-edit-confirm-d1'
                            >
                                <label>You are going to remove <span className='klab-mu-err-id'>{this.state.selected_user}</span> for permanently.</label>
                                <label>Are you sure?</label>
                            </div>
                            <div
                                className='klab-manage-users-edit-confirm-d2'
                            >
                                <button onClick={() => updateUser(this.state.selected_user, 'remove')}>OK</button>
                                <button onClick={() => confirm(false)}>Cancel</button>
                            </div>
                            <div></div>
                        </Fragment>
                    )
                }
            </div>

        )
    }

    usersListPanel(){
        const selectUser = (user) => {
            this.setState({
                selected_user: user,
                confirm_message: false
        });
        };

        return (
            <div
                // className={'klab-manage-users-edit-user-list klab-manage-users-edit-user-list-loading'}
                className={'klab-manage-users-edit-user-list ' + (!this.state.users_list ? 'klab-manage-users-edit-user-list-loading' : '')}
            >
                {
                    this.state.users_list ?
                        Object.keys(this.state.users_list).map(
                        (user, index) => {
                            return (
                                <div
                                    className={'klab-manage-users-edit-user-list-item ' + (this.state.selected_user === user ? 'klab-manage-users-selected' : '')}
                                    onClick={() => selectUser(user)}
                                    key={'user_email_list'+user}
                                >
                                    <label
                                        key={'label-' + user + '-' + index}
                                    >
                                        {user}
                                    </label>
                                </div>
                            )
                        }
                    )
                        :
                        <label>Loading...</label>
                }
            </div>
        )
    }

    render () {

        return (
            <div
                className='klab-manage-users-edit-user'
            >
                <label><u><b>Edit admin user</b></u></label>
                <div className='klab-manage-users-edit-user-panel'>
                    {this.usersListPanel()}
                    {this.userDetailsPanel()}
                </div>
            </div>
        );
    }

}


class AddNewUsers extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.setMessage = this.props.setMessage;
        this.setUpdating = this.props.setUpdating;
        this.getAdmins = this.props.getAdmins;

        this.state = {
            users_list: {},
            user_selected: null,
            allExperiments: this.props.allExperiments
        };

        this.addNewUser = this.addNewUser.bind(this);
        this.createAccounts = this.createAccounts.bind(this);
        this.insertPanel = this.insertPanel.bind(this);
        this.usersList = this.usersList.bind(this);
        this.userDetails = this.userDetails.bind(this);
    }

    componentDidMount(){
        $('.klab-manage-users-add-user-input').focus();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allExperiments !== this.props.allExperiments){
            this.setState({
                allExperiments: this.props.allExperiments
            });
        }
    }

    addNewUser(){

        let _this = this;
        let user_email = $('.klab-manage-users-add-user-input').val();

        let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if(!user_email.match(mailformat)) {
            _this.setMessage(true, 'Insert a valid email');
        }
        else {
            if (_this.state.users_list[user_email] !== undefined){
                _this.setMessage(true, 'Already inserted');
            }
            else {
               _this.setUpdating(true);
                checkExistUser({email: user_email}).then(
                    res => {
                        _this.setUpdating(false);

                        if(res && res.data && res.data.msg === 'User exist'){
                            _this.setMessage(true, res.data.msg);
                        }
                        else {
                            _this.clearInput();
                            let sc = _this.state;

                            sc.users_list[user_email] = {
                                permission: 'Admin',
                                experiments: []
                            };
                            sc.user_selected = user_email;
                            _this.setState(sc);
                        }

                    }
                )
            }

        }

    }

    clearInput(){
        $('.klab-manage-users-add-user-input').val('');
    }

    createAccounts(){
        let errors = [];
        let str = '';
        if (Object.keys(this.state.users_list).length < 1){
            errors.push('Empty list');
            str = 'Add account';

        }
        else {
            Object.keys(this.state.users_list).forEach(
                user_email => {
                    if(this.state.users_list[user_email].experiments.length < 1){
                        errors.push(user_email);
                    }
                }
            );
            // str = 'User' + (errors.length>1 ? 's ': ' ') + (errors.length > 1 ? + '<b>' + errors.join(', ') : errors[0]) + '</b>' + ' - please select at least one experiment';
            // str = `User ${errors.length>1 ? 's': ''} <span>${errors.join(', ')}</span> - please select at least one experiment`;
            str = <Fragment>User{errors.length>1 ? 's ': ' '} <span className='klab-mu-err-id'>{errors.join(', ')}</span> - please select at least one experiment</Fragment>;

        }

        if (errors.length > 0){
            this.setMessage(true, str);
        }
        else {
            let _this = this;
            _this.setUpdating(true);
            addNewAdminUser(this.state.users_list).then(
                res => {
                    _this.getAdmins();
                    _this.setUpdating(false);

                    if(res.data.not_added && res.data.not_added.length > 0){
                        // let msg = 'The following account failed to added: ' + res.data.not_added.join(', ');
                        let msg = <Fragment>The following account failed to added: <span className='klab-mu-err-id'>{res.data.not_added.join(', ')}</span></Fragment>;

                        _this.setMessage(true, msg);
                    }
                    else {
                        _this.setMessage(true, res.data.msg);
                    }
                    _this.clearInput();

                    _this.setState({
                        users_list: {},
                        user_selected: null,
                    })
                }
            )
        }

    }

    insertPanel(){

        return (
            <div
                className='klab-manage-users-add-user-insert'
            >
                <label>Insert user email:</label>
                <input
                    className='klab-manage-users-add-user-input'
                    defaultValue={this.state.user_selected || ''}
                    onKeyDown={e => {
                        if(e.keyCode === 32) e.preventDefault();
                    }}
                    onKeyUp={e => {
                        if (e.keyCode === 13 && MESSAGE_MODE === false && e.target.value !== '') {
                            this.addNewUser()
                        };
                    }}
                    onChange={e => {
                        e.target.value.trim();
                        let val = e.target.value;
                        if(val === ''){
                            if(!$('.klab-manage-btn-add').hasClass('disabledElem'))
                                $('.klab-manage-btn-add').addClass('disabledElem');
                        }
                        else {
                            if($('.klab-manage-btn-add').hasClass('disabledElem'))
                                $('.klab-manage-btn-add').removeClass('disabledElem');
                        }
                    }}
                />
                <button className={'klab-manage-btn-add disabledElem'} onClick={() => this.addNewUser()}>Add user</button>
                <button className={'klab-manage-btn-create ' + (Object.keys(this.state.users_list).length < 1 ? 'disabledElem' : '')} onClick={() => this.createAccounts()}>Create accounts</button>
            </div>
        )
    }

    usersList(){

        const deleteUser = (user) => {
            let sc = this.state;
            delete sc.users_list[user];
            sc.user_selected = null;
            this.setState(sc);
        };

        return (
            <div
                className='klab-manage-users-add-user-list'
            >
                {
                    Object.keys(this.state.users_list).map(
                        user_email => {
                            return (
                                <div
                                    className={'klab-manage-users-add-user-list-item ' + (this.state.user_selected === user_email ? 'klab-manage-users-selected' : '')}
                                    onClick={() => this.setState({user_selected: user_email})}
                                    key={'user_email_list'+user_email}
                                >
                                    <label>{user_email}</label>
                                    <label onClick={() => deleteUser(user_email)}>X</label>
                                </div>
                            )
                        }
                    )
                }
            </div>
        )
    }

    userDetails(){

        const changeValue = (attr, value, checked) => {
            let sc = this.state;

            if(attr === 'permission'){
                sc.users_list[sc.user_selected].permission = value;
            }
            else if (attr === 'experiments'){
                if(checked){
                    sc.users_list[sc.user_selected].experiments.push(value);
                }
                else {
                    sc.users_list[sc.user_selected].experiments = sc.users_list[sc.user_selected].experiments.filter(
                        exp => exp !== value
                    )
                }

            }
            this.setState(sc);
        };

        return (
            <div
                className='klab-manage-users-add-user-det'
            >
                {
                    this.state.users_list && this.state.user_selected && this.state.users_list[this.state.user_selected] && (
                        <Fragment>

                            <div>
                                <label><b><u>User permission:</u></b></label>
                                <select
                                    value={this.state.users_list[this.state.user_selected].permission}
                                    onChange={e => changeValue('permission', e.target.value, null)}
                                >
                                    <option>Admin</option>
                                    <option>SuperAdmin</option>
                                </select>
                            </div>

                            <div>
                                <label><b><u>User experiments:</u></b></label>
                                <div
                                    className='klab-manage-all-exp-list'
                                >
                                    {
                                        this.state.allExperiments && this.state.allExperiments.map(
                                            (val, index) => {
                                                return (
                                                    <div
                                                        className='klab-manage-all-exp-item'
                                                        key={'experiments' + val + index}
                                                    >
                                                        <label key={'experiments_label' + val + index}>
                                                            <input
                                                                key={'experiment' + val + index}
                                                                type='checkbox'
                                                                checked={this.state.users_list[this.state.user_selected].experiments.indexOf(val) > -1}
                                                                onChange={e => changeValue('experiments', val, e.target.checked)}
                                                            />
                                                            {val}
                                                        </label>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </div>
                            </div>
                        </Fragment>
                    )
                }
            </div>
        )
    }

    render () {
        return (
            <div
                className='klab-manage-users-add-user'
            >
                <label><u><b>Add new admin user</b></u></label>
                <div className='klab-manage-users-add-user-panel'>
                    {this.insertPanel()}

                    {this.usersList()}

                    {this.userDetails()}
                </div>
            </div>
        );
    }
}

class ManageUsers extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            loading: true,
            message: null,
            message_text: null,
            updating: false,
            users_list: null,
            Experiments: [],
        };

        this.updatedProps = this.updatedProps.bind(this);
        this.setMessage = this.setMessage.bind(this);
        this.setUpdating = this.setUpdating.bind(this);
        this.getAdmins = this.getAdmins.bind(this);
    }

    getAdmins(){
        let _this = this;
        this.setState({
            users_list: null
        }, () => {
            getAdminsPermissions().then(
                res => {
                    _this.setState({
                        users_list: res.data.users,
                    });
                }
            )
        });
    }

    updatedProps(){
        this.setState({
            user: this.props.auth.user,
            isAuthenticated: this.props.isAuthenticated,
            loading: false
        }, () => {
            this.getAdmins();
        });
    }

    componentDidMount(){
        if(!this.props || !this.props.auth || !this.props.auth.user)
            return;

        this.updatedProps();
    }

    componentDidUpdate(prevProps, prevState, snap){
        if(this.props !== prevProps){
            if(this.props.auth && this.props.auth.user)
                this.updatedProps();
        }

        if(prevState.message !== this.state.message && this.state.message !== null){
            $('.klab-manage-users-msg-btn').focus();
        }

        if(prevState.message !== this.state.message && this.state.message === null){
            $('.klab-manage-users-add-user-input').focus();
        }

        if (prevProps.allExperiments !== this.props.allExperiments){
            this.setState({
                allExperiments: this.props.allExperiments
            });
        }
    }

    setMessage(msg, msg_text){
        if (msg)
            MESSAGE_MODE = true;
        else
            MESSAGE_MODE = false;

        this.setState({
            message: msg,
            message_text: msg_text,
        });
    }

    setUpdating(update){
        this.setState({
            updating: update
        })
    }

    render () {
        if (this.state.loading)
            return <></>;

        if (!this.state.isAuthenticated || this.state.user.permission !== 'Admin')
            return <Redirect to='/login' />;

        return (
            <Fragment>
                <div
                    className={'klab-manage-users ' + (this.state.message || this.state.updating ? 'disabledElem' : '')}
                >
                    <AddNewUsers
                        setMessage={this.setMessage}
                        setUpdating={this.setUpdating}
                        getAdmins={this.getAdmins}
                        allExperiments={this.state.allExperiments}
                    />

                    <EditUser
                        setMessage={this.setMessage}
                        setUpdating={this.setUpdating}
                        usersList={this.state.users_list}
                        getAdmins={this.getAdmins}
                        allExperiments={this.state.allExperiments}
                    />
                </div>

                {
                    this.state.message && (
                        <div
                            className='klab-manage-users-msg'
                        >
                            <label>{this.state.message_text}</label>
                            <button
                                className='klab-manage-users-msg-btn'
                                onClick={() => this.setMessage(null, null)}
                                onKeyDown={e => {
                                    e.preventDefault();
                                }}
                            >OK</button>
                        </div>
                    )
                }

                {
                    this.state.updating && (
                        <div
                            className='export-is-loading'
                        >
                            <div
                                className='export-is-loading-back'
                            ></div>

                            <div
                                className='export-is-loading-msg'
                            >
                                <label>Please wait a moment..</label>
                                <div className="sk-chase">
                                    <div className="sk-chase-dot"></div>
                                    <div className="sk-chase-dot"></div>
                                    <div className="sk-chase-dot"></div>
                                    <div className="sk-chase-dot"></div>
                                    <div className="sk-chase-dot"></div>
                                    <div className="sk-chase-dot"></div>
                                </div>
                            </div>
                        </div>

                        // <div
                        //     className='klab-manage-users-updating'
                        // >
                        //     <label>Please wait...</label>
                        // </div>
                    )
                }
            </Fragment>
        );
    }

}

ManageUsers.propTypes = {
    isAuthenticated: PropTypes.bool,
    auth: PropTypes.object.isRequired,
    loadUser: PropTypes.func.isRequired,

};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    auth: state.auth,
});

export default connect(mapStateToProps, {loadUser})(ManageUsers);
