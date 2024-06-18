import React from "react";
import {QueenGardenContext} from "../context/qg_context";
import {QueenGameBoard} from "../game_board";
import QueenGardenMessages from "../messages";
import {BoardInitialState, WAGON_ANIMATION_TIMING} from "../game_board/constants";
import {QueenGardenGameLoading} from "./game_loading";
import {QueenGardenGameDebug} from "./game_debug";
import {getTimeDate} from "../../../../utils/app_utils";

const GAME_LOAD_TIME = 1.5 * 1000;

class QueenGardenGame extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      trial: 1,
      show_start_msg: true,
      delivery_button_label: null,
      delivery_message_id: null,
      delivery_message_position: null,
      delivery_message_more_info: null,
      with_flower: true,
      loading: true,
      debugger_props: {},
      game_loading: true,
      last_road:0,
      ...BoardInitialState()
    }

    this.Probabilities = [];
    this.game_data = [];
    this.trial_action_time = [];
    this.game_points = 0;
  }

  componentDidMount(){
    const current_game_index = this.context.current_game_index;

    this.start_msg = {
      button_label: 'Start',
      button_class_name: 'qg-g-s-b',
      message_id: (current_game_index === 0? 'Practice' : 'Game') + 'Msg',
      message_position: current_game_index === 0? 'left' : 'center',
    };

    this.level_settings = this.context.game_settings.GamesBank[current_game_index];

    this.setState({loading: false}, () => {
      setTimeout(() => {
        this.setState({
          game_loading: false,
          debugger_props: {
            condition: this.context.game_settings.GameCondition,
            level_settings: this.level_settings,
            game_points: this.game_points,
          }
        });
      }, GAME_LOAD_TIME);
    });
  }

  changeWagonPlace = road_index => {
    let sc = this.state;

    console.log("---> in GAME changeWagonPlace.   FROM: "+sc.wagon_place+"  TO: "+road_index)
    if (road_index === 'castle'){
      sc.disable_castle_click = true;
      sc.disable_road_click = true;
      const FROM_ROAD = sc.wagon_place;
      const {roads_prob, adaptability_debugger_props} = this.AdaptabilityFunction({
        P0: this.level_settings.P0,
        Adaptability: this.level_settings.Adaptability,
        PathChoose: FROM_ROAD
      });

      let random_number = '', road_p = '';
      // let busted = true;
      let busted = FROM_ROAD === 'queen';
      
      let needToPay = false;
      if(sc.wagon_place != "base"){
        needToPay = sc.last_road != sc.wagon_place;
      }
      
      sc.last_road = sc.wagon_place;
      let Reward = 0, Pay = 0, TrialPoints , ClearingCost;
      if (FROM_ROAD !== 'queen'){
        random_number = Math.round(Math.random() * 1000)/1000;
        road_p = roads_prob['road' + FROM_ROAD];
        busted = random_number <= road_p;

        if (!busted){
          Reward = this.level_settings.RewardValue;
          ClearingCost = this.level_settings.ClearingCost;
          if(needToPay){
            Reward = Reward - ClearingCost
          }
          this.context.needToPayClearing = needToPay;
          this.context.finalReward = Reward;
          console.log("---> needToPay="+needToPay+"  finalReward="+Reward)
        }
      }
      else {
        Pay = this.level_settings.TollCost;
        if(needToPay){
          Pay = Pay + ClearingCost;
        }
        Reward = this.level_settings.RewardValue;
      }

      const w_p = busted? 'castle_toll_' : 'castle_full_';

      // this.props.START_APP_MIL;
      // let ElapsedTimeFromLastTrialMil;
      // if (trial_props.Trial === 1)
      //   ElapsedTimeFromLastTrialMil = 0;
      // else
      //   ElapsedTimeFromLastTrialMil = Date.now() - TrialResults[TrialResults.length-1].ActionTime;
      //
      // let obj = {
      //   ...trial_props,
      //   Time: getTimeDate().time,
      //   ElapsedTimeFromLastTrialMil,
      //   ElapsedTimeFromStartMil: Date.now() - START_MIL,
      //   ActionTime: Date.now()
      // };

      TrialPoints = Reward - Pay;
      console.log("------> in change wagon place : TrialPoints="+TrialPoints+"  Reward="+Reward+"   Pay="+Pay)
      this.game_points = this.game_points + TrialPoints;

      const {game_settings} = this.context;

      const TimeNow = Date.now();
      this.trial_action_time.push(TimeNow);

      const LAST_TRIAL = (sc.trial-1) -1;

      const trial_data = {
        Condition: game_settings.GameCondition,
        GameOrder: this.level_settings.GameOrder,
        GameID: this.level_settings.GameID,
        Trial: sc.trial,
        Trials: this.level_settings.Trials,
        P0: this.level_settings.P0,
        Adaptability: this.level_settings.Adaptability,
        PathChoose: sc.wagon_place,
        Road1_Prob: roads_prob.road1,
        Road2_Prob: roads_prob.road2,
        Road3_Prob: roads_prob.road3,
        Road4_Prob: roads_prob.road4,
        RandomNumber: random_number,
        Busted: Number(busted),
        Reward,
        Pay,
        TrialPoints,
        TotalPoints: this.game_points,
        Time: getTimeDate(TimeNow).time,
        ElapsedFromGameStart: TimeNow - this.START_GAME_MIL,
        ElapsedTimeFromLastTrial: LAST_TRIAL<0?0:(TimeNow - this.trial_action_time[LAST_TRIAL]),
        ElapsedTimeFromStart: TimeNow - this.props.START_APP_MIL
      };

      this.game_data.push(trial_data);

      if (this.context.DebugMode){
        sc.debugger_props = {
          ...sc.debugger_props,
          adaptability_debugger_props,
          roads_prob,
          game_points: this.game_points,
          trial_results: {
            road_p,
            random_number,
            busted: busted.toString(),
            Reward,
            Pay,
            TrialPoints
          },
          game_data: this.game_data,
          All_Probabilities: this.Probabilities,
          trial_data
        };
      }

      sc.wagon_place = w_p + FROM_ROAD;
      // sc.wagon_place = 'castle_full_' + sc.wagon_place;
      this.setState(sc, () => {
        setTimeout(() => {
          sc.delivery_button_label = 'Next';
          if (busted){
            sc.delivery_message_id = sc.wagon_place === 'castle_toll_queen'? 'DeliveryToll' : 'DeliveryFailed';
            sc.delivery_message_more_info = {
              from_road: FROM_ROAD,
              flower_color: FROM_ROAD === 'queen'? null : sc.flowers[0]
            };
            sc.delivery_message_position = 'toll_road_' + FROM_ROAD;
            sc.flower_on_wagon = sc.delivery_message_id !== 'DeliveryFailed';
          }
          else {
            sc.delivery_message_id = 'GainMessage';
            sc.delivery_message_position = 'gain_msg_' + FROM_ROAD;
            sc.delivery_message_more_info = {
              from_queen_road: sc.wagon_place.includes('queen')
            };
          }
          // sc.disable_castle_click = false;
          // sc.disable_road_click = false;
          return this.setState(sc);
        }, WAGON_ANIMATION_TIMING);
      });
    }
    else {
      sc.wagon_place = road_index;
      sc.disable_castle_click = false;
      this.setState(sc);
    }
    // else if (road_index === 'castle' && sc.wagon_place.includes('castle_toll_')) {
    //   // sc.wagon_place = sc.wagon_place.replace('castle_toll_', 'castle_toll_finish_');
    //   // sc.disable_castle_click = true;
    //   // sc.disable_road_click = true;
    //   // this.setState(sc, () => {
    //   //   setTimeout(() => {
    //   //     sc.disable_castle_click = true;
    //   //     sc.disable_road_click = false;
    //   //     return this.setState(sc);
    //   //   }, WAGON_ANIMATION_TIMING);
    //   // });
    // }
    // else if (sc.wagon_place.includes('castle_full_') || sc.wagon_place.includes('castle_toll_finish_')) {
    //   sc.wagon_place = sc.wagon_place.replace(sc.wagon_place.includes('castle_full_')? 'castle_full_' : 'castle_toll_finish_', 'castle_return_');
    //   sc.disable_castle_click = true;
    //   sc.disable_road_click = true;
    //   sc.hide_flower = true;
    //   this.setState(sc, () => {
    //     setTimeout(() => {
    //       return this.nextTrial();
    //     }, WAGON_ANIMATION_TIMING);
    //   });
    // }
  }

  startPlay = () => {
    let sc = this.state;
    sc.show_start_msg = false;
    sc.disable_castle_click = true;
    sc.disable_road_click = false;
    this.setState(sc, () => this.START_GAME_MIL = Date.now());
  }

  msgCallback = ()=> {
    let sc = this.state;
    sc.disable_castle_click = true;
    sc.disable_road_click = true;
    const MSG_ID = sc.delivery_message_id;

    if (MSG_ID === 'DeliveryToll'){
      sc.wagon_place = sc.wagon_place.replace('castle_toll_', 'castle_toll_finish_');
    }
    else if (MSG_ID === 'GainMessage'){
      sc.wagon_place = sc.wagon_place.replace(sc.wagon_place.includes('castle_full_')? 'castle_full_' : 'castle_toll_finish_', 'castle_return_');
      sc.hide_flower = true;
    }
    else if (MSG_ID === 'DeliveryFailed'){
      sc.wagon_place = sc.wagon_place.replace('castle_toll_', 'castle_toll_finish_');
    }
    sc.delivery_message_id = null;
    sc.delivery_message_more_info = null;
    let IS_LAST_TRIAL = (sc.trial + 1) > this.level_settings.Trials;

    this.setState(sc, () => {
      setTimeout(() => {
        if (MSG_ID === 'DeliveryToll'){
          sc.delivery_message_id = 'GainMessage';
          const FROM_ROAD = sc.wagon_place.replace('castle_toll_finish_', '');
          sc.delivery_message_position = 'gain_msg_' + FROM_ROAD;
          sc.delivery_message_more_info = {
            from_queen_road: sc.wagon_place.includes('queen')
          };
        }
        else if (MSG_ID === 'GainMessage'){
          // sc.disable_castle_click = false;
          // sc.disable_road_click = false;
          // sc.hide_flower = false;
          // sc.flowers = [...sc.flowers.slice(1), sc.flowers[0]];
          sc.wagon_place = sc.wagon_place.replace('castle_return_', '');
          sc.trial = IS_LAST_TRIAL? sc.trial : (sc.trial + 1);
          sc.flowers = [...sc.flowers.slice(1), sc.flowers[0]];
          sc.flower_on_wagon = !IS_LAST_TRIAL;
          // sc.flower_on_wagon = !(sc.trial >= this.level_settings.Trials);
          sc.hide_flower = IS_LAST_TRIAL;
        }
        else if (MSG_ID === 'DeliveryFailed'){
          sc.flowers = [...sc.flowers.slice(1), sc.flowers[0]];
          sc.wagon_place = sc.wagon_place.replace('castle_toll_finish_', '');
          sc.trial = IS_LAST_TRIAL? sc.trial : (sc.trial + 1);
          sc.flower_on_wagon = !IS_LAST_TRIAL;
        }

        this.setState(sc, () => {
          if (IS_LAST_TRIAL){
            const GAME_DATA = this.game_data;
            setTimeout(() => {
              sc.disable_castle_click = true;
              sc.disable_road_click = true;
              sc.wagon_place = 'base';
              this.setState(sc, () => {
                setTimeout(() => {
                  this.props.Forward(true, GAME_DATA);
                }, WAGON_ANIMATION_TIMING);
              });
            }, WAGON_ANIMATION_TIMING/3)
          }
          else {
            sc.disable_castle_click = false;
            sc.disable_road_click = false;
            // sc.flowers = [...sc.flowers.slice(1), sc.flowers[0]];
            this.setState(sc);
          }
        });
      }, WAGON_ANIMATION_TIMING);
    });
  }

  AdaptabilityFunction = ({P0, Adaptability, PathChoose}) => {
    let roads_prob = {
      road1: null,
      road2: null,
      road3: null,
      road4: null,
      PathChoose: 'road' + PathChoose,
    };

    let adaptability_debugger_props = {};

    for (let road in roads_prob){
      if (!road.includes('road')) continue;

      // const road_ = road.replace('road', '');

      let Pi,
        Cti = 0,
        last_prob = P0;

      try {
        const last_index = this.Probabilities.length-1;
        if (last_index < 0){
          last_prob = P0;
          Cti = 0;
        }
        else {
          last_prob = this.Probabilities[last_index][road];
          Cti = road === this.Probabilities[last_index].PathChoose? 1 : 0;
        }
      } catch (e) {}

      Pi = last_prob + Adaptability*(2*Cti - 1);
      Pi = Math.max(Pi, P0);
      if(Pi>=1){
        Pi=1;
      }

      // const road_total = Math.round((Pi)*100)/100;
      // roads_prob[road] = road_total>=1? 1 : Math.max(road_total, P0);

      roads_prob[road] = Pi;

      if (this.context.DebugMode){
        adaptability_debugger_props[road] = {
          'P(i-1)': last_prob,
          Adaptability,
          Cti,
          '2*Cti': 2*Cti,
          '2*Cti-1': (2*Cti-1),
          Pi,
          // road_total,
          road_prob: roads_prob[road],
        };
      }
    }

    this.Probabilities.push(roads_prob);

    return {roads_prob, adaptability_debugger_props};

  }

  render() {
    if (this.state.loading) return <></>;

    let button_label, button_class_name, message_id = null, message_position, callback, message_more_info;
    if (this.state.show_start_msg){
      button_label = this.start_msg.button_label;
      button_class_name = this.start_msg.button_class_name;
      message_id = this.start_msg.message_id;
      message_position = this.start_msg.message_position;
      callback = this.startPlay;
    }
    else if (this.state.delivery_message_id){
      button_label = this.state.delivery_button_label;
      message_id = this.state.delivery_message_id;
      message_position = this.state.delivery_message_position;
      message_more_info = this.state.delivery_message_more_info;
      callback = this.msgCallback;
    }

    return (
      <div>
        <QueenGardenGameLoading loading={this.state.game_loading}/>
        {!this.state.game_loading && message_id && (
          <QueenGardenMessages
            button_label={button_label}
            button_class_name={button_class_name}
            message_id={message_id}
            message_more_info={message_more_info}
            message_position={message_position  || 'left'}
            Forward={callback}
          />
        )}

        {!this.state.game_loading && (
          <QueenGameBoard
            gameState={{
              wagon_place: this.state.wagon_place,
              flowers: this.state.flowers,
              hide_flower: this.state.hide_flower,
              flower_on_wagon: this.state.flower_on_wagon,
              disable_castle_click: this.state.disable_castle_click,
              disable_road_click: this.state.disable_road_click,
              with_flower: this.state.with_flower,
            }}
            changeWagonPlace={this.changeWagonPlace}
          />
        )}

        {!this.state.game_loading && this.context.DebugMode && (
          <QueenGardenGameDebug
            debugger_props={this.state.debugger_props}
            current_trial={this.state.trial}
            game_mode={true}
          />
        )}
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
