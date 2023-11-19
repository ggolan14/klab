import React, {useState} from "react";
import './road.css';
import {Signpost} from "./signpost";
// import {Tree} from "../tree/tree";
import {Flower} from "../flowers/flower";
import {getGameSet} from "../../Start";
// import {AllTrees} from "../tree/trees";

const RoadPopUp = ({bottom, MileageTravelCost, road_index}) => {
  // if (posX === null || posY === null) return <></>;
  const b_ = Number(bottom.replace('%', '')) - 10;
  return (
    <div
      className={"road_popup " + ('road_popup_'+road_index)}
      style={{bottom: `${b_}%`}}
    >

      Mileage Cost: {MileageTravelCost}
    </div>
  )
};


export const Road = ({ MileageTravelCost, playerMove, road_index, top, left, side, label, zIndex, backgroundColor, width, signpost_label, signpost_left, signpost_bottom, signpost_rotate, handleClick}) => {

  // const treesPlaces = [
  //   {top: '-97%', left: 0},
  //   {top: '-92%', left: road_index === 0?'-15%': '15%'},
  //   {top: '-88%', left: road_index === 0?'-15%': '15%'},
  //   {top: '-82%', left: road_index === 0?'-15%': road_index === 1? '7%' : '15%'},
  // ];
  const {RoadOnHover} = getGameSet();

  return (
    <div
      className='road-container'
      style={{top, left, width}}
    >
      {
        MileageTravelCost !== null && RoadOnHover.includes('Signpost') && (
          <RoadPopUp
            MileageTravelCost={MileageTravelCost}
            road_index={road_index}
            bottom={signpost_bottom}
            left={signpost_left}
          />
        )
      }

      <div
        className={'road road_'+road_index}
        style={{
          zIndex,
          backgroundColor
        }}
      >
        {label && <label>{label}</label>}
      </div>
      <Signpost
        road_index={road_index}
        handleClick={handleClick}
        side={side}
        bottom={signpost_bottom}
        left={signpost_left}
        rotate={signpost_rotate}
        label={signpost_label}
      />

      {/*{treesPlaces.map(*/}
      {/*  (tree, tree_index) => (*/}
      {/*    <Tree*/}
      {/*      key={tree_index}*/}
      {/*      top={tree.top}*/}
      {/*      left={tree.left}*/}
      {/*      fontSize={10}*/}
      {/*    />*/}
      {/*  )*/}
      {/*)}*/}

      {
        playerMove && playerMove.road === road_index && (
          <Flower
            className={'pq-player_start ' + (playerMove.busted ? 'pq-player_start_b' : 'pq-player_start_w')}
            // style={{top: -200, left: 0}}
          />
        )
      }

    </div>
  )
}

