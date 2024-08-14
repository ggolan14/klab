import React, { Component } from 'react';
import './gameStyles.css';
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
import MindGameIntroduction from './MindGameIntroduction';
import FoodPreference from './FoodPreference';
import GameRound from './GameRound';
const ThisExperiment = 'MindGame';



let UserId = 'empty';
let RunningName = '-';
let GameCondition = null;
let NUM_OF_REPEATED_REAL_ROUNDS = 0;
let NUM_OF_PRACTICE_ROUNDS=3;
let NUM_OF_INTRODUCTION_STEPS=3;
let lastIndex;
let startShowRoundTimer = 0;
let endShowRoundTimer = 0;
let startShowConfirmationTimer = 0;
let endShowConfirmationTimer = 0;
let totalShowRoundTime = 0;
let totalShowConfirmationTime = 0;
let result=0;
const yesButtonInRight = Math.random() < 0.5;


class Start extends Component {
  constructor(props) {
    super(props);
    this.TotalBonus = [];
    let RunCounter = KeyTableID();
    //let cond = props.game_settings.game.cond;
    this.Forward = this.Forward.bind(this);
    this.PaymentsSettings = props.game_settings.payments;
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
    lastIndex = GameCondition=='OneShot' ? NUM_OF_PRACTICE_ROUNDS+NUM_OF_INTRODUCTION_STEPS+1 : NUM_OF_PRACTICE_ROUNDS+NUM_OF_INTRODUCTION_STEPS+NUM_OF_REPEATED_REAL_ROUNDS


    this.state = {
      currentRoundIndex: 0,
      showConfirmation: false,
      correctAnswer: null,
      showResult: false,
      showDice: true,
      yesClickCount: 0,
      noClickCount: 0,
      practiceMode: true,
      isLast: false,
      gameCondition: GameCondition,
      hideMessages: false,
      practiceIsOver: false,
      hideMindGameCompleted: false,
      showWelcomeToFoodPreference: false,
      userAnswers: {},
      diceOutcome: 0,

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
    this.setState({ hideMessages: true });
  }

  handleShowConfirmation = (diceOutcome) => {
    console.log("-----------> in handle show confirmation diceOutcome="+diceOutcome)
    result = diceOutcome;
    this.setState({showConfirmation : true, diceOutcome})
	}

  handelHideMindGameCompleted = () => {
    this.setState({ hideMindGameCompleted: true, showWelcomeToFoodPreference: true });
  }

  handelHideWelcomeToFoodPreference = () => {
    this.setState({ showWelcomeToFoodPreference: false });
  }

  handleHidePracticeIsOver = () => {
    this.setState({ practiceIsOver: true });
  }

  handleNext = () => {
    const { currentRoundIndex } = this.state;
    let questions = [];
   // questions = trivia_questions;
   // const correctAnswer = questions[currentRoundIndex].answers.find(answer => answer.option === questions[currentRoundIndex].correct_answer).text;
    endShowRoundTimer = getTimeDate().now;
    startShowConfirmationTimer = getTimeDate().now;
    totalShowRoundTime = endShowRoundTimer - startShowRoundTimer;
    this.setState(prevState => ({
      currentRoundIndex: Math.min(prevState.currentRoundIndex + 1, lastIndex),
      showDice: false,
      showConfirmation: true,
    }));
  };


  handleConfirmation = (confirmed) => {
    const { currentRoundIndex, showConfirmation, showDice, gameCondition, hideMessages } = this.state;
    endShowConfirmationTimer = getTimeDate().now;
    totalShowConfirmationTime = endShowConfirmationTimer - startShowConfirmationTimer;

    if (currentRoundIndex + 1 == lastIndex) {
      endShowRoundTimer = getTimeDate().now;
      this.setState(prevState => (
        {
          isLast: true,
          showConfirmation: false,
          showDice: false,
        }), () => {

        });
    }

    if (confirmed) {
      startShowRoundTimer = getTimeDate().now;
        this.setState(prevState => (
        {
          showResult: false,
          yesClickCount: currentRoundIndex > (NUM_OF_PRACTICE_ROUNDS - 1) ? prevState.yesClickCount + 1 : prevState.yesClickCount,
          showDice: currentRoundIndex != lastIndex,
          showConfirmation: false,
        }), () => {
          const db_row = {
            RoundIndex: currentRoundIndex,  // total 
            RoundType: currentRoundIndex < NUM_OF_PRACTICE_ROUNDS ? "Practice" : "Mind",
            Answer: 1,
            TotalYesAnswers: this.state.yesClickCount,
            TotalNoAnswers: this.state.noClickCount,
            GameCondition: GameCondition,
            HaveAnAnswerTime: totalShowRoundTime,
            ConfirmationTime: totalShowConfirmationTime,
          };

          
          this.addRecord(currentRoundIndex, confirmed ? 'Yes' : 'No');
          this.insertGameLine(db_row);
          this.sendDataToDB(false);
         

        });
    } else {
      startShowRoundTimer = getTimeDate().now;
      this.setState(prevState => ({
        showResult: false,
        noClickCount: prevState.noClickCount + 1,
        showDice: currentRoundIndex != lastIndex,
        showConfirmation: false,
      }), () => {
        const db_row = {
          RoundIndex: currentRoundIndex,
          RoundType: currentRoundIndex < NUM_OF_PRACTICE_ROUNDS ? "Practice" : "Mind",
          Answer: 0,
          TotalYesAnswers: this.state.yesClickCount,
          TotalNoAnswers: this.state.noClickCount,
          GameCondition: GameCondition,
          HaveAnAnswerTime: totalShowRoundTime,
          ConfirmationTime: totalShowConfirmationTime,

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
            game_points: "TBD",
            local_t: current_time.time,
            local_d: current_time.date,
          },
        }).then((res) => { });
        if (send) {
          var result = this.addGameBonus();
          var total_bonus = result.selectedRoundPoints;
          var randomSelectedRound = result.randomSelectedRound;

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
   // const keys = Object.keys(answers);
   // keys.forEach(key => { console.log(`keys Key: ${key}, Value: ${answers[key]}`); });

    const randomIndex = GameCondition === "OneShot" ? 4 : Math.floor(Math.random() * (NUM_OF_REPEATED_REAL_ROUNDS + 1)) + 4;
    const randomSelectedRound = 2;
    const randomSelectedRoundValue = 999;
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

  render() {
    const { currentRoundIndex, showConfirmation, correctAnswer, hideMindGameCompleted, showWelcomeToFoodPreference,
      showDice, yesClickCount, noClickCount, practiceMode, gameCondition,
      hideMessages, practiceIsOver } = this.state;
      console.log("----> showConfirmation="+showConfirmation+"  currentRoundIndex="+currentRoundIndex)
    //let questions = trivia_questions;
    //const question = questions[currentRoundIndex];
    //const { answers } = question;

    // Declare a variable to hold the JSX for FoodPreference
    let foodPreferenceComponent = null;
    // Check if currentRoundIndex is equal to 3
    const oneShotLast = GameCondition == "OneShot" && !showConfirmation && currentRoundIndex == NUM_OF_PRACTICE_ROUNDS;
    const repeatedLast = GameCondition == "Repeated" && !showConfirmation && currentRoundIndex === NUM_OF_REPEATED_REAL_ROUNDS - 1;;
    if (oneShotLast || repeatedLast) {
      if (!hideMindGameCompleted) {
        return (
          <div className="practice-is-over">
            <h3>You completed the "Mind Game”</h3>
            <p>
              You will now receive a food preference survey. <br></br>
              Note that you cannot leave or stop responding until you have completed the entire study and <br></br>
              have received your completion code, or else you will not receive compensation.
            </p>
            <button onClick={this.handelHideMindGameCompleted}>Next</button>
          </div>
        )

      }
      if (showWelcomeToFoodPreference && GameCondition == "OneShot") {
        return (
          <div className="practice-is-over">
            <h3>Welcome to the food preference survey</h3>
            <p>
              In this survey, we are interested in people’s food preferences. You will
              be asked 40 questions about your food preferences. Please answer all
              40 questions according to your actual preferences.
            </p>
            <button onClick={this.handelHideWelcomeToFoodPreference}>Next</button>
          </div>
        )
      }
      if (showWelcomeToFoodPreference && GameCondition == "Repeated") {
        return (
          <div className="practice-is-over">
            <h3>Welcome to the food preference survey</h3>
            <p>
              In this survey, we are interested in people’s food preferences. You will be asked one question about your food preferences.<br />Please answer the question according to your actual preferences.
            </p>
            <button onClick={this.handelHideWelcomeToFoodPreference}>Next</button>
          </div>
        )
      }

      // If equal, assign FoodPreference JSX to the variable
      return <FoodPreference GameCondition={GameCondition} insertGameLine={this.insertGameLine} sendDataToDB={this.sendDataToDB} />

    }
    if (GameCondition == "OneShot" && currentRoundIndex === NUM_OF_PRACTICE_ROUNDS - 1 && !practiceIsOver && !showConfirmation) {
      return (
        <div className="practice-is-over">
          <h3>Practice is Over</h3>
          <p>
            You will now play the mind game for real bonus.<br></br>
            You will play one round of the mind game.<br></br>
            Remember: If the correct answer is the one you had in mind, you will receive a £1 bonus!
          </p>
          <button onClick={this.handleHidePracticeIsOver}>Next</button>
        </div>
      )
    }
    if (GameCondition == "Repeated" && currentRoundIndex === NUM_OF_PRACTICE_ROUNDS - 1 && !practiceIsOver && !showConfirmation) {
      return (
        <div className="practice-is-over">
          <h3>Practice is Over</h3>
          <p>
            You will now play the mind game for real bonus.<br></br>
            You will play 40 rounds of the mind game.<br></br>
            Remember: at the end of the study, one round will be randomly selected by the computer. If in that round the correct number is the one you had in mind, you will receive a £1 bonus!
          </p>
          <button onClick={this.handleHidePracticeIsOver}>Next</button>
        </div>
      )
    }

    return (
      <div className="trivia-container">
        {foodPreferenceComponent}

        {!hideMessages ? (
          <MindGameIntroduction onHideMessages={this.handleHideMessages} messageIndex={currentRoundIndex} />
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
                {currentRoundIndex < (NUM_OF_PRACTICE_ROUNDS - 1) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>}
                <p>Think of one of the following numbers:<br />1,2,3,4,5,6<br />keep this number in your mind</p>
                <p>
                <GameRound onShowConfirmation={(diceOutcome) => this.handleShowConfirmation(diceOutcome)}/>
                <button onClick={this.handleNext}>I have an answer in my mind</button>
                </p>
                              
              </div>
            ) : (
              <div>
                {showConfirmation && (
                  <>
                    {currentRoundIndex <= (NUM_OF_PRACTICE_ROUNDS - 1) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>}
                    <p>Dice Number is: {result}</p>
                    <p>Is this the number that you had in mind?</p>

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
                        <p>Note: You will receive a £1 bonus only if you report "Yes"</p>
                      </>
                      ) : (
                        <>
                          <p>Note: If this round will be selected, you will receive a £1 bonus only if you report "Yes"</p>
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
