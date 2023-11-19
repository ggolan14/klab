import React from "react";
import './queen_road.css';
import {Signpost} from "./signpost";
import {getGameSet} from "../../Start";
import {Flower} from "../flowers/flower";

export const QueenRoad = ({handleClick, playerMove}) => {
  const places = [
    {side: 'right', rotate: '20', left: '50%', bottom: '50%'},
  ];
  const Labels = getGameSet();

  return (
    <>
      <div
        className='queen_road'
      >
        <div
          className='crown-highway'
        >
          <label>{Labels.CrownHighway_txt}</label>
        </div>

        {
          playerMove && playerMove.road === 'queen' && (
            <Flower
              className={'pq-player_start_q'}
              style={{right: 110}}
            />
          )
        }

      </div>

      <div
        className='crown-highway_signpost'
      >
        <Signpost
          handleClick={handleClick}
          queen={true}
          side={places[0].side}
          bottom={places[0].bottom}
          left={places[0].left}
          rotate={places[0].rotate}
          label={Labels.QueenSignpost_txt}
        />
      </div>
    </>

  )
}
