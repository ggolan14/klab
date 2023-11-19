import React from "react";
import './signpost.css';

export const Signpost = ({road_index, rotate, bottom, left, side, label, queen, handleClick}) => {

  return (
      <div
        className={"signpost signpost_" +side + (queen? ' signpost_queen' : '')}
        style={{rotate: `${rotate}deg`, bottom, left}}
        onClick={() => handleClick({queen: !!queen, road_index})}
      >
        <div className={"signpost_sign signpost_sign_" +side}>
          <span>{label}</span>
        </div>
        <div className="signpost_leg"/>
      </div>
  )
}
