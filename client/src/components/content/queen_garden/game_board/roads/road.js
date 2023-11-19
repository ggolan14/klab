import React from "react";
import {Signpost} from "../signpost/signpost";

export const QueenGardenRoad = ({road_index}) => {


  return (
    <div
      className={'qg_game_road qg_game_road_left_' + road_index}
    >
      <div className={'qg_game_road_box qg_game_road_' + road_index}/>

      <Signpost
        road_index={road_index}
      />
    </div>
    // <div
    //   className={'qg_game_road qg_game_road_'+road_index}
    // >
    //   <Signpost
    //     // road_index={'queen'}
    //     road_index={road_index}
    //   />
    //   {/*{label && <label>{label}</label>}*/}
    // </div>
  )
}
