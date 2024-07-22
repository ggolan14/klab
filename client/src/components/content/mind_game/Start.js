import React, { useState } from 'react';
import './App.css'; // Import the CSS file
import IntroductionScreen_1 from './IntroductionScreen_1';
import IntroductionScreen_2 from './IntroductionScreen_2';
import PracticeRound from './PracticeRound';
import RealGameRound from './RealGameRound';
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
const ThisExperiment = 'MindGame';

let UserId = 'empty';
let RunningName = '-';

const Start = (props) => {
  let RunCounter = KeyTableID();
  console.log("--------> MindGame RunCounter="+RunCounter)
  let cond = props.game_settings.game.cond;
  console.log("------------> Mind cond = "+cond)
  //this.props=props;
  const [step, setStep] = useState(1); // Track current step of the game

  const handleNext = () => {
    const db_row = {
      RoundNumber: step,  // total 
      Step: step,
    };
    console.log("111")
    //insertGameLine(db_row);
    console.log("222")
    setStep(step + 1);
    if(step==10){
    //  sendDataToDB();
    }
  };

  const insertGameLine = (db_row) => {
    console.log("333")
   // this.props.insertGameLine(db_row);
    console.log("444")
  }
  /*
  const sendDataToDB = () => {
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
        //if (send) {
         // var result = this.addGameBonus();
          var total_bonus = 789;
          //var randomSelectedQuestion = result.randomSelectedQuestion;

          this.PaymentsSettings.total_bonus = total_bonus;
          

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
       // }

      }
    );

  }
    */
  
  return (
    

    <div>
      <DebuggerModalView>
            
              <p>Game mode:Mind game </p>
              <p>Game mode:Mind game </p>

       </DebuggerModalView>
      {step === 1 && <IntroductionScreen_1 onNext={handleNext} />}
      {step === 2 && <IntroductionScreen_2 onNext={handleNext} />}
      {step >= 3 && step <= 5 && <PracticeRound onNext={handleNext} />}
      {/* Render PracticeRound three times */}
      {step >= 6 && step <= 9 && <RealGameRound onNext={handleNext} />}
      {/* Render RealGameRound four times */}
      {step === 10 && <p className="dice-roll-container">Game completed</p>}
    </div>
  );
};

export default Start;
