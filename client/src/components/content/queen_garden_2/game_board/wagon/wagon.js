import React, {useEffect, useRef, useState} from "react";
import './wagon.css';
import {Wheels} from "./wheel";
import {Flower} from "../flowers/flower";
import {PLACES_LEVELS, WAGON_ANIMATION_TIMING} from "../constants";

/*
qg_wagon_place_
1 2 3 4 queen
castle_full_
castle_toll_
castle_toll_finish_
castle_return_
 */

const GardenWagon = ({wagon_place = 'base', flower_color, move_direction='stop' }) => {

  const [moveDirection, setMoveDirection] = useState(move_direction);
  let last_place = useRef('base');

  useEffect(() => {
    if (wagon_place === 'game_load') return;
    let st;
    if (last_place.current !== wagon_place){
      const new_place_index = PLACES_LEVELS.findIndex((pl => pl.toString() === wagon_place.toString()));
      const old_place_index = PLACES_LEVELS.findIndex((pl => pl.toString() === last_place.current.toString()));
      const md = (last_place.current.includes('castle_toll_finish_') || last_place.current.includes('return'))? 'stop' : (new_place_index>old_place_index? 'forward' : 'back');

      // console.log('\n');
      // console.log('wagon_place', wagon_place);
      // console.log('last_place.current', last_place.current);
      // console.log('new_place_index', new_place_index);
      // console.log('old_place_index', old_place_index);

      setMoveDirection(md);
      last_place.current = wagon_place;
      if (md !== 'stop')
        st = setTimeout(() => {
        setMoveDirection('stop');
      }, WAGON_ANIMATION_TIMING);
    }

    return () => clearTimeout(st);
  }, [wagon_place]);

  const className = "qg_wagon qg_wagon_place_"+ wagon_place;

  return (
    <div
      className={className}
    >
      {flower_color && (
        <div className='qg_wagon_flower'>
          <Flower
            flower_color={flower_color}
          />
        </div>
      )}

      <div
        className='qg_wagon_base'
      />
      <Wheels move_direction={moveDirection}/>
    </div>
  );
}


export default GardenWagon;
