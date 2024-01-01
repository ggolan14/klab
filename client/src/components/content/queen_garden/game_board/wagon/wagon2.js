import React from "react";
import './wagon.css';
import {Wheels} from "./wheel";
import {Flower} from "../flowers/flower";

const PLACES_LEVELS = ['1', '2', 'base', '3', '4', 'queen', 'castle_full_1', 'castle_full_2', 'castle_full_3', 'castle_full_4', 'castle_full_4', ];

const WAGON_ANIMATION_TIMING = 1000;

export default class GardenWagon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      move_direction: 'stop', // stop back forward
      current_place: this.props.wagon_place, // base 1-4 queen
      flower_color: this.props.flower_color
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps !== this.props){
    }
    // if (this.props.wagon_place === 'base' && this.state.current_place.includes('return'))
    //   return;
    //
    // if (this.state.current_place !== this.props.wagon_place){
    //   this.setState(state => {
    //     let current_place, move_direction;
    //     if (this.props.wagon_place === 'base' && state.current_place.includes('castle')){
    //       const last_road = state.current_place.split('_');
    //       current_place = 'base_return_' + last_road[last_road.length-1];
    //       move_direction = 'back';
    //     }
    //     else {
    //       const new_place_index = PLACES_LEVELS.findIndex((pl => pl.toString() === this.props.wagon_place.toString()));
    //       const old_place_index = PLACES_LEVELS.findIndex((pl => pl.toString() === state.current_place.toString()));
    //       current_place = this.props.wagon_place;
    //       move_direction = new_place_index>old_place_index? 'forward' : 'back';
    //     }
    //     return {current_place, move_direction};
    //   }, () => {
    //     setTimeout(() => {
    //       this.setState(state => ({
    //         move_direction: 'stop',
    //         current_place: state.current_place.includes('return')? 'base' : state.current_place
    //       }))
    //     }, WAGON_ANIMATION_TIMING);
    //   })
    // }
    //
    // if (this.state.flower_color !== this.props.flower_color){
    //   this.setState(() => ({flower_color: this.props.flower_color}))
    // }
  }

  render() {

    return (
      <div
        className={"qg_wagon qg_wagon_place_"+ this.state.current_place}
        // onAnimationStart={e => console.log('onAnimationIteration2')}
        // onAnimationIteration={e => console.log('onAnimationIteration2')}
        // onAnimationEnd={e => console.log('onAnimationEnd2')}
      >
        {this.state.flower_color && (
          <div className='qg_wagon_flower'>
            <Flower
              flower_color={this.state.flower_color}
            />
          </div>
        )}

        <div
          className='qg_wagon_base'
        />
        <Wheels move_direction={this.state.move_direction}/>
      </div>
    );
  }

}
