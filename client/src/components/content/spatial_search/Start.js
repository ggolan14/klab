import React, { Component } from 'react';
import './gameStyles.css';
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
//import TriviaIntroduction from './TriviaIntroduction';
//import { formatPrice } from '../../utils/StringUtils';
//import MathQuestion from '../../../common/MathQuestion';
import GameStage from './GameStage';
const ThisExperiment = 'SpatialSearch';


let UserId = 'empty';
let RunningName = '-';
let SignOfReward = "$";
let GameCondition = null;
let lastIndex;
let trialDuration = 120000;

class Start extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.TotalBonus = [];
    let RunCounter = KeyTableID();
    this.extended_name = props.game_settings.game.extended_name;
    let cond = props.game_settings.game.cond;
    let trialDuration = props.game_settings.game.trial_duration;
    this.Forward = this.Forward.bind(this);
    this.PaymentsSettings = props.game_settings.payments;
    SignOfReward = props.game_settings.payments.sign_of_reward;

    if (cond === 'c') {
      GameCondition = 'Clustered';
    }
    else if (cond === 'd') {
      GameCondition = 'Diffuse';
    }
    else if (cond === 'rand') {
      // GameCondition = 'Random';
      let rnd = Math.floor(Math.random() * 2);
      if (rnd)
        GameCondition = 'Clustered';
      else
        GameCondition = 'Diffuse';
    }
    else if (cond === 'u_d') {
      // GameCondition = 'Uniform distribution';
      if (RunCounter % 2)
        GameCondition = 'Clustered';
      else
        GameCondition = 'Diffuse';
    }

    //set lastIndex according to GameCondition . 

    console.log("------------------> Exp= " + ThisExperiment + "-" + GameCondition + "  lastIndex=" + lastIndex)

    this.state = {
     // foundResources :0
    };
  }
  /*
  setNumOfFoundResources = (num_of_found_resources) => {
    this.setState({ foundResources: num_of_found_resources });
  };
  */
  // Method to handle the result from the MathQuestion component
  handleMathQuestionAnswer = (isCorrect) => {
    if (isCorrect) {
      this.setState({ mathAnsweredCorrectly: true, showError: false });
    } else {
      this.setState({ showError: true });
    }
  };

  componentDidMount() {
    NewLogs({
      user_id: this.UserId,
      exp: ThisExperiment,
      running_name: this.RunningName,
      action: 'G.L',
      type: 'LogGameType',
      more_params: {
        local_t: getTimeDate().time,
        local_d: getTimeDate().date,
      },
    }).then((res) => {
      this.START_APP_MIL = Date.now();
      this.props.SetLimitedTime(true);
      this.setState({ isLoading: false });
    });
  }



  insertGameLine = (db_row) => {
    this.props.insertGameLine(db_row);
  }

  Forward(finish_game, game_data) {
  
    
  }

  sendDataToDB = (withSummary,totalFoundCoins) => {
    console.log("---> in Start  sendDataToDB withSummary="+withSummary+"  totalFoundCoins="+totalFoundCoins)
    const current_time = getTimeDate();
    var reward_sum = 0;
    var temp_sign_of_reward = this.PaymentsSettings.sign_of_reward
    let debug_args = {
      reward_sum,
      temp_sign_of_reward,
    }
    this.props.sendGameDataToDB().then(
      res => {
        NewLogs({
          user_id: UserId,
          exp: ThisExperiment,
          running_name: RunningName,
          action: 'G.E.S',
          type: 'LogGameType',
          more_params: {
            game_points: "TBD",
            local_t: current_time.time,
            local_d: current_time.date,
          },
        }).then((res) => { });
        if (withSummary) {
          var result = this.addGameBonus();
          var total_bonus = totalFoundCoins//result.selectedQuestionPoints;
          

          this.PaymentsSettings.total_bonus = total_bonus;
          //this.PaymentsSettings.randomSelectedQuestion = randomSelectedQuestion;

          this.props.insertPayment({
            exchange_ratio: this.PaymentsSettings.exchange_ratio,
            bonus_endowment: this.PaymentsSettings.bonus_endowment,
            show_up_fee: this.PaymentsSettings.show_up_fee,
            sign_of_reward: this.PaymentsSettings.sign_of_reward,
            random_question_Index: this.PaymentsSettings.randomSelectedQuestion,
            bonus_payment: this.PaymentsSettings.total_bonus,
            Time: current_time.time,
            Date: current_time.date
          });



          debug_args.reward_sum = total_bonus;
          debug_args.sign_of_reward = temp_sign_of_reward;
          this.props.callbackFunction('FinishGame', { need_summary: true, args: debug_args });
        }

      }
    );


  }

  calculateBonus() {
    let total_bonus = 5555
    return total_bonus;
  }

  addGameBonus(game_data) {

    return {
     //  selectedQuestionPoints: 123,
     //  randomSelectedQuestion: randomSelectedQuestion
    };
  }


  render() {
    return (

      <div>
        <GameStage GameCondition={GameCondition} trialDuration={trialDuration}  gameSettings={this.props.game_settings} insertGameLine={this.insertGameLine} sendDataToDB={this.sendDataToDB}  />
      </div>
    );
  }


}

export default Start;
