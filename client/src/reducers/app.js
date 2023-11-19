import {
  SET_GAME_MODE, SET_WAIT_FOR_ACTION,
} from '../actions/types';

const initialState = {
  isGameMode: false,
  waitForAction: false
};

export default function AppReducer(state = initialState, action) {
  const { type, payload } = action;

    switch (type) {
    case SET_GAME_MODE:
      return {
        ...state,
        isGameMode: payload
      };
      case SET_WAIT_FOR_ACTION:
        return {
          ...state,
          waitForAction: payload
        };
      // case SET_ALL_EXPERIMENTS:
      //   return {
      //     ...state,
      //     allExperiments: payload
      //   };
      // case SET_ALL_EXPERIMENTS_ERROR:
      //   return {
      //     ...state,
      //     allExperiments: []
      //   };
    default:
      return state;
  }
}
