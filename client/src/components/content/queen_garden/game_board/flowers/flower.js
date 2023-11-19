import React from "react";

export const Flower = ({flower_color, scale_up = 0.6}) => {

  return (
    <div
      className={"flower sunflower "}
      style={{
        scale: scale_up.toString()
      }}
    >
      <div className="head">
        <div id="eye-1" className="eye"/>
        <div id="eye-2" className="eye"/>
        <div className="mouth"/>
      </div>
      <div className={"petals flower_" + flower_color}/>
      <div className="flower_trunk">
        <div className="left-branch"/>
        <div className="right-branch"/>
      </div>
    </div>
  )
}
