import React from "react";
import './flowers.css';
import {Flower} from "./flower";


export const Flowers = ({numbers_of_flowers = 1}) => {
  return (
    <div className='flowers'>
      {Array.from({length: numbers_of_flowers}, (_,i) => i).map(
        flower_index => (
          <Flower
            key={flower_index}
            // style={{bottom: '210px', left: (50 + flower_index*5)+'%'}}
          />
        )
      )}

     </div>
  )
}
