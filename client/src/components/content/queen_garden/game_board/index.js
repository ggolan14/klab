import React from "react";
import {QueenGardenRoads} from "./roads";
import {AllTrees} from "./tree/trees";
import './index.css';
import {Land} from "./land/land";
import {QueenRoad} from "./queen_road/queen_road";
import GardenWagon from "./wagon/wagon";
import {QueenGardenGameBoardContext} from "../context/qg_board_context";
import {Flowers} from "./flowers/flowers";

export const QueenGameBoard = ({
                                 gameState, changeWagonPlace, nextTrial
                               }) => {

  return (
    <QueenGardenGameBoardContext.Provider
      value={{
        gameState,
        changeWagonPlace,
      }}
    >
      <div
        className='qg_game_board unselectable'
      >
        <Land side='top' />
        <AllTrees/>
        <Land side='bottom' />
        <QueenRoad/>
        <QueenGardenRoads/>
        <GardenWagon
          wagon_place={gameState.wagon_place}
          move_direction={gameState.move_direction}
          flower_color={(gameState.hide_flower || !gameState.with_flower)?null:gameState.flowers[0]}
        />
        <Flowers nextTrial={nextTrial} flowers={gameState.with_flower? gameState.flowers.slice(1) : gameState.flowers}/>
      </div>
    </QueenGardenGameBoardContext.Provider>
  )
}
