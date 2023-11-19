import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

import setAuthToken from "./utils/setAuthToken";
import {setConnectionStatus, SetSocket} from "./actions/socket";
import {CURRENT_URL} from "./utils/current_url";

// const initialState = {};
//
// const middleware = [thunk];
//
// const store = createStore(
//   rootReducer,
//   initialState,
//     applyMiddleware(...middleware)
// );
//
// let currentState = store.getState();
//
// store.subscribe(() => {
//     // keep track of the previous and current state to compare changes
//     let previousState = currentState;
//     currentState = store.getState();
//     // if the token changes set the value in localStorage and axios headers
//     if (previousState.auth.token !== currentState.auth.token) {
//         const token = currentState.auth.token;
//         setAuthToken(token);
//     }
// });
//
// export default store;
//
// export const GetStore = () => {
//     return store.getState();
// }

function socket_events_handler(socket, connection_status) {
    try {
        GetStore().dispatch(setConnectionStatus(connection_status));
    }
    catch (e) {

    }
}

let store;

export const CreateStore = () => {
    const initialState = {};
    // const socket = io(CURRENT_URL());
    const socket = io(CURRENT_URL(), {
        autoConnect: false,
        // reconnection: false,
        auth: {
            token: null
        }
    });

    SetSocket(socket);

    const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/');

    store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk, socketIoMiddleware),
    );

    socket.on("disconnect", () => store.dispatch(setConnectionStatus()));
    socket.on("connect", () => store.dispatch(setConnectionStatus()));

    let currentState = store.getState();

    store.subscribe(() => {
        // keep track of the previous and current state to compare changes
        let previousState = currentState;
        currentState = store.getState();
        // if the token changes set the value in localStorage and axios headers
        if (previousState.auth.token !== currentState.auth.token) {
            const token = currentState.auth.token;
            setAuthToken(token);
        }
    });

    // socket.on("connect_error", () => console.log('SOCKET ERROR!!!!'));

    socket.on("connect", () => socket_events_handler(socket, 'ONLINE'));

    socket.on("disconnect", () => socket_events_handler(null, 'OFFLINE'));

    return store;
};

export const GetStore = () => {
    return store;
}

export const GetStoreState = () => {
    return store.getState();
}
