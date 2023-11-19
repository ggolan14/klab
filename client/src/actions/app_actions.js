import {SET_GAME_MODE, SET_WAIT_FOR_ACTION, SET_ALL_EXPERIMENTS, SET_ALL_EXPERIMENTS_ERROR} from "./types";
import api from "../utils/api";

export const setGameMode = (is_game_mode) => dispatch => {
    dispatch({
        type: SET_GAME_MODE,
        payload: is_game_mode
    });
};

export const setWaitForAction = (wait_for_action) => dispatch => {
    dispatch({
        type: SET_WAIT_FOR_ACTION,
        payload: wait_for_action
    });
};

export const expsList = () => async dispatch => {
    try {
        const res = await api.get('/api/exps_actions/exps_list');

        dispatch({
            type: SET_ALL_EXPERIMENTS,
            payload: res.data.exps_list
        });
    } catch (err) {
        dispatch({
            type: SET_ALL_EXPERIMENTS_ERROR
        });
    }
};
