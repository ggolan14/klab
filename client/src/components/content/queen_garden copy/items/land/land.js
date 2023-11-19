import React from "react";
import './land.css';
import {Castle} from "../castle/castle";
import {Flowers} from "../flowers/flowers";
import {CastleName} from "../castle/castle_name";

export const Land = ({side, showFlower, handleClick}) => {
  return (
    <div className={"land " + 'land-' + side}>
      {/*<div id="palm"></div>*/}
      {showFlower && side === 'bottom' && (
        <div className='land-flowers'>
          <Flowers numbers_of_flowers={6}/>
        </div>
      )}
      {side === 'top' && (
        <>
          <CastleName side='left'/>
          <Castle handleClick={handleClick}/>
          <CastleName side='right'/>
        </>
      )}
    </div>
  )
}
