import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED, USER_UPDATE
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  authLoading: true,
};

export default function AutoReducer(state = initialState, action) {
  const { type, payload } = action;

    switch (type) {
      case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        authLoading: false,
        user: payload.user,
      };
      case USER_UPDATE:
        return {
          ...state,
          user: {
            ...state.user,
            age: payload.age,
            gender: payload.gender,
            name: payload.name
          },
        };
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        authLoading: false,
      };
      case REGISTER_FAIL:
      case AUTH_ERROR:
      case LOGIN_FAIL:
      case LOGOUT:
      case ACCOUNT_DELETED:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        authLoading: false,
      };
    default:
      return state;
  }
}
