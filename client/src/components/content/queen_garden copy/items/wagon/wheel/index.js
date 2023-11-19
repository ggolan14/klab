import React from "react";
import WheelImg from './wheel.png';

export const Wheel = ({side, move_direction}) => {

  const style = {
    // bottom: 0,
    width: 'max-content',
    height: 'max-content',
    // [side]: 0,
  };

  return (
    <div
      className={"wagon_wheel "}
      style={style}
    >

      <img
        className={"wheel " + (move_direction? ' wheel-'+move_direction:'')}
        src={WheelImg}
        alt="1588433178436"
        border="0"
        width={75}
        // height={'5%'}
      />
    </div>
  )
}
