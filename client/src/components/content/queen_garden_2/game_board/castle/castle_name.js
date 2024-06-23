import React, {useContext} from "react";
import './castle_name.css';
import {QueenGardenContext} from "../../context/qg_context";

export const CastleName = ({side}) => {
  const {game_settings: {Labels}} = useContext(QueenGardenContext);

  return (
    <div
      className={"castle_name " + `castle_name_${side.toLowerCase()}`}
    >
      <label>{Labels['Kingdom' + side]}</label>
    </div>
  )
}
