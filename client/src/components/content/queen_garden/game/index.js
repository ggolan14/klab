import React from "react";
import {QueenGardenContext} from "../context/qg_context";
import {QueenGameBoard} from "../game_board";
import QueenGardenMessages from "../messages";
import {BoardInitialState, WAGON_ANIMATION_TIMING} from "../game_board/constants";
import {DeliveryFailed, DeliverySuccess} from "../messages/msg";

const random_p = () => !!Math.floor(Math.random() * 2);

class QueenGardenGame extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      step: 0,
      show_start_msg: true,
      delivery_button_label: null,
      delivery_message_id: null,
      delivery_message_position: null,
      ...BoardInitialState(this.props.Part)
    }

    this.Probabilities = [];

    this.start_msg = {
      button_label: 'Next',
      message_id: this.props.Part + 'Msg',
      message_position: 'left'
    };
  }

  changeWagonPlace = road_index => {
    let sc = this.state;
    if (road_index === 'castle' && !sc.wagon_place.includes('castle_toll_')){
      sc.disable_castle_click = true;
      sc.disable_road_click = true;
      const toll_pay = random_p();
      const w_p = toll_pay? 'castle_toll_' : 'castle_full_';
      sc.wagon_place = w_p + sc.wagon_place;
      // sc.wagon_place = 'castle_full_' + sc.wagon_place;
      this.setState(sc, () => {
        setTimeout(() => {
          sc.delivery_button_label = 'Next';
          if (toll_pay){
            sc.delivery_message_id = 'DeliveryFailed';
          }
          else {
            sc.delivery_message_id = 'DeliverySuccess';
          }
          // sc.disable_castle_click = false;
          // sc.disable_road_click = false;
          return this.setState(sc);
        }, WAGON_ANIMATION_TIMING);
      });
    }
    else if (road_index === 'castle' && sc.wagon_place.includes('castle_toll_')) {
      sc.wagon_place = sc.wagon_place.replace('castle_toll_', 'castle_toll_finish_');
      sc.disable_castle_click = true;
      sc.disable_road_click = true;
      this.setState(sc, () => {
        setTimeout(() => {
          sc.disable_castle_click = true;
          sc.disable_road_click = false;
          return this.setState(sc);
        }, WAGON_ANIMATION_TIMING);
      });
    }
    else if (sc.wagon_place.includes('castle_full_') || sc.wagon_place.includes('castle_toll_finish_')) {
      sc.wagon_place = sc.wagon_place.replace(sc.wagon_place.includes('castle_full_')? 'castle_full_' : 'castle_toll_finish_', 'castle_return_');
      sc.disable_castle_click = true;
      sc.disable_road_click = true;
      sc.hide_flower = true;
      this.setState(sc, () => {
        setTimeout(() => {
          return this.nextTrial();
        }, WAGON_ANIMATION_TIMING);
      });
    }
    else {
      sc.wagon_place = road_index;
      sc.disable_castle_click = false;
      this.setState(sc);
    }
  }

  nextTrial = () => {
    let sc = this.state;
    sc.disable_road_click = false;
    sc.disable_castle_click = false;
    sc.wagon_place = sc.wagon_place.replace('castle_return_', '');
    sc.hide_flower = false;
    sc.flowers = [...sc.flowers.slice(1), sc.flowers[0]];
    this.setState(sc, state => {

      setTimeout(() => {


      }, WAGON_ANIMATION_TIMING);
    });


  }

  startPlay = () => {
    let sc = this.state;
    sc.show_start_msg = false;
    sc.disable_castle_click = true;
    sc.disable_road_click = false;
    this.setState(sc);
  }

  msgCallback = () => {
    let sc = this.state;
    sc.delivery_message_id = null;
    sc.disable_castle_click = true;
    sc.disable_road_click = false;
    this.setState(sc);
  }

  AdaptabilityFunction = ({Trial, P0, Adaptability, PathChoose}) => {
    let results = {
      road1: null,
      road2: null,
      road3: null,
      road4: null,
      PathChoose,
      Trial
    };

    for (let road in results){
      if (!road.includes('road')) continue;

      const road_ = road.replace('road', '');

      let Pi,
        Cti = 0,
        last_value = 0;

      try {
        const last_index = this.Probabilities.length-1;
        const last_prob = this.Probabilities[last_index];
        last_value = last_prob[road] >= 1 ? 1 : this.Probabilities[last_index][road] - P0;
        Cti = Number(Number(PathChoose || -1) === Number(road_));
      }
      catch (e) {}

      Pi = Adaptability*(2*Cti - 1);

      const road_total = Math.round((P0 + Pi + last_value)*100)/100;
      results[road] = road_total>=1? 1 : Math.max(road_total, P0);
    }

    this.Probabilities.push(results);
    return results;

  }

  render() {
    let button_label, message_id = null, message_position, callback;
    if (this.state.show_start_msg){
      button_label = this.start_msg.button_label;
      message_id = this.start_msg.message_id;
      message_position = this.start_msg.message_position;
      callback = this.startPlay;
    }
    else if (this.state.delivery_message_id){
      button_label = this.state.delivery_button_label;
      message_id = this.state.delivery_message_id;
      message_position = this.state.delivery_message_position;
      callback = this.msgCallback;
    }

    console.log('message_id', message_id)
    return (
      <div>
        {message_id && (
          <QueenGardenMessages
            button_label={button_label}
            message_id={message_id}
            message_position={message_position  || 'left'}
            Forward={callback}
          />
        )}

        <QueenGameBoard
          gameState={{
            wagon_place: this.state.wagon_place,
            flowers: this.state.flowers,
            hide_flower: this.state.hide_flower,
            disable_castle_click: this.state.disable_castle_click,
            disable_road_click: this.state.disable_road_click,
            with_flower: this.state.with_flower,
          }}
          changeWagonPlace={this.changeWagonPlace}
          nextTrial={this.nextTrial}
        />
      </div>
    )
  }
}


QueenGardenGame.contextType = QueenGardenContext;

export default QueenGardenGame;




// const [gameState, dispatch] = useReducer(reducer, initialState, init);
// function init(initialState) {
//   return {...initialState};
// }
//
// function reducer(state, action) {
//   const {type, payload} = action;
//
//   switch (type) {
//     case 'NEW_WAGON_PLACE':
//       return {
//         ...state,
//         wagon_place: payload,
//       };
//     case 'RETURN_TO_BASE':
//       return {
//         ...state,
//         wagon_place: 'base',
//         hide_flower: true
//       };
//     case 'NEXT_TRIAL': {
//       return {
//         ...state,
//         hide_flower: false,
//         flowers: [...state.flowers.slice(1), state.flowers[0]]
//       }
//     }
//   }
// }
