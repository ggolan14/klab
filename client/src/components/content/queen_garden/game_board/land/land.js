import React, {useContext} from "react";
import './land.css';
import {Castle} from "../castle/castle";
import {CastleName} from "../castle/castle_name";
import {QueenGardenGameBoardContext} from "../../context/qg_board_context";

export const Land = ({side}) => {
  const {gameState, changeWagonPlace} = useContext(QueenGardenGameBoardContext);

  const allowClick = !gameState.disable_castle_click;

  const onClick = () => {
    if (!allowClick) return;
    changeWagonPlace('castle');
  }

  return (
    <div
      className={"qg_land " + 'qg_land_side_' + side}
      onClick={allowClick?onClick:undefined}
      style={{
        cursor: allowClick? 'pointer' : 'not-allowed'
      }}
    >
      {side === 'top' && (
        <>
          <CastleName side='Left'/>
          <Castle/>
          <CastleName side='Right'/>
        </>
      )}
    </div>
  )
}
