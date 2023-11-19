import React, {useContext} from "react";
import './signpost.css';
import {QueenGardenGameBoardContext} from "../../context/qg_board_context";
import {QueenGardenContext} from "../../context/qg_context";

const ALLOW_PLACES = ['base', '1', '2', '3', '4', 'queen'];

export const Signpost = ({road_index}) => {
  const {game_settings: {Labels}} = useContext(QueenGardenContext);
  const {gameState, changeWagonPlace} = useContext(QueenGardenGameBoardContext);

  let allowClick = !gameState.disable_road_click;
  if (allowClick && gameState.wagon_place.includes(road_index)){
    allowClick = gameState.wagon_place.includes('castle');
  }
  // const allowClick = !gameState.disable_click && (ALLOW_PLACES.indexOf(gameState.wagon_place) > -1);

  const signpost_lbl = 'Signpost' + (road_index === 'queen'? 'Queen' : `Road${road_index}`);

  const onClick = () => {
    if (!allowClick) return;
    changeWagonPlace(road_index);
  }

  return (
      <div
        className={"signpost signpost_" + road_index}
        onClick={allowClick?onClick:undefined}
        style={{
          cursor: allowClick? 'pointer' : 'not-allowed'
        }}
      >
        <div className={"signpost_sign signpost_sign_"+road_index}>
          <span>{Labels[signpost_lbl]}</span>
        </div>
        <div className={"signpost_leg signpost_leg_" + road_index}/>
      </div>
  )
}
