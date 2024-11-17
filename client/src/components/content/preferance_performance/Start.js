import React, { Component } from 'react';
import { config } from './config/config';
import './gameStyles.css';
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
import PreferancePerformanceIntroduction from './PreferancePerformanceIntroduction';
import { formatPrice } from '../../utils/StringUtils';
import GameRound from '../mind_game/GameRound';
import Game from './Game';
import { GlobalStateProvider } from './GlobalStateContext';


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
let selectedGame;
let selectedGameIndex;
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
   
    SignOfReward = props.game_settings.payments.sign_of_reward;
   
    selectedGameIndex =  Math.floor(Math.random() * 3);
    this.selectedGame = props.game_settings.game.g_b[selectedGameIndex]; // allocate user to a game
    this.displayTime = props.game_settings.game.display_time;
    console.log("%%%%% selectedGame="+selectedGame +"  selectedGameIndex="+selectedGameIndex)
   



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

    this.state = {
      hideMessages: false,
      gameIndex: 0,
      blockIndex: 0,
      stepIndex: 0,
      showConfirmation: false,
      correctAnswer: null,
      showResult: false,
      showDice: false,
      yesClickCount: 0,
      noClickCount: 0,
      practiceMode: true,
      isLast: false,
      gameCondition: GameCondition,
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
   
  }

  // Hides welcome message for the next task
  handelHideWelcomeToNextTask = () => {
    
  }

  // Hides practice over message
  handleHidePracticeIsOver = () => {
   
  }

  // Handles advancing to the next round
  handleNext = () => {
   
  };
    // Method to handle the result from the MathQuestion component
    handleMathQuestionAnswer = (isCorrect) => {
    //  if (isCorrect) {
    //    this.setState({ mathAnsweredCorrectly: true, showError: false });
   //   } else {
    //    this.setState({ showError: true });
     // }
    };
  // Handles the user's confirmation of the dice outcome
  handleConfirmation = (confirmed) => {

  }

  // Inserts a game line into the database
  insertGameLineToDB = (db_row) => {
    console.log("$$$$$$$$$")
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

      if (true) {
        var result = this.addGameBonus();
        var total_bonus = "55";
        var randomSelectedRound = "99";
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
  
  newProps = {
    ...this.props,         // Spread the existing props
    insertGameLineToDB: this.insertGameLineToDB,           // Add myFunc
    sendDataToDB: this.sendDataToDB,          // Add myFunc2
   
  };

  // Render method for displaying the UI
  render() {
    const { hideMessages} = this.state;
    return (
      <div className="container">
      
        {!hideMessages ? (
          <PreferancePerformanceIntroduction 
          gameCondition={GameCondition} 
          onHideMessages={this.handleHideMessages} 
          selectedGame={this.selectedGame} 
          insertLine={this.insertGameLineToDB} 
          sendDataToDB={this.sendDataToDB}/>
        ) : (
          <div>
            <GlobalStateProvider>
            <Game 
            isGreenFirst={Math.random() < 0.5}
            selectedGame={this.selectedGame} 
            selectedGameIndex={selectedGameIndex}
            props={this.newProps}/>
            </GlobalStateProvider>

          </div>
        )}
      </div>
    );
  }
}

export default Start;
