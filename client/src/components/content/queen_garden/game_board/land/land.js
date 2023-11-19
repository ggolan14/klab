import React from "react";
import './land.css';
import {Castle} from "../castle/castle";
import {CastleName} from "../castle/castle_name";

export const Land = ({side}) => {
  return (
    <div className={"qg_land " + 'qg_land_side_' + side}>
      {side === 'top' && (
        <>
          <CastleName side='Left'/>
          <Castle/>
          <CastleName side='Right'/>
        </>
      )}
    </div>
  )
}
