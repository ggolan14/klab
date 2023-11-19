import React from "react";
import './castle_name.css';
import {getGameSet} from "../../Start";

export const CastleName = ({side}) => {
  const Labels = getGameSet();
  const name = side === 'left' ? Labels.KingdomLeft_txt : Labels.KingdomRight_txt;
  return (
    <div
      className={"castle_name " + `castle_name_${side}`}
    >
      <label>{name}</label>
    </div>
  )
}
