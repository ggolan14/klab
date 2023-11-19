import React, {useEffect, useRef, useState} from "react";
import './roads.css';
import {Road} from "./road";
import {QueenRoad} from "./queen_road";
import {getGameSet} from "../../Start";
import {AllTrees} from "../tree/trees";

export const Roads = ({handleClick, playerMove, MileageTravelCost}) => {
  const ForestRoadRef = useRef(null);
  const [roadWidth, setRoadWidth] = useState(null);
  const [spaceWidth, setSpaceWidth] = useState(null);

  useEffect(() => {
    if (!(ForestRoadRef && ForestRoadRef.current)) return;

    const handleResize = () => {
      try {
        const {width: forest_width} = ForestRoadRef.current.getBoundingClientRect();
        const road_width = forest_width/6;
        const space_width = (forest_width - 4*road_width)/3 ;
        setSpaceWidth(space_width)
        setRoadWidth(road_width);
      }
      catch (e) {}
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [ForestRoadRef]);

  const places = [
    {side: 'right', rotate: '-20', left: -40, bottom: '-18%'},
    {side: 'right', rotate: '-45', left: -20, bottom: '-20%'},
    {side: 'left', rotate: '30', left: 40, bottom: '-20%'},
    {side: 'left', rotate: '60', left: 30, bottom: '-20%'},
  ];

  const Labels = getGameSet();

  return (
    <div
      className='roads'
    >
      <div/>
      <div
        className='forest_roads'
        ref={ForestRoadRef}
      >
        <AllTrees />
        {
          roadWidth && places.map(
            (place, r_i) => (
              <Road
                playerMove={playerMove}
                handleClick={handleClick}
                key={r_i}
                road_index={r_i}
                zIndex={99}
                backgroundColor='gray'
                left={roadWidth/2 + r_i*spaceWidth + r_i*(roadWidth)}
                // left={`${r_i*25}%`}
                top={`${50}%`}
                width={roadWidth}
                signpost_bottom={place.bottom}
                signpost_left={place.left}
                signpost_rotate={place.rotate}
                side={place.side}
                signpost_label={Labels['Road' + (r_i+1) + '_txt']}
                MileageTravelCost={MileageTravelCost}
              />
            )
          )
        }
      </div>

      <QueenRoad playerMove={playerMove} handleClick={handleClick}/>
    </div>
  )
}
