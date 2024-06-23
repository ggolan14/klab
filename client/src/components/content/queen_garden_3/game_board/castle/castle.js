import React, {useContext} from "react";
import './castle.css';
import {QueenGardenGameBoardContext} from "../../context/qg_board_context";
import {Flower} from "../flowers/flower";

const ALLOW_PLACES = ['1', '2', '3', '4', 'queen'];

export const Castle = () => {
  const {gameState} = useContext(QueenGardenGameBoardContext);

  const flower_color = gameState.hide_flower? gameState.flowers[0] : null;
  const classes = [
    "shadow", "minar-top minar-top-2", "minar-top","minar ha",
    "tower tower-5 tower-6 tower-7", "house ha", "main-roof-behind",
    "main-roof ha", "main-top", "flag flag-4", "main-tower-roof",
    "main-tower", "main ha", "tower tower-3 tower-3a", "wall ha",
    "tower tower-1", "tower tower-2", "tower tower-3 tower-3b", "tower tower-4",
    "tower tower-5 tower-6", "tower tower-5", "brick", "room-1", "room-2",
    "room-3 ha", "window", "window-curved", "roof roof-1", "roof roof-2",
    "flag flag-1", "flag flag-2", "flag flag-3", "flag-pole-top", "flag-pole",
    "house-roof"
  ];

  return (
    <div
      className="castle_container"
    >
      {flower_color && (
        <div className='castle_flower'>
          <Flower
            flower_color={flower_color}
            scale_up={2.8}
          />
        </div>
      )}
      <div className="cartoon hb">
        {classes.map(
          (class_, class_i) => (
            <div key={class_i} className={class_}/>
          )
        )}
        <div className="front-gate ha">
          <div className="gate"/>
          <div className="balcony ha"/>
          <div className="triangle ha"/>
          <div className="front-poles"/>
        </div>

      </div>
    </div>
  )
}
