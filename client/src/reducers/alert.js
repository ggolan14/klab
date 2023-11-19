import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = {};

export default function AlertReducer(state = initialState, action) {
  const { type, payload } = action;

    // const merged = { ...initialState, ...state };

    switch (type) {
    case SET_ALERT:
      return payload;
    case REMOVE_ALERT:
        return null;
    default:
        return state;
  }
}
