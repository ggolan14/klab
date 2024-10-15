import React from "react";
import {QueenGardenContext} from "../context/qg_context";
import {QueenGameBoard} from "../game_board";
import QueenGardenMessages from "../messages";
import {BoardInitialState, WAGON_ANIMATION_TIMING} from "../game_board/constants";
import {QueenGardenGameDebug} from "../game/game_debug";
// componentDidUpdate(prevProps, prevState, snapshot) {
//   if (prevProps !== this.props){
//   }
//   // if (this.props.wagon_place === 'base' && this.state.current_place.includes('return'))
//   //   return;
//   //
//   // if (this.state.current_place !== this.props.wagon_place){
//   //   this.setState(state => {
//   //     let current_place, move_direction;
//   //     if (this.props.wagon_place === 'base' && state.current_place.includes('castle')){
//   //       const last_road = state.current_place.split('_');
//   //       current_place = 'base_return_' + last_road[last_road.length-1];
//   //       move_direction = 'back';
//   //     }
//   //     else {
//   //       const new_place_index = PLACES_LEVELS.findIndex((pl => pl.toString() === this.props.wagon_place.toString()));
//   //       const old_place_index = PLACES_LEVELS.findIndex((pl => pl.toString() === state.current_place.toString()));
//   //       current_place = this.props.wagon_place;
//   //       move_direction = new_place_index>old_place_index? 'forward' : 'back';
//   //     }
//   //     return {current_place, move_direction};
//   //   }, () => {
//   //     setTimeout(() => {
//   //       this.setState(state => ({
//   //         move_direction: 'stop',
//   //         current_place: state.current_place.includes('return')? 'base' : state.current_place
//   //       }))
//   //     }, WAGON_ANIMATION_TIMING);
//   //   })
//   // }
//   //
//   // if (this.state.flower_color !== this.props.flower_color){
//   //   this.setState(() => ({flower_color: this.props.flower_color}))
//   // }
// }

