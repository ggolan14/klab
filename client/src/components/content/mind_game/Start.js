//in this code i would like that the yes and no buttons will be one next to each other and not one above each other.  currently the buttons are one above each other.  i guess it is related to the "trivia-container" class .  the only css file that is imported is './gameStyles.css'   but in this file there is no trivia-container class.  how can i fix it?   these are my Start and component and gameStyles.css  
import React, { Component } from 'react';
import './gameStyles.css';
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
import MindGameIntroduction from './MindGameIntroduction';
import FoodPreference from './FoodPreference';
import { formatPrice } from '../../utils/StringUtils';
import GameRound from './GameRound';
import ResourceAllocation from './ResourceAllocation';

const ThisExperiment = 'MindGame';
const STATIC_TRANSFORM = "rotateX(45deg) rotateY(-45deg)";


let UserId = 'empty';
let RunningName = '-';
let GameCondition = null;
let NUM_OF_REPEATED_REAL_ROUNDS = 0;
let NUM_OF_PRACTICE_ROUNDS = 3;
let NUM_OF_INTRODUCTION_STEPS = 3;
let lastIndex;
let startTimer=0;
let endTimer=0;
let totalTimer=0;
let SignOfReward = '$';
let isStatic = true;
let transform;
let extended_name;
const yesButtonInRight = Math.random() < 0.5;


class Start extends Component {
  constructor(props) {
    super(props);
    this.TotalBonus = [];
    let RunCounter = KeyTableID();

    //let cond = props.game_settings.game.cond;
    this.Forward = this.Forward.bind(this);
    this.PaymentsSettings = props.game_settings.payments;
    NUM_OF_REPEATED_REAL_ROUNDS = 40;
    SignOfReward = props.game_settings.payments.sign_of_reward;

    this.extended_name = props.game_settings.game.extended_name;
    console.log("---> extended_name="+extended_name) ;
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
      if (RunCounter % 2) {
        GameCondition = 'OneShot';
      }
      else {
        GameCondition = 'Repeated';
      }
    }
    lastIndex = GameCondition == 'OneShot' ? NUM_OF_PRACTICE_ROUNDS + NUM_OF_INTRODUCTION_STEPS + 1 : NUM_OF_PRACTICE_ROUNDS + NUM_OF_INTRODUCTION_STEPS + NUM_OF_REPEATED_REAL_ROUNDS
    console.log("------------------> Exp= "+ThisExperiment+"-"+GameCondition+"  lastIndex="+lastIndex)

