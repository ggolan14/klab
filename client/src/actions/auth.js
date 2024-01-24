import api from "../utils/api";
import { setAlert } from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGOUT,
    USER_UPDATE,
    CHATS_LOADED,
    TODO_LOADED, LOGIN_SUCCESS
} from './types';

import setAuthToken from '../utils/setAuthToken';

export const getUserInfo = async user_email => {
    try {
        console.log("---> in getUserInfo")
        const res = await api.get(`/users/info/${user_email}`);
        return res;
    } catch (err) {
    }
};


// Login User
export const login = (email, password) => async dispatch => {
    console.log("---> in authe.js login")
    const body = { email, password };
    try {
        const res = await api.post('/auth', body);

        if (res.data && res.data.token){
            localStorage.setItem('token', res.data.token);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
            console.log("---> before load user login")
            dispatch(loadUser());
            console.log("---> after load user login")
        }
    } catch (err) {
        console.log("---> Error occured during load user")
        const errors = err?.response?.data?.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: LOGIN_FAIL
        });
    }
};

// Load User
export const loadUser = () => async dispatch => {
console.log("---> in loadUser()")
    if (localStorage.token){
        console.log("---> localStorage.token=true "+localStorage.token)
        setAuthToken(localStorage.token);
    }
    else{
        console.log("---> localStorage.token=false "+localStorage.token)
        // return;
        return dispatch({type: AUTH_ERROR});
    }

    try {
        const res = await api.get('/auth');
console.log("---> 111 in load user")
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });

        dispatch({
            type: CHATS_LOADED,
            payload: res.data
        });

        dispatch({
            type: TODO_LOADED,
            payload: res.data
        });
        console.log("---> 222 in load user")
    } catch (err) {
        console.log("---> ERROR: "+err)

        dispatch({
            type: AUTH_ERROR
        });
    }
};

// Update User Details
export const updateUser = ({name, age, gender}) => async dispatch => {
    dispatch({
        type: USER_UPDATE,
        payload: {name, age, gender}
    });
};


// Add users
export const addNewUsers = async (users_list) => {
    try {

        const res = await api.post('/users/add_users', {users_list});
        return res;
    } catch (err) {

    }
};

// Add users
export const ModifyUser = async ({id, Experiments}) => {
    try {

        const res = await api.put('/users/modify_user', {id, Experiments});
        return res;
    } catch (err) {

    }
};

// Add users
export const ResetPassword = async ({id}) => {
    try {

        const res = await api.put('/users/upr', JSON.stringify({id}));
        return res;
    } catch (err) {

    }
};

// Add users
export const RemoveUser = async ({id}) => {
    try {

        const res = await api.put('/users/usr', JSON.stringify({id}));
        return res;
    } catch (err) {

    }
};

export const changeUserAccount = async (user_det) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({user_det});

    try {
        const res = await api.put('/users/usr_det', body, config);
        return res;
    } catch (err) {

    }
};

export const changeUserPassword = async (user_det) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({user_det});

    try {
        const res = await api.put('/users/usr_pas', body, config);
        return res;
    } catch (err) {

    }
};

// Register User
export const register = ({ name, email, password, gender, age, date, permission, exp }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ name, email, password, gender, age, date, permission, exp });

    try {
        const res = await api.post('/api/users', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: REGISTER_FAIL
        });
    }
};


// export const register_new = ({ name, email, password, gender, age, date, permission, location, language }) => async dispatch => {
//     const config = {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     };
//
//     const body = JSON.stringify({ name, email, password, gender, age, date, permission, location, language });
//
//     // let aaa = Braintree.
//     try {
//         const res = await api.post('/api/users', body, config);
//
//         dispatch({
//             type: REGISTER_SUCCESS,
//             payload: res.data
//         });
//
//         dispatch(loadUser());
//     } catch (err) {
//         const errors = err.response.data.errors;
//
//         if (errors) {
//             errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//         }
//
//         dispatch({
//             type: REGISTER_FAIL
//         });
//     }
// };

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT });
};

export const resetPassword = async (email) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ email });

    try {
        const res = await api.post('/api/users/reset_password', body, config);
        return res;
    } catch (err) {

    }
};

export const checkExistUser = async (user_email) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify(user_email);

    try {
        const res = await api.post('/api/users/check_exist_user', body, config);
        return res;
    } catch (err) {

    }
};



export const addNewAdminUser = async (users_list) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({users_list});

    try {
        const res = await api.post('/api/users/add_new_admin_user', body, config);
        return res;
    } catch (err) {

    }
};

export const updateAdminUser = async (request) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify(request);

    try {
        const res = await api.post('/api/users/update_admin_user', body, config);
        return res;
    } catch (err) {

    }
};


export const getAdminsPermissions = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await api.get('/api/users/get_admins_permissions', config);
        return res;
    } catch (err) {

    }
};




