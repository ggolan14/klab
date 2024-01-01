import React from "react";
import './flowers.css';
import {Flower} from "./flower";


export const Flowers = ({flowers}) => {
  return (
    <div
      className='flowers'
    >
      {flowers.map(
        (flower_color, flower_index) => (
          <Flower
            key={flower_color}
            scale_up={flower_index === 0?0.8:0.6}
            flower_color={flower_color}
          />
        )
      )}

     </div>
  )
}
