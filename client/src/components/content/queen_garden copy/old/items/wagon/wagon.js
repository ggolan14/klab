import React, {useEffect, useState} from "react";
import './wagon.css';
import {Wheel} from "./wheel";
import {Flowers} from "../flowers/flowers";
import {Flower} from "../flowers/flower";

const positions = {
  road1: {
    top: '40%',
    left: '15%',
  },
  road2: {
    top: '40%',
    left: '35%',
  },
  road3: {
    top: '40%',
    left: '50%',
  },
  road4: {
    top: '40%',
    left: '65%',

  },
  queen_road: {
    top: '48%',
    left: '70%',
    transform: 'rotate(90deg)'
  },
  reset: {
    top: '40%',
    left: '42%',
  }
}
export const Wagon = ({side, showFlower}) => {
  // const [kkk, setKkk] = useState({road: 'reset', move_direction: null});
  const [kkk, setKkk] = useState({road: 'road1', move_direction: null});
  // useEffect(() => {
  //   let timeout = setTimeout(() => {
  //     const roads = ['queen_road', 'road1', 'road2', 'road3', 'road4'];
  //
  //     let new_road = kkk.road;
  //     let tries = 0;
  //     while (new_road === kkk.road || tries > 6){
  //       const index_ = Math.floor(Math.random() * roads.length);
  //       new_road = roads[index_];
  //       tries++;
  //     }
  //
  //     // console.log('kkk.road', kkk.road);
  //     // console.log('new_road', new_road);
  //
  //     const move_direction ='forward';
  //     setKkk(state => ({
  //       ...state,
  //       road: new_road,
  //       move_direction
  //     }));
  //
  //   }, 1000);
  //   return () => clearTimeout(timeout);
  // }, [kkk]);
  // const move_direction ='back';


  const road_ = kkk.road;

  return (
    <div
      className={"qg_wagon"}
      style={positions[road_]}
    >
      <Flower
        className='flower_absolute'
        style={{
          top: -50,
          left: '40%',
          transform: 'translateX(-50%)'
        }}
      />

      <div
        className='qg_wagon_base'
      />

      <div
        style={{
          display: 'flex',
          columnGap: 30,
          width: "max-content",
        }}
      >
        <Wheel move_direction={kkk.move_direction} side='left'/>
        <Wheel move_direction={kkk.move_direction} side='right'/>
      </div>
    </div>
  )
}
