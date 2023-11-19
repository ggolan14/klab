import React, {useEffect} from "react";
import {connect} from "react-redux";
import {GetSocket} from "../../actions/socket";

// const tryReconnect = (socket, reason) => {
//     try {
//         setTimeout(() => {
//             socket.io.open((err) => {
//                 if (err) {
//                     tryReconnect();
//                 }
//             });
//         }, 2000);
//     }
//     catch (e) {
//
//     }
// }

export const SetSocketStatus = connect(
    state => ({
        isAuthenticated: state.auth.isAuthenticated,
        token: state.auth.token,
        status: state.socket.status,
    })
)(({ isAuthenticated, token }) => {

    useEffect(() => {
        try{
            const Socket = GetSocket();

            if (isAuthenticated){
                if (Socket) {
                    Socket.auth.token = token;
                    // Socket.io.on("close", () => tryReconnect(Socket, "close"));
                    // Socket.on("connect_error", () => tryReconnect(Socket, "connect_error"));
                    // Socket.on("disconnect", (reason) => tryReconnect(Socket));
                    if (!Socket.connected)
                        Socket.connect();
                }
                // Socket.socket.connect();
            }
            else {
                if (Socket) {
                    Socket.auth.token = null;
                    // Socket.io.on("close", null);
                    // Socket.on("connect_error", null);
                    // Socket.on("disconnect", null);
                    if (Socket.connected)
                        Socket.disconnect();
                }
            }
        }
        catch (e) {
        }
    }, [isAuthenticated, token]);

    return <></>;
});