    this.state = {
      currentRoundIndex: 0,
      showConfirmation: false,
      correctAnswer: null,
      showResult: false,
      showDice: false,
      yesClickCount: 0,
      noClickCount: 0,
      practiceMode: true,
      isLast: false,
      gameCondition: GameCondition,
      hideMessages: false,
      practiceIsOver: false,
      hideMindGameCompleted: false,
      showWelcomeToNextTask: false,
      userAnswers: {},
      diceOutcome: 0,
      diceClass: '',
      diceTransform: '',
      random: 1,
      renderKey: 0, // State to trigger re-rendering
      showButton: true,
      newRound: false,
      diceOutcome: '' 
    };
  }

  addRecord = (roundIndex, value) => {
    const { userAnswers } = this.state;
    this.setState(prevState => ({
      userAnswers: {
        ...prevState.userAnswers,
        [roundIndex]: value
      }
    }));
  };

  handleHideMessages = () => {
    this.setState({ hideMessages: true });  // set hideMessages to true (i.e. don't render introduction messages)
  }

  handelHideMindGameCompleted = () => {
    this.setState({ hideMindGameCompleted: true, showWelcomeToNextTask: true });
  }

  handelHideWelcomeToNextTask = () => {
    this.setState({ showWelcomeToNextTask: false });
  }

  handleHidePracticeIsOver = () => {
    this.setState({ practiceIsOver: true });
  }

  handleNext = () => {
    const { currentRoundIndex } = this.state;
    let questions = [];
    this.setState(prevState => ({
      currentRoundIndex: Math.min(prevState.currentRoundIndex + 1, lastIndex),
      showDice: false,
      showConfirmation: true,
      newRound: true,
    }));
  };


  handleConfirmation = (confirmed) => {
    const { currentRoundIndex, showConfirmation, showDice, gameCondition, hideMessages } = this.state;
    isStatic = true;
    endTimer=getTimeDate().now;
    totalTimer = endTimer - startTimer;
    console.log("===> in handleConfirmation totalTimer=" + totalTimer);

    if (currentRoundIndex + 1 == lastIndex) {
      this.setState(prevState => (
        {
          isLast: true,
          showConfirmation: false,
          showDice: false,
          showButton: true,
        }), () => {

        });
    }

    if (confirmed) {
      this.setState(prevState => (
        {
          showResult: false,
          newRound: true,
          showButton: true,
          yesClickCount: prevState.yesClickCount + 1,
          showDice: false,
          showConfirmation: false,
        }), () => {
          const db_row = {
            RoundIndex: currentRoundIndex,  // total 
            RoundType: currentRoundIndex <= NUM_OF_PRACTICE_ROUNDS ? "Practice" : "Mind",
            Answer: 1,
            TotalYesAnswers: this.state.yesClickCount,
            TotalNoAnswers: this.state.noClickCount,
            GameCondition: GameCondition,
            IsThisTheNumberConfirmationTime: totalTimer,
            Game: !this.extended_name ? "MindGame" : this.extended_name,
          };


          this.addRecord(currentRoundIndex, confirmed ? 'Yes' : 'No');
          this.insertGameLine(db_row);
          this.sendDataToDB(false);


        });
    } else {
      this.setState(prevState => ({
        showResult: false,
        newRound: true,
        showButton: true,
        noClickCount: prevState.noClickCount + 1,
        showDice: false,
        showConfirmation: false,
      }), () => {
        const db_row = {
          RoundIndex: currentRoundIndex,
          RoundType: currentRoundIndex <= NUM_OF_PRACTICE_ROUNDS ? "Practice" : "Mind",
          Answer: 0,
          TotalYesAnswers: this.state.yesClickCount,
          TotalNoAnswers: this.state.noClickCount,
          GameCondition: GameCondition,
          IsThisTheNumberConfirmationTime: totalTimer,
          Game: !this.extended_name ? "MindGame" : this.extended_name,

        };
        this.addRecord(currentRoundIndex, confirmed ? 'Yes' : 'No');
        this.insertGameLine(db_row);
        this.sendDataToDB(false);
      });
    }


  }

  insertGameLine = (db_row) => {
    this.props.insertGameLine(db_row);
  }

  Forward(finish_game, game_data) {
    console.log("---> In Forward")
  }

  sendDataToDB = (send) => {
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
            game_points: "N/A",
            local_t: current_time.time,
            local_d: current_time.date,
          },
        }).then((res) => { });
        if (send) {
          var result = this.addGameBonus();
          var total_bonus = result.selectedRoundPoints;
          var randomSelectedRound = result.randomSelectedRound;
          console.log("---> in sendDataToDB total_bonus="+total_bonus+"   randomSelectedRound="+randomSelectedRound)

          this.PaymentsSettings.total_bonus = total_bonus;
          this.PaymentsSettings.randomSelectedRound = randomSelectedRound;

          this.props.insertPayment({
            exchange_ratio: this.PaymentsSettings.exchange_ratio,
            bonus_endowment: this.PaymentsSettings.bonus_endowment,
            show_up_fee: this.PaymentsSettings.show_up_fee,
            sign_of_reward: this.PaymentsSettings.sign_of_reward,
            random_round_Index: this.PaymentsSettings.randomSelectedRound,
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
    var total_bonus = this.TotalBonus.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    var exchange_ratio = this.PaymentsSettings.exchange_ratio;
    total_bonus = total_bonus / exchange_ratio;
    total_bonus = (Math.round(total_bonus * 100) / 100).toFixed(2);
    console.log("---> in calculateBonus()  total_bonus=" + total_bonus + "  exchange_ratio=" + exchange_ratio)
    return total_bonus;
  }

  addGameBonus = (game_data) => {
    const { userAnswers } = this.state;
    const keys = Object.keys(userAnswers);
    keys.forEach(key => { console.log(`keys Key: ${key}, Value: ${userAnswers[key]}`); });

    const randomIndex = GameCondition === "OneShot" ? 4 : Math.floor(Math.random() * (NUM_OF_REPEATED_REAL_ROUNDS + 1)) + 4;
    console.log("--->  in addGameBonus()   randomIndex="+randomIndex+"   ")
    const randomSelectedRound = keys[randomIndex - 1];
    const randomSelectedRoundValue = userAnswers[randomSelectedRound];
    const selectedRoundPoints = randomSelectedRoundValue === 'Yes' ? 1 : 0;
    const TotalBonus = [];
    TotalBonus.push(selectedRoundPoints);
    console.log("---> in addGameBonus() selectedRoundPoints="+selectedRoundPoints+"   randomSelectedRound="+randomSelectedRound)

    return {
      selectedRoundPoints: selectedRoundPoints,
      randomSelectedRound: randomSelectedRound
    };
  };


  getRandomDiceValue = () => {
    let tmpRand = Math.floor(Math.random() * 6) + 1;
    return tmpRand;
  };

  randomDice = () => {
    isStatic = false;
    this.random = isStatic ? -1 : this.getRandomDiceValue();
    this.rollDice(this.random);
    };

  rollDice = (random) => {
    console.log("===> in roll dice random=" + random);
    startTimer=getTimeDate().now;
    setTimeout(() => {
      switch (random) {
        case -1: // in case of -1 display static dice
          transform = 'rotateX(0deg) rotateY(-45deg)';
          break;
        case 1:
          transform = 'rotateX(0deg) rotateY(0deg)';
          break;
        case 6:
          transform = 'rotateX(180deg) rotateY(0deg)';
          break;
        case 2:
          transform = 'rotateX(-90deg) rotateY(0deg)';
          break;
        case 5:
          transform = 'rotateX(90deg) rotateY(0deg)';
          break;
        case 3:
          transform = 'rotateX(0deg) rotateY(90deg)';
          break;
        case 4:
          transform = 'rotateX(0deg) rotateY(-90deg)';
          break;
        case 7:
          transform = 'rotateX(0deg) rotateY(-45deg)';
          break;
        default:
          break;
      }
      this.setState({
        diceTransform: transform,
        diceClass: '',
        showButton: false, // Hide the button after the dice roll
        diceOutcome: random, // Set the text to "Done"
        showConfirmation: true,
      });
    }, 50);
  };



  render() {
    const { currentRoundIndex, showConfirmation, correctAnswer, hideMindGameCompleted, showWelcomeToNextTask,
      showDice, yesClickCount, noClickCount, practiceMode, gameCondition,
      hideMessages, practiceIsOver, showButton, diceOutcome, diceClass, diceTransform, newRound } = this.state;
    console.log("111 ---> transform=" + transform + "   isStatic=" + isStatic + "  showConfirmation=" + showConfirmation + "  currentRoundIndex=" + currentRoundIndex + "   newRound=" + newRound + "  showButton=" + showButton)
    console.log("222 ---> currentRoundIndex=" + currentRoundIndex + "  hideMessages=" + hideMessages + "  showDice=" + showDice + "  showConfirmation=" + showConfirmation + "   NUM_OF_PRACTICE_ROUNDS=" + NUM_OF_PRACTICE_ROUNDS + "  showButton=" + showButton + "  newRound=" + newRound)
    if (!hideMessages) {
      return (
        <MindGameIntroduction signOfReward={SignOfReward} onHideMessages={this.handleHideMessages} messageIndex={currentRoundIndex} props/>
      )
    }

    // Declare a variable to hold the JSX for FoodPreference
    let foodPreferenceComponent = null;
    const oneShotLast = GameCondition == "OneShot" && !showConfirmation && currentRoundIndex == NUM_OF_PRACTICE_ROUNDS + 1;
    const repeatedLast = GameCondition == "Repeated" && !showConfirmation && (currentRoundIndex == NUM_OF_PRACTICE_ROUNDS + NUM_OF_REPEATED_REAL_ROUNDS);
    console.log("---------> oneShotLast=" + oneShotLast + "    repeatedLast=" + repeatedLast + "  hideMindGameCompleted=" + hideMindGameCompleted + "   lastIndex=" + lastIndex + "  NUM_OF_PRACTICE_ROUNDS=" + NUM_OF_PRACTICE_ROUNDS + "   NUM_OF_REPEATED_REAL_ROUNDS=" + NUM_OF_REPEATED_REAL_ROUNDS)

    if ((oneShotLast || repeatedLast) && (currentRoundIndex != NUM_OF_PRACTICE_ROUNDS)) {
      if (!hideMindGameCompleted && GameCondition == "Repeated") {
        return (
          <div className="practice-is-over">
            <h3>You completed the "mind-game”</h3>
            <p>
              You will now receive a food preference survey. <br></br>
              Note that you cannot leave or stop responding until you have completed the entire study and <br></br>
              have received your completion code, or else you will not receive compensation.
            </p>
            <button onClick={this.handelHideMindGameCompleted}>Next</button>
          </div>
        )

      }
      else if (!hideMindGameCompleted && GameCondition == "OneShot") {
        return (
          <div className="practice-is-over">
            <h3>You completed the "mind-game”</h3>
            <p>
              You will now fill out a short resource allocation survey. 
              Note that you cannot leave or stop responding until you have completed the entire study and have received your completion code, or else you will not receive compensation.
            </p>
            <button onClick={this.handelHideMindGameCompleted}>Next</button>
          </div>
        )

      }
      if (showWelcomeToNextTask && GameCondition == "OneShot") {
        return (
          <div className="trivia-container">
            <h3><b>Welcome to the resource allocation survey</b></h3>
            <p>
              <br></br>
              <br></br>
            Please read the scenario and answer the following questions
            </p>
            <button onClick={this.handelHideWelcomeToNextTask}>Next</button>
          </div>
        )
      }
      if (showWelcomeToNextTask && GameCondition == "Repeated") {
        return (
          <div className="practice-is-over">
            <h3>Welcome to the food preference survey</h3>
            <p>
              In this survey, we are interested in people’s food preferences. You will be asked one question about your food preferences.<br />Please answer the question according to your actual preferences.
            </p>
            <button onClick={this.handelHideWelcomeToNextTask}>Next</button>
          </div>
        )
      }

      if(GameCondition == "Repeated"){
        return <FoodPreference GameCondition={GameCondition} insertGameLine={this.insertGameLine} sendDataToDB={this.sendDataToDB} /> 
      }else if(GameCondition == "OneShot")
      return <ResourceAllocation GameCondition={GameCondition} insertLine={this.insertGameLine} sendDataToDB={this.sendDataToDB} />

    }

    if (GameCondition == "OneShot" && currentRoundIndex === NUM_OF_PRACTICE_ROUNDS && !practiceIsOver && !showConfirmation) {
      return (
        <div className="practice-is-over">
          <h3>Practice is Over</h3>
          <p>
            You will now play the mind-game for real bonus.<br></br>
            You will play one round of the mind game.<br></br>
            Remember: if the number you roll is the one you had in mind, <span style={{ textDecoration: "underline" }}>you will receive a {formatPrice(1, SignOfReward)} bonus!</span>
          </p>
          <button onClick={this.handleHidePracticeIsOver}>Start real game</button>
        </div>
      )
    }
    if (GameCondition == "Repeated" && currentRoundIndex === NUM_OF_PRACTICE_ROUNDS && !practiceIsOver && !showConfirmation) {
      return (
        <div className="practice-is-over">
          <h3>Practice is Over</h3>
          <p>
            You will now play the mind-game for real bonus.<br></br>
            You will play 40 rounds of the mind game.<br></br>
            Remember: at the end of the study, one round will be randomly selected by the computer. If in that round the correct number is the one you had in mind, 
            <span style={{ textDecoration: "underline" }}>you will receive a {formatPrice(1, SignOfReward)} bonus!</span>
          </p>
          <button onClick={this.handleHidePracticeIsOver}>Start real game</button>
        </div>
      )
    }

    if (!showDice && !showConfirmation) {
      return (

        <div className="trivia-container">
          <DebuggerModalView>
            <p>Current Question Index: {currentRoundIndex + 1}</p>
            <p>Game mode: {gameCondition}</p>
            <p>Is in practice: {practiceMode == true ? "Yes" : "No"}</p>
            <p>Num of YES clicks: {yesClickCount}</p>
            <p>Num of NO clicks: {noClickCount}</p>
          </DebuggerModalView>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            {currentRoundIndex < (NUM_OF_PRACTICE_ROUNDS) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>}
            <p>Think of one of the following numbers:<br /><b>1,2,3,4,5,6<br/>keep this number in your mind.</b></p>
            <p>

              <button onClick={this.handleNext}>Next</button>
            </p>

          </div>
        </div>
      )
    }
    if (newRound) {
      
      let tmpDiceTransform = !isStatic ? diceTransform : STATIC_TRANSFORM
      return (
        <div className="wrapper">
          <div className="container">
          <br></br>
          {isStatic && (
                    <>
                        <br />
                        {currentRoundIndex <= NUM_OF_PRACTICE_ROUNDS && (
                            <span style={{ fontWeight: 'bold', color: 'red' }}>
                                This is a practice round
                            </span>
                        )}
                        <br/>
                    </>
                )}
          <br></br>
          <br></br>
          <div className={`dice ${diceClass}`} style={{ transform: tmpDiceTransform  }} key={0}>
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
            <div className="face right"></div>
            <div className="face left"></div>
          </div>
          {showButton ? (
            <div>
              <button className="roll" onClick={() => this.randomDice(isStatic)}>
                <h2>Roll the die</h2>
              </button>
            </div>
          ) : (
            <div className="container">
              {showConfirmation && (
                <>
                  {currentRoundIndex <= (NUM_OF_PRACTICE_ROUNDS) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>}
                  <p>Is this the number that you had in mind?</p>

                  <div className="button-container">
                    {yesButtonInRight ? (
                      <>
                        <button onClick={() => this.handleConfirmation(false)}>No</button>
                        <button onClick={() => this.handleConfirmation(true)}>Yes</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => this.handleConfirmation(true)}>Yes</button>
                        <button onClick={() => this.handleConfirmation(false)}>No</button>
                      </>
                    )}
                  </div>

                  {GameCondition == "OneShot" ?
                    (<>
                      <p>Note: You will receive a {formatPrice(1,SignOfReward)} bonus only if you report "Yes"</p>
                    </>
                    ) : (
                      <>
                        <p>Note: If this round will be selected, you will receive a {formatPrice(1,SignOfReward)} bonus only if you report "Yes"</p>
                      </>
                    )}
                </>
              )}
            </div>
          )}
        </div>
        </div>
      )


    }
   
    console.log("---> currentRoundIndex=" + currentRoundIndex + "  hideMessages=" + hideMessages + "  showDice=" + showDice + "  showConfirmation=" + showConfirmation + "   NUM_OF_PRACTICE_ROUNDS=" + NUM_OF_PRACTICE_ROUNDS + "  showButton=" + showButton + "  newRound=" + newRound)
    return (

      <div className="container">
        {foodPreferenceComponent}

        {!hideMessages ? (
          <MindGameIntroduction onHideMessages={this.handleHideMessages}/>
        ) : (
          <div>
            <DebuggerModalView>
              <p>Current Question Index: {currentRoundIndex + 1}</p>
              <p>Game mode: {gameCondition}</p>
              <p>Is in practice: {practiceMode == true ? "Yes" : "No"}</p>
              <p>Num of YES clicks: {yesClickCount}</p>
              <p>Num of NO clicks: {noClickCount}</p>
            </DebuggerModalView>

            {(showDice && !showConfirmation) ? (
              <div>
                {currentRoundIndex < (NUM_OF_PRACTICE_ROUNDS) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>}
                <p>Think of one of the following numbers:<br />1,2,3,4,5,6<br />keep this number in your mind.</p>
                <p>

                  <button onClick={this.handleNext}>Next</button>
                </p>

              </div>
            ) : (
              <div>
                {showConfirmation && (
                  <>
                    {currentRoundIndex <= (NUM_OF_PRACTICE_ROUNDS) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>}


                    {yesButtonInRight ?
                      (<>
                        <button onClick={() => this.handleConfirmation(false)}>No</button>
                        <button onClick={() => this.handleConfirmation(true)}>Yes</button>
                      </>
                      ) : (
                        <>
                          <button onClick={() => this.handleConfirmation(true)}>Yes</button>
                          <button onClick={() => this.handleConfirmation(false)}>No</button>
                        </>
                      )}

                    {GameCondition == "OneShot" ?
                      (<>
                        <p>Note: You will receive a {formatPrice(1,SignOfReward)} bonus only if you report "Yes"</p>
                      </>
                      ) : (
                        <>
                          <p>Note: If this round will be selected, you will receive a {formatPrice(1,SignOfReward)} bonus only if you report "Yes"</p>
                        </>
                      )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }


}

export default Start;
