import {GetStoreState} from "../store";
import {SET_SOCKET_STATUS} from "./types";

let Socket = null;

export const SetSocket = socket => {
    Socket = socket;
}

export const GetSocket = () => {
    return Socket;
}

export async function socketAsyncEmit(action_of, action, data){
    if (!Socket) return {result: 'NETWORK_ERROR'};
    return new Promise(resolve => {
        Socket.emit(action_of, action, data, (answer) => {
            resolve(answer);
        });
    })
}


export const setConnectionStatus = () => async dispatch => {
    const {isAuthenticated} = GetStoreState().auth;

    dispatch({type: SET_SOCKET_STATUS, payload: isAuthenticated? 'ONLINE': 'OFFLINE'});
}
