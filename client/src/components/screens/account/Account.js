import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './account.css';
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import {changeUserAccount, changeUserPassword, updateUser,} from "../../../actions/auth";
import {setAlert} from "../../../actions/alert";
import PromptMessage from "../promptMessage/PromptMessage";
import {Header} from "../../layout/header/header";
import {preventPageGoBack, setCurrentExp} from "../../../utils/helpers";

class Account extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            isLoading: false,
            auth: this.props.auth,
            email: this.props.auth.user.email,
            name: this.props.auth.user.name,
            gender: this.props.auth.user.gender,
            age: this.props.auth.user.age,
            password: '',
            re_password: '',
            promptProp: null,
        };

        setCurrentExp(undefined);

        this.generalDetails = this.generalDetails.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.changeGeneralDetails = this.changeGeneralDetails.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.beforeChangePassword = this.beforeChangePassword.bind(this);
    }

    componentDidMount(){
        this.props.setGameMode(false);
        preventPageGoBack();
    }

    changeState(input, value){
        let sc = this.state;
        sc[input] = value;
        this.setState(sc);
    }

    // saveChanges(){
    //     let changes = {};
    //
    //     if(this.state.userDetails.name !== this.user_details_last.name){
    //         changes['name'] = this.state.userDetails.name;
    //     }
    //
    //     if(this.state.userDetails.gender !== this.user_details_last.gender){
    //         changes['gender'] = this.state.userDetails.gender;
    //     }
    //
    //     if(this.state.userDetails.email !== this.user_details_last.email && this.state.userDetails.email !== ''){
    //         let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    //
    //         if(!this.state.userDetails.email.match(mailformat)) {
    //             this.setState({
    //                 errors: true,
    //                 error_msg: 'Invalid email'
    //             });
    //
    //             return;
    //         }
    //         else {
    //             changes['email'] = this.state.userDetails.email;
    //         }
    //     }
    //
    //
    //     if(this.state.userDetails.age !== this.user_details_last.age){
    //         changes['age'] = this.state.userDetails.age;
    //     }
    //
    //     let pass1 = $('.klab-admin-account-user-det-pass1').val();
    //     let pass2 = $('.klab-admin-account-user-det-pass2').val();
    //     // if(this)
    //
    //     if(pass1 !== '' || pass2 !== ''){
    //         if (pass1 !== pass2){
    //             this.setState({
    //                 errors: true,
    //                 error_msg: 'Passwords not match'
    //             });
    //
    //             return;
    //         }
    //         else {
    //             changes['password'] = pass1;
    //         }
    //     }
    //
    //     let user = {
    //         [this.user_details_last.email]: changes
    //     };
    //
    //     let _this = this;
    //     this.setState({
    //         loading: true
    //     }, () => {
    //         changeUserAccount(user).then(
    //             res => {
    //                 _this.setState({
    //                     errors: true,
    //                     error_msg: res.data.msg,
    //                     loading: false
    //                 }, () => {
    //                     _this.props.loadUser();
    //                 });
    //
    //             }
    //         )
    //     });
    // }

    changeGeneralDetails(){
        this.props.setWaitForAction(true);
        changeUserAccount({
            name: this.state.name,
            gender: this.state.gender,
            age: this.state.age,
            id: this.state.auth.user._id,
        })
            .then(
                res => {
                    try {
                        if (res.data.error){
                            this.props.setWaitForAction(false);
                            this.props.setAlert(res.data.error, 'danger');
                        }
                        else {
                            this.props.updateUser({
                                name: res.data.user_changes.name,
                                age: res.data.user_changes.age,
                                gender: res.data.user_changes.gender,
                            });

                            this.props.setWaitForAction(false);
                            this.props.setAlert('Changes saved', 'success');
                        }
                    }
                    catch (e) {
                        this.props.setWaitForAction(false);
                        this.props.setAlert('Some errors happened', 'danger');
                    }
                }
            )
            .catch(err => {
                this.props.setWaitForAction(false);
                this.props.setAlert('Some errors happened', 'danger');
            })
    }

    beforeChangePassword(){
        let sc = this.state;
        sc.promptProp = {
            show: true,
            messageType: 'danger',
            action_on: 'password',
            buttons: [
                {
                    text: 'Yes',
                    result: 'YES',
                    className: '',
                    callbackFunc: result => this.changePassword()
                },
                {
                    text: 'No',
                    result: 'NO',
                    className: '',
                    callbackFunc: () => {
                        this.setState({
                            promptProp: null
                        });
                    }
                }
            ]
        };
        this.setState(sc);

    }

    changePassword(){
        this.props.setWaitForAction(true);
        let sc = this.state;
        sc.promptProp = null;
        this.setState(sc, () => {
            if (this.state.password !== this.state.re_password || this.state.password === '') return
            changeUserPassword({
                new_val: this.state.password,
                id: this.state.auth.user._id,
            })
                .then(
                    res => {
                        try {
                            if (res.data.error){
                                this.props.setWaitForAction(false);
                                this.props.setAlert(res.data.error, 'danger');
                            }
                            else {
                                this.props.setWaitForAction(false);
                                this.props.setAlert('Password changed', 'success');
                            }
                        }
                        catch (e) {
                            this.props.setWaitForAction(false);
                            this.props.setAlert('Some errors happened', 'danger');
                        }
                    }
                )
                .catch(err => {
                    this.props.setWaitForAction(false);
                    this.props.setAlert('Some errors happened', 'danger');
                })
        })
    }

    generalDetails(){

        return (
            <div className='admin-user_account_det'>
                <label><b><u>User details:</u></b></label>
                <div>
                    <label>Email:</label>
                    <label className='admin-user_account_det_name'>{this.state.email}</label>

                    <label>Name:</label>
                    <input
                        type='text'
                        onChange={e =>this.changeState('name', e.target.value)}
                        value={this.state.name}
                        placeholder='Insert your name'
                    />

                    <label>Gender:</label>
                    <select
                        onChange={e => this.changeState('gender', e.target.value)}
                        value={this.state.gender}
                    >
                        <option value={'select'} disabled>Select...</option>
                        <option value={'Male'}>Male</option>
                        <option value={'Female'}>Female</option>
                        <option value={'Other'}>Other</option>
                    </select>

                    <label>Age:</label>
                    <input
                        value={this.state.age}
                        type='number'
                        onKeyDown={e => {
                            if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8)
                                e.preventDefault();
                        }}
                        step={1}
                        min={1}
                        onChange={e =>this.changeState('age', e.target.value)}
                    />
                </div>
                <button
                    onClick={this.changeGeneralDetails}
                >Save changes</button>
            </div>
        )
    }

    passwordChange(){
        return (
            <div
                className='admin-user_account_pass'
            >
                <label><b><u>Change password:</u></b></label>
                <div>
                    <label>New password:</label>
                    <input
                        type='password'
                        placeholder='Insert your new password'
                        value={this.state.password}
                        onChange={e => this.changeState('password', e.target.value)}
                    />

                    <label>Retype new password:</label>
                    <input
                        type='password'
                        placeholder='Retype your new password'
                        value={this.state.re_password}
                        onChange={e => this.changeState('re_password', e.target.value)}
                    />
                </div>
                <button
                    className={this.state.password !== this.state.re_password || this.state.password === '' ? 'disabledElem' : ''}
                    onClick={this.beforeChangePassword}
                >Change password</button>
            </div>
        )
    }

    render () {
        return (
            <>
                <PromptMessage
                    {...this.state.promptProp}
                >
                    <label
                        style={{
                            textAlign: 'center',
                            fontSize: 'x-large'
                        }}
                    >
                        Are you sure you want to
                        <span style={{color: 'red', marginLeft: 5, marginRight: 5}}>change your password</span>
                        ?
                    </label>
                </PromptMessage>

                <div
                    className='admin-user_account'
                >
                    <Header
                        only_back_btn={true}
                    />

                    <div className='admin-user_account_opt'>
                        {this.generalDetails()}
                        {this.passwordChange()}
                    </div>
                </div>
            </>
        );
    }

}

Account.propTypes = {
    isAuthenticated: PropTypes.bool,
    auth: PropTypes.object.isRequired,
    setGameMode: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    auth: state.auth
});

// export default Start;
export default connect(mapStateToProps, {updateUser, setGameMode, setWaitForAction, setAlert})(Account);
