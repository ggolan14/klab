import { SET_ALERT, REMOVE_ALERT } from './types';

let TIME_OUT = null;
export const setAlert = (msg, alertType, timeout = 3000) => dispatch => {
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType }
  });

  if (TIME_OUT === null){
    TIME_OUT = setTimeout(() => {
      TIME_OUT = null
      dispatch({type: REMOVE_ALERT});
    }, timeout);
  }
  else {
    clearTimeout(TIME_OUT);
    TIME_OUT = setTimeout(() => {
      TIME_OUT = null
      dispatch({type: REMOVE_ALERT});
    }, timeout);
  }
};
