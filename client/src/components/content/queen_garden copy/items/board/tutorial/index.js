import React, {useReducer} from "react";
import TutorialMsg from "../../tutorial/msg";
import {Land} from "../../land/land";
import {Roads} from "../../roads/roads";
import {Wagon} from "../../wagon/wagon";


const initialState = {
  tutorial_step: 0,
  wagon_move: false,
  // wagon_position: {road: 'road1', from_castle: false, move_direction: null},
  wagon_position: {road: 'reset', from_castle: false, move_direction: null},
  hide_tutorial: false,
  finish_castle: false
};

function init(initialState) {
  return {...initialState};
}

function reducer(state, action) {
  const {type, payload} = action;

  switch (type) {
    case 'NEXT_STEP':
      return {
        ...state,
        tutorial_step: state.tutorial_step + 1,
        finish_castle: false
      };
    case 'SET_TUTORIAL_MSG_STATE':
      return {
        ...state,
        hide_tutorial: payload
      };
    case 'SET_WAGON_POSITION':
      return {
        ...state,
        wagon_position: payload
      };
    case 'FINISH_CASTLE':
      return {
        ...state,
        finish_castle: true
      }
  }
}

const QueenGardenTutorial = ({GameSet, GameSettings, Forward}) => {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  const finishAction = ({action}) => {
    console.log('finishAction action', action);

    if (action === 'finish_to_castle'){
      dispatch({
        type: 'FINISH_CASTLE'
      });
    }
    else if (action === 'finish_to_reset'){
      dispatch({
        type: 'NEXT_STEP',
      });
      dispatch({
        type: 'SET_TUTORIAL_MSG_STATE',
        payload: false
      });
    }
  }

  const handleClick = ({is_button, queen, road_index, to_castle}) => {
    // if (true){
    //   dispatch({
    //     type: 'SET_WAGON_POSITION',
    //     payload: {
    //       road: 'castle',
    //       from_road: 'road1',
    //       is_tutorial: true,
    //       with_tol: true,
    //       move_direction: 'forward'
    //     }
    //   });
    //   dispatch({
    //     type: 'SET_TUTORIAL_MSG_STATE',
    //     payload: true
    //   });
    //   return;
    // }

    console.log('state.tutorial_step', state.tutorial_step);

    if (state.tutorial_step === 0 && is_button){
      dispatch({
        type: 'NEXT_STEP',
      });
    }
    if (state.tutorial_step === 1){
      const {finish_castle, wagon_position} = state;
      const {road} = wagon_position;
      if (road === 'castle' && finish_castle && is_button){
        dispatch({
          type: 'SET_WAGON_POSITION',
          payload: {
            road: 'queen_road',
            from_castle: true,
            move_direction: 'back'
          }
        });
      }
      else if (road === 'queen_road' && to_castle) {
        dispatch({
          type: 'SET_WAGON_POSITION',
          payload: {
            road: 'castle',
            from_road: 'queen_road',
            with_tol: true,
            move_direction: 'forward'
          }
        });
        dispatch({
          type: 'SET_TUTORIAL_MSG_STATE',
          payload: true
        });
        return;
      }
      else if (road === 'reset' && queen) {
        dispatch({
          type: 'SET_WAGON_POSITION', payload: {
            road: 'queen_road', move_direction: 'forward'
          }
        });
      }
    }
    if (state.tutorial_step === 2){
      if (road_index === 0 && state.wagon_position.road === 'queen_road'){
        dispatch({
          type: 'SET_WAGON_POSITION',
          payload: {
            road: 'road1',
            move_direction: 'forward'
          }
        });
      }
      else if (to_castle && state.wagon_position.road === 'road1'){
        dispatch({
          type: 'SET_WAGON_POSITION',
          payload: {
            road: 'castle',
            from_road: 'road1',
            is_tutorial: true,
            with_tol: true,
            move_direction: 'forward'
          }
        });
        dispatch({
          type: 'SET_TUTORIAL_MSG_STATE',
          payload: true
        });
        return;
      }
      else if (to_castle && state.wagon_position.road === 'castle'){
        dispatch({
          type: 'SET_WAGON_POSITION',
          payload: {
            road: state.wagon_position.from_road,
            from_castle: true,
            move_direction: 'back'
          }
        });
        dispatch({
          type: 'SET_TUTORIAL_MSG_STATE',
          payload: true
        });
        return;
      }
      else if (is_button && state.wagon_position.road === 'castle' && state.wagon_position.from_road === 'road1'){
        dispatch({
          type: 'SET_WAGON_POSITION',
          payload: {
            road: state.wagon_position.from_road,
            from_castle: true,
            move_direction: 'back'
          }
        });
        dispatch({
          type: 'SET_TUTORIAL_MSG_STATE',
          payload: true
        });
        return;
      }
    }
    if (state.tutorial_step === 3){
      if (to_castle && state.wagon_position.road === 'road1'){
        dispatch({
          type: 'SET_WAGON_POSITION',
          payload: {
            road: 'castle',
            from_road: 'road1',
            tutorial_msg: true,
            move_direction: 'forward'
          }
        });
        dispatch({
          type: 'SET_TUTORIAL_MSG_STATE',
          payload: true
        });
        return;
      }
    }


    else if (state.tutorial_step === 4) Forward();
  }

  return (
    <div
      className='qg_game_board unselectable'
    >
      {
        !state.hide_tutorial && (
          <TutorialMsg
            GameSet={GameSet}
            GameSettings={GameSettings}
            tutorial_step={state.tutorial_step}
            onClick={handleClick}
          />
        )
      }

      <Land
        side='top'
        handleClick={handleClick}
      />

      <Roads
        MileageTravelCost={GameSettings && GameSettings.MileageTravelCost ? GameSettings.MileageTravelCost : null}
        playerMove={state.wagon_move}
        handleClick={handleClick}
      />

      <Land
        side='bottom'
        showFlower={!state.wagon_move}
      />

      <Wagon
        finishAction={finishAction}
        wagonPosition={state.wagon_position}
        GameSet={GameSet}
        GameSettings={GameSettings}
        handleClick={handleClick}
      />
    </div>
  )
}

export default QueenGardenTutorial;