class QueenGardenTutorial extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    // by steps
    this.steps = [
      {
        message_id: 'InstructionsScreen1',
        button_label: 'Next',
      },
      {
        message_id: 'InstructionsScreen2',
        button_label: undefined,
      },
      {
        message_id: 'CrownHighwayToll',
        button_label: 'Next',
        message_position: 'toll_road_queen',
        message_more_info: {
          from_road: 'queen'
        }
      },
      {
        message_id: 'InstructionsCrownTollFinish',
        button_label: 'Next',
      },
      null,
      {
        message_id: 'InstructionsCrownTollFinishReturn',
      },
      null, ///
      {
        message_id: 'InstructionsRoad1Toll',
        button_label: 'Next',
        message_position: 'toll_road_1',
        message_more_info: {
          from_road: '1'
        }
      },
      null,
      {
        message_id: 'InstructionsRoad1TollFinish',
        button_label: 'Next',
      },
      null,
      {
        message_id: 'InstructionsRoad1TollFinishReturn',
      },
      null,
      {
        message_id: 'InstructionsStep10',
        button_label: 'Next',
      },
      null,
      {
        message_id: 'InstructionsStep15',
        button_label: 'Next',
      },
      null,
      null,
      // {
      //   message_id: 'InstructionsStep17',
      //   button_label: 'Next',
      // }
    ];

    this.state = {
      loading: true,
      step: 0,
      with_flower: false,
      ...BoardInitialState()
    }
  }

  componentDidMount() {
    this.level_settings = this.context.game_settings.GamesBank[0];

    this.setState({
      loading: false,
      debugger_props: {
        condition: this.context.game_settings.GameCondition,
        level_settings: this.level_settings,
      },
    })
  }

  changeWagonPlace = road_index => {
    let sc = this.state;
    if (sc.step === 1) {
      if (sc.wagon_place === 'base' && road_index === 'queen') {
        sc.disable_castle_click = false;
        sc.disable_road_click = true;
        sc.wagon_place = road_index;
        return this.setState(sc);
      }
      if (sc.wagon_place === 'queen' && road_index === 'castle') {
        sc.wagon_place = 'castle_toll_queen';
        sc.disable_castle_click = true;
        sc.disable_road_click = true;
        return this.setState(sc, () => {
          setTimeout(() => {
            this.setState(state => ({step: state.step + 1}))
          }, WAGON_ANIMATION_TIMING)
        })
      }
      // if (sc.wagon_place === 'castle_toll_queen' && road_index !== 'castle') return;
    }
    if (sc.step === 5 && road_index === '1'){
      sc.wagon_place = road_index;
      return this.setState(sc);
    }
    if (sc.step === 5 && road_index === 'castle' && sc.wagon_place === '1'){
      sc.wagon_place = 'castle_toll_1';
      sc.step = sc.step + 1;
      return this.setState(sc, () => {
        setTimeout(() => {
          this.setState(() => ({step: sc.step + 1}))
        }, WAGON_ANIMATION_TIMING);
      });
    }
    if (sc.step === 11 && road_index === 'castle' && sc.wagon_place === '1'){
      sc.wagon_place = 'castle_toll_1';
      sc.disable_castle_click = true;
      sc.disable_road_click = true;
      sc.step = sc.step + 1;
      return this.setState(sc, () => {
        setTimeout(() => {
          this.setState(() => ({step: sc.step + 1}))
        }, WAGON_ANIMATION_TIMING);
      });
    }

    // if (road_index === 'castle'){
    //   sc.wagon_place = 'castle_toll_' + sc.wagon_place;
    // }
    // else {
    //   sc.wagon_place = road_index;
    // }
    // if (false){
    //   if (road_index === 'castle' && !sc.wagon_place.includes('castle_toll_')){
    //     sc.disable_castle_click = true;
    //     sc.disable_road_click = true;
    //     sc.wagon_place = 'castle_toll_' + sc.wagon_place;
    //     // sc.wagon_place = 'castle_full_' + sc.wagon_place;
    //     this.setState(sc, () => {
    //       setTimeout(() => {
    //         sc.disable_castle_click = false;
    //         return this.setState(sc);
    //       }, WAGON_ANIMATION_TIMING);
    //     });
    //   }
    //   else if (road_index === 'castle' && sc.wagon_place.includes('castle_toll_')) {
    //     sc.wagon_place = sc.wagon_place.replace('castle_toll_', 'castle_toll_finish_');
    //     sc.disable_castle_click = true;
    //     sc.disable_road_click = true;
    //     this.setState(sc, () => {
    //       setTimeout(() => {
    //         sc.disable_castle_click = true;
    //         sc.disable_road_click = false;
    //         return this.setState(sc);
    //       }, WAGON_ANIMATION_TIMING);
    //     });
    //   }
    //   else if (sc.wagon_place.includes('castle_full_') || sc.wagon_place.includes('castle_toll_finish_')) {
    //     sc.wagon_place = sc.wagon_place.replace(sc.wagon_place.includes('castle_full_')? 'castle_full_' : 'castle_toll_finish_', 'castle_return_');
    //     sc.disable_castle_click = true;
    //     sc.disable_road_click = true;
    //     sc.hide_flower = true;
    //     this.setState(sc, () => {
    //       setTimeout(() => {
    //         return this.nextTrial();
    //       }, WAGON_ANIMATION_TIMING);
    //     });
    //   }
    //   else {
    //     sc.wagon_place = road_index;
    //     sc.disable_castle_click = false;
    //     this.setState(sc);
    //   }
    //
    //   return ;
    // }

  }

  Forward = () => {
    let sc = this.state;

    if (sc.step === 0) {
      sc.step = sc.step+1;
      sc.disable_road_click = false;
      this.setState(sc);
    }
    else if (sc.step === 2){
      sc.wagon_place = 'castle_toll_finish_queen';
      this.setState(sc, () => {
        sc.step = sc.step+1;
        this.setState(sc);
      });
    }
    else if (sc.step === 3){
      sc.step = sc.step+1;
      sc.wagon_place = 'castle_return_queen';
      this.setState(sc, () => {
        setTimeout(() => {
          sc.disable_castle_click = false;
          sc.disable_road_click = false;
          sc.wagon_place = 'queen';
          sc.step = sc.step + 1;
          this.setState(sc);
        }, WAGON_ANIMATION_TIMING);
      });
    }
    else if (sc.step === 7){
      sc.step = sc.step+1;
      sc.wagon_place = 'castle_toll_finish_to_end_1';
      this.setState(sc, () => {
        setTimeout(() => {
          this.setState(() => ({step: sc.step + 1}))
        }, WAGON_ANIMATION_TIMING);
      });
    }
    else if (sc.step === 9){
      sc.step = sc.step+1;
      sc.wagon_place = 'castle_return_1';
      sc.disable_castle_click = true;
      sc.disable_road_click = true;
      this.setState(sc, () => {
        setTimeout(() => {
          sc.step = sc.step+1;
          sc.wagon_place = '1';
          sc.disable_castle_click = false;
          this.setState(sc)
        }, WAGON_ANIMATION_TIMING);
      });
    }
    else if (sc.step === 13){
      sc.step = sc.step+1;
      sc.wagon_place = 'castle_toll_finish_to_end_1';
      this.setState(sc, () => {
        setTimeout(() => {
          this.setState(() => ({step: sc.step + 1}))
        }, WAGON_ANIMATION_TIMING);
      });
    }
    else if (sc.step === 15){
      sc.step = sc.step+1;
      sc.wagon_place = 'castle_return_1';
      sc.disable_castle_click = true;
      sc.disable_road_click = true;
      this.setState(sc, () => {
        setTimeout(() => {
          sc.step = sc.step+1;
          sc.wagon_place = '1';
          this.setState(sc, () => {
            setTimeout(() => {
              this.setState(state => ({wagon_place: 'base'}), () => {
                setTimeout(() => this.props.Forward(), WAGON_ANIMATION_TIMING);
              })
            }, 200)
            // this.setState(state => ({step: state.step + 1, wagon_place: 'base'}))
          })
        }, WAGON_ANIMATION_TIMING);
      });
    }
  }

  render() {
    if (this.state.loading) return <></>;

    const current_step_props = this.steps[this.state.step];

    return (
      <div>
        {current_step_props && (
          <QueenGardenMessages
            button_label={current_step_props.button_label}
            message_id={current_step_props.message_id}
            message_more_info={current_step_props.message_more_info}
            message_position={current_step_props.message_position || 'left'}
            Forward={this.Forward}
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
        />

        {this.context.DebugMode && (
          <QueenGardenGameDebug
            debugger_props={this.state.debugger_props}
            button={{
              button_label: 'Skip Tutorial',
              button_callback: this.props.Forward
            }}
          />
        )}
      </div>
    )
  }
}

QueenGardenTutorial.contextType = QueenGardenContext;

export default QueenGardenTutorial;




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
