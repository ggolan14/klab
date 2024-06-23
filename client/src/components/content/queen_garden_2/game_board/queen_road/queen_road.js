import React, {useContext} from "react";
import './queen_road.css';
import {Signpost} from "../signpost/signpost";
import {QueenGardenContext} from "../../context/qg_context";

export const QueenRoad = () => {
  const {game_settings: {Labels}} = useContext(QueenGardenContext);

  return (
    <div
      className='queen_road'
    >
      <div
        className='crown-highway'
      >
        <label>{Labels.CrownHighway}</label>
      </div>

      <Signpost
        road_index={'queen'}
      />
    </div>
  )
}
