import {
  SET_SOCKET_STATUS
} from '../actions/types';

const initialState = {
  status: 'OFFLINE'
};

export default function SocketReducer(state = initialState, action) {
  const { type, payload } = action;

    switch (type) {
    case SET_SOCKET_STATUS:
      return {
        ...state,
        status: payload
      };
    default:
      return state;
  }
}
