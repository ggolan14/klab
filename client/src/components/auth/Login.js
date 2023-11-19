//test11
import React, {Fragment, useReducer} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login, resetPassword} from '../../actions/auth';
import './Auth.css';
const initialState = {
    email: '',
    password: '',
    forgetPage: false,
    forgetWait: false,
    forgetMsg: '',
    forgetMail: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'ChangeForm':
            return {
                ...state,
                [action.payload.key]: action.payload.data
            };
        case 'ChangeForgetMail':
            return {
                ...state,
                forgetMail: action.payload
            };
        case 'Forget':
            return {
                ...state,
                forgetPage: action.payload,
                forgetMsg: '',
                forgetMail: '',
                forgetWait: false,
            };
        case 'ForgetMsg':
            return {
                ...state,
                forgetMsg: action.payload,
                forgetWait: false,
            };
        case 'ForgetWait':
            return {
                ...state,
                forgetWait: action.payload,
            };
        default:
            return {
                ...state
            }
    }
}

function init(initialState) {
    return {...initialState};
}

const MailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function isValidEmail(email) {
    return email.match(MailFormat);
}

const Login = ({login}) => {
    const [state, dispatch] = useReducer(reducer, initialState, init);

    const onChange = e => {
        dispatch({
            type: 'ChangeForm',
            payload: {
                key: e.target.name,
                data: e.target.value
            }
        });
    };

    const onForget = (cmd) => {

        if (cmd === 'close') {
            dispatch({
                type: 'Forget',
                payload: false
            });

        } else {
            if(!isValidEmail(state.forgetMail)) return;

            dispatch({
                type: 'ForgetWait',
                payload: true
            });

            resetPassword(state.forgetMail).then(
                res => {
                    try {
                        dispatch({
                            type: 'ForgetMsg',
                            payload: res.data.msg
                        });
                    }
                    catch (e) {
                        dispatch({
                            type: 'ForgetMsg',
                            payload: 'Some error was happened'
                        });
                    }
                });
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        login(state.email, state.password);
    };

    return (
        <Fragment>
            <div
                className={'login-panel-box ' + (state.forgetPage ? 'disabledElem' : '')}
            >
                <div
                    className='login-panel-box-h1'
                >
                    <h1 className='klab-admin-login'>KLAB</h1>
                </div>

                <div
                    className='login-panel-box-det'
                >
                    <form className='form login-form' onSubmit={e => onSubmit(e)}>
                        <div
                            className='text-left form-group'
                        >
                            <input
                                type='text'
                                placeholder='email'
                                name='email'
                                autoComplete="on"
                                value={state.email}
                                onChange={e => onChange(e)}
                                required
                            />
                        </div>
                        <div className='text-left form-group'>
                            <input
                                type='password'
                                placeholder='password'
                                name='password'
                                autoComplete="on"
                                value={state.password}
                                onChange={e => onChange(e)}
                                required
                            />
                        </div>
                        <div
                            className='login-panel-box-det-btn-grp'
                        >
                            <input type='submit' className='login-panel-box-det-btn' value='Login' onChange={()=>{}}/>
                            <input
                                onClick={() => {
                                    dispatch({
                                        type: 'Forget',
                                        payload: true
                                    })
                                }}
                                onChange={()=>{}}
                                className='login-panel-box-det-btn' value='Forget password'/>
                        </div>
                    </form>
                </div>
            </div>

            {
                state.forgetPage && (
                    <div
                        className='login-panel-box-forget'
                    >
                        <h1>Password resets</h1>

                        <div
                            className='login-panel-box-forget-d1'
                        >
                            {
                                state.forgetWait && !state.forgetMsg && (
                                    <div className="loader"/>
                                )
                            }
                            {state.forgetMsg ? <label>{state.forgetMsg}</label> : (
                                !state.forgetWait ? (
                                    <>
                                        <label>Insert yours email: </label>
                                        <input
                                            className='login-panel-box-forget-input'
                                            onChange={e => (
                                                dispatch({
                                                    type: 'ChangeForgetMail',
                                                    payload: e.target.value
                                                })
                                            )}
                                        />
                                    </>
                                ) : <></>
                            )}
                        </div>

                        <div
                            className='login-panel-box-forget-btn'
                        >
                            {state.forgetMsg ? <div/> : (
                                <button
                                    className={(state.forgetWait || !isValidEmail(state.forgetMail)) ? 'disabledElem' : ''}
                                    onClick={(state.forgetWait || !isValidEmail(state.forgetMail)) ? () => {} : () => onForget('reset')}
                                >Reset password</button>
                            )}

                            <button
                                className={state.forgetWait ? 'disabledElem' : ''}
                                onClick={e => onForget('close')}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )
            }
        </Fragment>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
});

export default connect(
    mapStateToProps,
    {login}
)(Login);
