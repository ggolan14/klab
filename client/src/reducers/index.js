import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import app from "./app";
import chats from "./chats";
import todo from "./todo";
import socket from "./socket";

export default combineReducers({
  alert,
  auth,
  app,
  chats,
  todo,
  socket,
});
