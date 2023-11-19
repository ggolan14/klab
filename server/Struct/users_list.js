const {defaultVersions} = require("../models/models");
let connections_handle = null;

class SocketConnectionsHandle {
    constructor(io) {
        this.ConnectedUsers = {};
        this.SocketIdToUserId = {};
        this.RoomsList = Object.keys(defaultVersions);
        this.io = io;
    }

    addNewUserConnection(user_id, socket, rooms){
        this.ConnectedUsers[user_id] = {
            socket,
            rooms: [...rooms]
        };
        this.SocketIdToUserId[socket.id] = user_id;
    }

    broadcastToAllClients(type, payload){
        if (!this.io) return;
        try {
            this.io.emit('action', {type, payload});
        }
        catch (e) {
        }
    }
    broadcastToRoom(room, type, payload){
        if (!this.io) return;
        try {
            this.io.to(room).emit('action', {type, payload});
        }
        catch (e) {
        }
    }

    notifyToAllPartners(user_id, room, type, payload){
        try {
            this.ConnectedUsers[user_id].socket.to(room).emit('action', {type, payload});
        }
        catch (e) {
        }
    }

    emitToUser(user_id, type, payload){
        try {
            this.ConnectedUsers[user_id].socket.emit('action', {type, payload});
        }
        catch (e) {

        }
    }

    removeSocketFromRooms(socket){
        try {
            const user_id = this.SocketIdToUserId[socket.id];
            for (let i=0; i<this.ConnectedUsers[user_id].rooms.length; i++){
                socket.leave(this.ConnectedUsers[user_id].rooms[i]);
            }
            delete this.SocketIdToUserId[socket.id];
            delete this.ConnectedUsers[user_id];
        }
        catch (e) {

        }
    }

    addUserToRooms(user_id, rooms){
        if (!rooms || !user_id) return;

        try {
            if (Array.isArray(rooms)){
                for (let j=0; j<rooms.length; j++){
                    if (this.RoomsList.indexOf(rooms[j]) > -1) {
                        this.ConnectedUsers[user_id].socket.join(rooms[j]);
                        this.ConnectedUsers[user_id].rooms.push(rooms[j]);
                    }
                }
            }
            else {
                if (this.RoomsList.indexOf(rooms) > -1) {
                    this.ConnectedUsers[user_id].socket.join(rooms);
                    this.ConnectedUsers[user_id].rooms.push(rooms);
                }
            }
        }
        catch (e) {
        }
    }
}

const setConnectionsHandle = (io) => {
  connections_handle = new SocketConnectionsHandle(io);
}

const getConnectionsHandle = (io) => {
    return connections_handle;
}

module.exports = {
    getConnectionsHandle,
    setConnectionsHandle
};
