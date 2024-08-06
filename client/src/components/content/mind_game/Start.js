import React, { useState } from 'react';
import './App.css'; // Import the CSS file
import IntroductionScreen_1 from './IntroductionScreen_1';
import IntroductionScreen_2 from './IntroductionScreen_2';
import GameRound from './GameRound';
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
import { DebuggerWindows } from '../../screens/gameHandle/game_handle';
const ThisExperiment = 'MindGame';

let answers={};

let UserId = 'empty';
let RunningName = '-';
let PaymentsSettings;
let GameCondition = null;
let numOfRounds = 1;
let TotalBonus = [];
let NUM_OF_REPEATED_REAL_ROUNDS = 0;
let NUM_OF_PRACTICE_ROUNDS=3;
let NUM_OF_INTRODUCTION_STEPS=3;
let finish_step=0;
let DebugMode = null;

const Start = (props) => {
  let RunCounter = KeyTableID();
  DebugMode = props.dmr;
  PaymentsSettings = props.game_settings.payments;
  NUM_OF_REPEATED_REAL_ROUNDS = props.game_settings.game.num_of_real_rounds;
  let cond = props.game_settings.game.cond;

  if (cond === 'o') {
    GameCondition = 'OneShot';
  }
  else if (cond === 'r') {
    GameCondition = 'Repeated';
  }
  else if (cond === 'rand') {
    // GameCondition = 'Random';
    let rnd = Math.floor(Math.random() * 2);
    if (rnd)
      GameCondition = 'OneShot';
    else
      GameCondition = 'Repeated';
  }
  else if (cond === 'u_d') {
    // GameCondition = 'Uniform distribution';
    if (RunCounter % 2){
      GameCondition = 'OneShot';
    }
    else
    {
      GameCondition = 'Repeated';
    }
  }
  finish_step = GameCondition=='OneShot' ? NUM_OF_PRACTICE_ROUNDS+NUM_OF_INTRODUCTION_STEPS+1 : NUM_OF_PRACTICE_ROUNDS+NUM_OF_INTRODUCTION_STEPS+NUM_OF_REPEATED_REAL_ROUNDS
  
  const [step, setStep] = useState(1); // Track current step of the game
  const [userAnswers, setUserAnswers] = useState({}); // Track current step of the game
  const [hidePracticeIsOver, sethidePracticeIsOver] = useState(false); // Track current step of the game
  
  const handleNext = (dieOutcom) => {
    console.log("---> in Start.handleNext() step="+step+"   dieOutcom = "+dieOutcom)
    const db_row = {
      RoundNumber: (step>2 && step<6) ? 0 : (step-2),  // total 
      Answer: answers[step],
      Game: "MindGame",
      Condition: GameCondition,
      DieOutcome: dieOutcom,
    };
    if(step>2){
      insertGameLine(db_row);
      if((GameCondition=='OneShot' && step==finish_step-1)|| (GameCondition=='Repeated' && step==finish_step-1))
        sendDataToDB(true);
    }
    if(step==6){
      sethidePracticeIsOver(true)
    }else{
      sethidePracticeIsOver(false)
    }
    setStep(step + 1);
   // if(step==10){
    
   // }
  };

  const addRecord = (userAnswer) => {
    console.log("---> BEFORE in addRecord    userAnswer=" + userAnswer + "  userAnswers.size=" + Object.keys(userAnswers).length);
    setUserAnswers(prevState => {
      const newUserAnswers = {
        ...prevState,
        [step]: userAnswer
      };
      answers=newUserAnswers;
      // console.log("---> AFTER in addRecord    userAnswers.size=" + Object.keys(newUserAnswers).length);
      return newUserAnswers;
    });
  };

  const insertGameLine = (db_row) => {
    props.insertGameLine(db_row);
  }

  const addGameBonus = (game_data) => {
    const keys = Object.keys(answers);
    keys.forEach(key => { console.log(`keys Key: ${key}, Value: ${answers[key]}`); });

    const randomIndex = GameCondition === "OneShot" ? 4 : Math.floor(Math.random() * (NUM_OF_REPEATED_REAL_ROUNDS + 1)) + 3;
    const randomSelectedRound = keys[randomIndex - 1];
    const randomSelectedRoundValue = answers[randomSelectedRound];
    const selectedRoundPoints = randomSelectedRoundValue === 'Yes' ? 1 : 0;
    // console.log("-------------> in addGameBonus randomSelectedRound=" + randomSelectedRound + "   selectedRoundPoints=" + selectedRoundPoints);
    // Example TotalBonus array, make sure it is defined in your component
    const TotalBonus = [];
    TotalBonus.push(selectedRoundPoints);

    return {
      selectedRoundPoints: selectedRoundPoints,
      randomSelectedRound: randomSelectedRound
    };



  };

  const sendDataToDB = (send) => {
    // console.log("---> 111")
    const current_time = getTimeDate();
    var reward_sum = 0;
    var temp_sign_of_reward = props.game_settings.payments.sign_of_reward;
    let debug_args = {
      reward_sum,
      temp_sign_of_reward,
    }
    
    props.sendGameDataToDB().then(
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
        if (send) {
          var result = addGameBonus();
          var total_bonus = result.selectedRoundPoints;;
          var randomSelectedRound = result.randomSelectedRound;

          PaymentsSettings.total_bonus = total_bonus;
          PaymentsSettings.randomSelectedRound = (randomSelectedRound - 3);
          props.insertPayment({
            exchange_ratio: PaymentsSettings.exchange_ratio,
            bonus_endowment: PaymentsSettings.bonus_endowment,
            show_up_fee: PaymentsSettings.show_up_fee,
            sign_of_reward: PaymentsSettings.sign_of_reward,
            random_round_Index: PaymentsSettings.randomSelectedRound,
            bonus_payment: PaymentsSettings.total_bonus,
            game_condition: GameCondition,
            Time: current_time.time,
            Date: current_time.date
          });
          debug_args.reward_sum = total_bonus;
          debug_args.sign_of_reward = temp_sign_of_reward;
          props.callbackFunction('FinishGame', { need_summary: true, args: debug_args });
        }

      }
    );


  }

  const handleHide = () => {
   
   sethidePracticeIsOver(true)
  }
      
  

  if (step==6 && !hidePracticeIsOver) {
    return <div className="introduction">
      <label>Practice is Over</label>
      <br></br>
      <label>You will now play the mind-game for real bonus.</label>
      <br></br>
      <label>You will play {GameCondition == 'OneShot' ? "one":NUM_OF_REPEATED_REAL_ROUNDS} {GameCondition == 'OneShot' ? "round":"rounds"} of the mind game.</label>
      <br></br>
      <label>Remember: if the number you roll is the one you had in mind you will recieve a {PaymentsSettings.sign_of_reward}1 bonus!</label>
      <br></br>
      <button onClick={handleHide}>Next</button>
    </div>;
  }


  
  return (
    
    
    <div>
        {DebugMode && (
        <DebuggerWindows>
          <p>Game mode: Mind game</p>
          <p>Game condition: {GameCondition}</p>
          {step > 2 && (
            <p>Round: {step - 2}</p>
          )}
        </DebuggerWindows>
      )}
      {step === 1 && <IntroductionScreen_1 onNext={handleNext}/>}
      {step === 2 && <IntroductionScreen_2 onNext={handleNext} signOfReward={props.game_settings.payments.sign_of_reward}/>}
      {step >= 3 && step <= 5 && <GameRound isPractice={true} onAdd={addRecord} onNext={handleNext} signOfReward={props.game_settings.payments.sign_of_reward}/>}
      {/* Render PracticeRound three times */}
      {step >= 6 && step < finish_step && <GameRound isPractice={false} onAdd={addRecord} onNext={handleNext} signOfReward={props.game_settings.payments.sign_of_reward} />}
      {/* Render RealGameRound four times */}
      {(GameCondition === "OneShot" && step ===  finish_step) || (GameCondition === "Repeated" && step === finish_step) ? (
           <p className="dice-roll-container">Game completed</p>
      ) : null}
    </div>
  );
};

export default Start;
