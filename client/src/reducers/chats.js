import {
  CHATS_LOADED, NEW_CHAT_MSG
} from '../actions/types';

const initialState = {};

const addNewChat = (state, new_chat) => {
  const state_ = {...state};
  state_[new_chat.exp].push(new_chat);

  return {...state_};
}

export default function ChatsReducer(state = initialState, action) {
  const { type, payload } = action;

    switch (type) {
      case CHATS_LOADED:
        return payload.chats;
      case NEW_CHAT_MSG:
        return addNewChat(state, payload);

    default:
      return state;
  }
}
