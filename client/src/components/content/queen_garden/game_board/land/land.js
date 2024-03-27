import React, {useContext} from "react";
import './land.css';
import {Castle} from "../castle/castle";
import {CastleName} from "../castle/castle_name";
import {QueenGardenGameBoardContext} from "../../context/qg_board_context";

export const Land = ({side}) => {
   
  const {gameState, changeWagonPlace} = useContext(QueenGardenGameBoardContext);

  const allowClick = !gameState.disable_castle_click && gameState.wagon_place != "castle_toll_finish_queen";

  var cursor_type;
  if(side === 'bottom'){
    cursor_type='not-allowed'
  }else if(side === 'top'&& allowClick){
    cursor_type = 'pointer';
  }


  const onClick = () => {
    if (cursor_type === 'not-allowed') {
      return;
    }else if(allowClick){
      changeWagonPlace('castle');
    }
  }
  
  return (
    <div
      className={"qg_land " + 'qg_land_side_' + side}
      
      onClick={allowClick?onClick:undefined}
      style={{
        cursor: cursor_type
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
