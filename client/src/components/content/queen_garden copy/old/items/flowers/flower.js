import React from "react";

export const Flower = ({style, className}) => {

  return (
    <div
      style={style || {}}
         className={"flower sunflower " + (className || '')}
    >
      <div className="head">
        <div id="eye-1" className="eye"/>
        <div id="eye-2" className="eye"/>
        <div className="mouth"/>
      </div>
      <div className="petals"/>
      <div className="flower_trunk">
        <div className="left-branch"/>
        <div className="right-branch"/>
      </div>
      {/*<div className="vase"/>*/}
    </div>
  )
}
