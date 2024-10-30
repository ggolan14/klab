import React, { Component } from 'react';
import { config } from './config/config';
import './gameStyles.css';
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
import PreferancePerformanceIntroduction from './PreferancePerformanceIntroduction';
import FoodPreference from '../trivia/FoodPreference';
import { formatPrice } from '../../utils/StringUtils';
import GameRound from '../mind_game/GameRound';
import Game from './Game';
import ResourceAllocation from '../mind_game/ResourceAllocation';
import MathQuestion from '../trivia/MathQuestion'; // The math question component


// Constants for experiment and static styles
const ThisExperiment = 'PreferancePerformance';
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

    if (!hideMessages) {
      return (
        <PreferancePerformanceIntroduction gameCondition={GameCondition} signOfReward={SignOfReward} onHideMessages={this.handleHideMessages} messageIndex={currentRoundIndex} props />
      );
    }

    // Declare a variable to hold the JSX for FoodPreference
    let foodPreferenceComponent = null;

    // Conditions for showing the last screen of OneShot or Repeated game modes
    const oneShotLast = GameCondition == "OneShot" && !showConfirmation && currentRoundIndex == NUM_OF_PRACTICE_ROUNDS + 1;
    const repeatedLast = GameCondition == "Repeated" && !showConfirmation && (currentRoundIndex == NUM_OF_PRACTICE_ROUNDS + NUM_OF_REPEATED_REAL_ROUNDS);

    // Check if the mind game is completed, show a next task (food or resource allocation)


    // Display message when practice is over in OneShot mode


    // Display message when practice is over in Repeated mode


    // If the dice has not been rolled, display the prompt to roll the dice


    // If a new round starts, display the dice component


    // Default return when no other conditions are met
    return (
      <div className="container">
        {foodPreferenceComponent}
        {!hideMessages ? (
          <PreferancePerformanceIntroduction gameCondition={GameCondition} onHideMessages={this.handleHideMessages} gameCondition={this.GameCondition} />
        ) : (
          <div>
           <Game></Game>

          </div>
        )}
      </div>
    );
  }
}

export default Start;
