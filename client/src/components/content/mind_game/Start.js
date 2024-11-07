import React, { Component } from 'react';
import './gameStyles.css';
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
import MindGameIntroduction from './MindGameIntroduction';
import FoodPreference from '../../../common/FoodPreference';
import { formatPrice } from '../../utils/StringUtils';
import GameRound from './GameRound';
import ResourceAllocation from './ResourceAllocation';
import MathQuestion from '../../../common/MathQuestion';


// Constants for experiment and static styles
const ThisExperiment = 'MindGame';
const STATIC_TRANSFORM = "rotateX(45deg) rotateY(-45deg)";

// Global variables for user and game settings
let UserId = 'empty';
let RunningName = '-';
let GameCondition = null;
let NUM_OF_REPEATED_REAL_ROUNDS = 0;
let NUM_OF_PRACTICE_ROUNDS = 3;
let NUM_OF_INTRODUCTION_STEPS = 3;
let lastIndex;
let startTimer = 0;
let endTimer = 0;
let totalTimer = 0;
let SignOfReward = '$';
let isStatic = true;
let transform;
let extended_name;
const yesButtonInRight = Math.random() < 0.5; // Randomize button position

class Start extends Component {
  constructor(props) {
    super(props);

    // Initialize total bonus array
    this.TotalBonus = [];
    let RunCounter = KeyTableID();

    // Bind methods
    this.Forward = this.Forward.bind(this);

    // Set payment and game settings from props
    this.PaymentsSettings = props.game_settings.payments;
    NUM_OF_REPEATED_REAL_ROUNDS = 40;
    SignOfReward = props.game_settings.payments.sign_of_reward;
    this.extended_name = props.game_settings.game.extended_name; // for the case that this game was invoked from mixed game , 

    // Determine game condition based on provided configuration
    let cond = props.game_settings.game.cond;
    if (cond === 'o') {
      GameCondition = 'OneShot';
    } else if (cond === 'r') {
      GameCondition = 'Repeated';
    } else if (cond === 'rand') {
      // Randomly decide between OneShot and Repeated
      let rnd = Math.floor(Math.random() * 2);
      GameCondition = rnd ? 'OneShot' : 'Repeated';
    } else if (cond === 'u_d') {
      // Use uniform distribution for deciding condition
      GameCondition = RunCounter % 2 ? 'OneShot' : 'Repeated';
    }

    // Calculate the last index of the game rounds
    lastIndex = GameCondition == 'OneShot' ?
      NUM_OF_PRACTICE_ROUNDS + NUM_OF_INTRODUCTION_STEPS + 1 :
      NUM_OF_PRACTICE_ROUNDS + NUM_OF_INTRODUCTION_STEPS + NUM_OF_REPEATED_REAL_ROUNDS;

    console.log("------------------> Exp= " + ThisExperiment + "-" + GameCondition + "  lastIndex=" + lastIndex);

    // Initialize component state
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
      mathAnsweredCorrectly: false,
      showError: false,
    };
  }

  // Logs game start and initializes state when component mounts
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

  // Adds a record for the current round index and user answer
  addRecord = (roundIndex, value) => {
    const { userAnswers } = this.state;
    this.setState(prevState => ({
      userAnswers: {
        ...prevState.userAnswers,
        [roundIndex]: value
      }
    }));
  };

  // Hides introduction messages
  handleHideMessages = () => {
    this.setState({ hideMessages: true });
  }

  // Hides mind game completion message
  handelHideMindGameCompleted = () => {
    this.setState({ hideMindGameCompleted: true, showWelcomeToNextTask: true });
  }

  // Hides welcome message for the next task
  handelHideWelcomeToNextTask = () => {
    this.setState({ showWelcomeToNextTask: false });
  }

  // Hides practice over message
  handleHidePracticeIsOver = () => {
    this.setState({ practiceIsOver: true });
  }

  // Handles advancing to the next round
  handleNext = () => {
    this.setState(prevState => ({
      currentRoundIndex: Math.min(prevState.currentRoundIndex + 1, lastIndex),
      showDice: false,
      showConfirmation: true,
      newRound: true,
    }));
  };
    // Method to handle the result from the MathQuestion component
    handleMathQuestionAnswer = (isCorrect) => {
      if (isCorrect) {
        this.setState({ mathAnsweredCorrectly: true, showError: false });
      } else {
        this.setState({ showError: true });
      }
    };
  // Handles the user's confirmation of the dice outcome
  handleConfirmation = (confirmed) => {
    const { currentRoundIndex } = this.state;
    isStatic = true; // Reset static state for the dice
    endTimer = getTimeDate().now;
    totalTimer = endTimer - startTimer;
    console.log("===> in handleConfirmation totalTimer=" + totalTimer);

    // Check if this is the last round
    if (currentRoundIndex + 1 === lastIndex) {
      this.setState({
        isLast: true,
        showConfirmation: false,
        showDice: false,
        showButton: true,
      });
    }

    // Update the state and database based on confirmation
    if (confirmed) {
      this.setState(prevState => ({
        yesClickCount: prevState.yesClickCount + 1,
        showResult: false,
        newRound: true,
        showButton: true,
        showDice: false,
        showConfirmation: false,
      }), () => {
        // Prepare data for database insertion
        const db_row = {
          RoundIndex: currentRoundIndex <= NUM_OF_PRACTICE_ROUNDS ? 0 : currentRoundIndex - NUM_OF_PRACTICE_ROUNDS,
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
        noClickCount: prevState.noClickCount + 1,
        showResult: false,
        newRound: true,
        showButton: true,
        showDice: false,
        showConfirmation: false,
      }), () => {
        const db_row = {
          RoundIndex: currentRoundIndex <= NUM_OF_PRACTICE_ROUNDS ? 0 : currentRoundIndex - NUM_OF_PRACTICE_ROUNDS,
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

  // Inserts a game line into the database
  insertGameLine = (db_row) => {
    this.props.insertGameLine(db_row);
  }

  // Placeholder method for forwarding actions (not currently used)
  Forward(finish_game, game_data) { }

  // Sends game data to the database and logs game completion
  sendDataToDB = (send) => {
    const current_time = getTimeDate();
    var reward_sum = 0;
    var temp_sign_of_reward = this.PaymentsSettings.sign_of_reward;
    let debug_args = { reward_sum, temp_sign_of_reward };

    this.props.sendGameDataToDB().then(() => {
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
      });

      if (send) {
        var result = this.addGameBonus();
        var total_bonus = result.selectedRoundPoints;
        var randomSelectedRound = result.randomSelectedRound;
        console.log("---> in sendDataToDB total_bonus=" + total_bonus + "   randomSelectedRound=" + randomSelectedRound);

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
    });
  }

  // Calculates the total bonus based on user performance
  calculateBonus() {
    var total_bonus = this.TotalBonus.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    var exchange_ratio = this.PaymentsSettings.exchange_ratio;
    total_bonus = total_bonus / exchange_ratio;
    total_bonus = (Math.round(total_bonus * 100) / 100).toFixed(2);
    console.log("---> in calculateBonus()  total_bonus=" + total_bonus + "  exchange_ratio=" + exchange_ratio);
    return total_bonus;
  }

  // Adds a bonus for a randomly selected round
  addGameBonus = (game_data) => {
    const { userAnswers } = this.state;
    const keys = Object.keys(userAnswers);
    keys.forEach(key => { console.log(`keys Key: ${key}, Value: ${userAnswers[key]}`); });

    const randomIndex = GameCondition === "OneShot" ? 4 : Math.floor(Math.random() * (NUM_OF_REPEATED_REAL_ROUNDS + 1)) + 4;
    console.log("--->  in addGameBonus()   randomIndex=" + randomIndex);
    const randomSelectedRound = keys[randomIndex - 1];
    const randomSelectedRoundValue = userAnswers[randomSelectedRound];
    const selectedRoundPoints = randomSelectedRoundValue === 'Yes' ? 1 : 0;
    const TotalBonus = [];
    TotalBonus.push(selectedRoundPoints);
    console.log("---> in addGameBonus() selectedRoundPoints=" + selectedRoundPoints + "   randomSelectedRound=" + randomSelectedRound);

    return {
      selectedRoundPoints: selectedRoundPoints,
      randomSelectedRound: randomSelectedRound
    };
  };

  // Generates a random dice value between 1 and 6
  getRandomDiceValue = () => {
    let tmpRand = Math.floor(Math.random() * 6) + 1;
    return tmpRand;
  };

  // Randomizes dice and sets state for dice roll
  randomDice = () => {
    isStatic = false;
    this.random = isStatic ? -1 : this.getRandomDiceValue();
    this.rollDice(this.random);
  };

  // Rolls the dice and updates the UI
  rollDice = (random) => {
    console.log("===> in roll dice random=" + random);
    startTimer = getTimeDate().now;

    setTimeout(() => {
      // Rotate the dice based on the random value
      switch (random) {
        case -1:
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

      // Update state after dice roll
      this.setState({
        diceTransform: transform,
        diceClass: '',
        showButton: false,
        diceOutcome: random,
        showConfirmation: true,
      });
    }, 50);
  };

  // Render method for displaying the UI
  render() {
    const { currentRoundIndex, showConfirmation, correctAnswer, hideMindGameCompleted, showWelcomeToNextTask,
      showDice, yesClickCount, noClickCount, practiceMode, gameCondition,
      hideMessages, practiceIsOver, showButton, diceOutcome, diceClass, diceTransform, newRound, mathAnsweredCorrectly, showError } = this.state;

    // Check if the introduction messages should be hidden 
    if (!mathAnsweredCorrectly) {
      return (
        <div className="trivia-container">
          <MathQuestion onAnswer={this.handleMathQuestionAnswer} />

          {/* Display error message if user answers incorrectly */}
          
        </div>
      );
    }
    if (!hideMessages) {
      return (
        <MindGameIntroduction gameCondition={GameCondition} signOfReward={SignOfReward} onHideMessages={this.handleHideMessages} messageIndex={currentRoundIndex} props />
      );
    }

    // Declare a variable to hold the JSX for FoodPreference
    let foodPreferenceComponent = null;

    // Conditions for showing the last screen of OneShot or Repeated game modes
    const oneShotLast = GameCondition == "OneShot" && !showConfirmation && currentRoundIndex == NUM_OF_PRACTICE_ROUNDS + 1;
    const repeatedLast = GameCondition == "Repeated" && !showConfirmation && (currentRoundIndex == NUM_OF_PRACTICE_ROUNDS + NUM_OF_REPEATED_REAL_ROUNDS);

    // Check if the mind game is completed, show a next task (food or resource allocation)
    if ((oneShotLast || repeatedLast) && (currentRoundIndex != NUM_OF_PRACTICE_ROUNDS)) {
      if (!hideMindGameCompleted && GameCondition == "Repeated") {
        return (
          <div className="practice-is-over">
            <h3>You completed the "mind-game”</h3>
            <p>
              You will now fill out food preference survey. <br></br>
              Note that you cannot leave or stop responding until you have completed the entire study and <br></br>
              have received your completion code, or else you will not receive compensation.
            </p>
            <button onClick={this.handelHideMindGameCompleted}>Next</button>
          </div>
        );
      } else if (!hideMindGameCompleted && GameCondition == "OneShot") {
        return (
          <div className="practice-is-over">
            <h3>You completed the "mind-game”</h3>
            <p>
              You will now fill out a short resource allocation survey.
              Note that you cannot leave or stop responding until you have completed the entire study and have received your completion code, or else you will not receive compensation.
            </p>
            <button onClick={this.handelHideMindGameCompleted}>Next</button>
          </div>
        );
      }

      // Show welcome message for next task if applicable
      if (showWelcomeToNextTask && GameCondition == "OneShot") {
        return (
          <div className="trivia-container" >
            <h3><b>Welcome to the resource allocation survey</b></h3>
            <p>
              Please read the following case carefully - this is the only case you will be asked about. We will then ask you several questions about it.
            </p>
            <button onClick={this.handelHideWelcomeToNextTask}>Next</button>
          </div>
        );
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
        );
      }

      // Show FoodPreference component if applicable
      if (GameCondition == "Repeated") {
        return <FoodPreference GameCondition={GameCondition} insertGameLine={this.insertGameLine} sendDataToDB={this.sendDataToDB} />
      } else if (GameCondition == "OneShot") {
        return <ResourceAllocation GameCondition={GameCondition} insertLine={this.insertGameLine} sendDataToDB={this.sendDataToDB} isTrivia={false} />;
      }
    }

    // Display message when practice is over in OneShot mode
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
      );
    }

    // Display message when practice is over in Repeated mode
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
      );
    }

    // If the dice has not been rolled, display the prompt to roll the dice
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
            <p>Think of one of the following numbers:<br /><b>1,2,3,4,5,6<br />keep this number in your mind.</b></p>
            <p>
              <button onClick={this.handleNext}>Next</button>
            </p>
          </div>
        </div>
      );
    }

    // If a new round starts, display the dice component
    if (newRound) {
      let tmpDiceTransform = !isStatic ? diceTransform : STATIC_TRANSFORM;
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
                <br />
              </>
            )}
            <br></br>
            <br></br>
            <div className={`dice ${diceClass}`} style={{ transform: tmpDiceTransform }} key={0}>
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
                    {yesButtonInRight ?
                      (<div style={{ marginLeft: '60px', display: 'flex', gap: '30px' }}>
                        <button onClick={() => this.handleConfirmation(false)}>No</button>
                        <button onClick={() => this.handleConfirmation(true)}>Yes</button>
                      </div>
                      ) : (
                        <div style={{ marginLeft: '60px', display: 'flex', gap: '30px' }}>
                          <button onClick={() => this.handleConfirmation(true)}>Yes</button>
                          <button onClick={() => this.handleConfirmation(false)}>No</button>
                        </div>
                      )}
                    {GameCondition == "OneShot" ?
                      (<>
                        <p>Note: You will receive a {formatPrice(1, SignOfReward)} bonus only if you report "Yes"</p>
                      </>) : (
                        <>
                          <p>Note: If this round will be selected, you will receive a {formatPrice(1, SignOfReward)} bonus only if you report "Yes"</p>
                        </>
                      )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default return when no other conditions are met
    return (
      <div className="container">
        {foodPreferenceComponent}
        {!hideMessages ? (
          <MindGameIntroduction gameCondition={GameCondition} onHideMessages={this.handleHideMessages} gameCondition={this.GameCondition} />
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
                      </>) : (
                        <>
                          <button onClick={() => this.handleConfirmation(true)}>Yes</button>
                          <button onClick={() => this.handleConfirmation(false)}>No</button>
                        </>
                      )}
                    {GameCondition == "OneShot" ?
                      (<>
                        <p>Note: You will receive a {formatPrice(1, SignOfReward)} bonus only if you report "Yes"</p>
                      </>) : (
                        <>
                          <p>Note: If this round will be selected, you will receive a {formatPrice(1, SignOfReward)} bonus only if you report "Yes"</p>
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
