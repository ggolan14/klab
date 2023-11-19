import React from "react";
import WheelImg from './wheel.png';

const Wheel = ({move_direction}) => {
  return (
    <div
      style={{
        width: 'max-content',
        height: 'max-content',
      }}
    >
      <img
        className={"wagon_wheel " + (move_direction? ' wheel-'+move_direction:'')}
        src={WheelImg}
        alt="wheel"
        border="0"
        width={75}
      />
    </div>
  )
}

export const Wheels = ({move_direction}) => {
  return (
    <div
      style={{
        display: 'flex',
        columnGap: 5,
        width: "max-content",
      }}
    >
      <Wheel
        move_direction={move_direction}
      />
      <Wheel
        move_direction={move_direction}
      />
    </div>
  )
}
