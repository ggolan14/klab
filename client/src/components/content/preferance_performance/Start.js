import React, { Component } from 'react';
import { config } from './config/config';
import './gameStyles.css';
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
import PreferancePerformanceIntroduction from './PreferancePerformanceIntroduction';
import Quize from './Quize';
import Part4Selection from './Part4Selection'; // New Component for Part4
import { formatPrice } from '../../utils/StringUtils';
import GameRound from '../mind_game/GameRound';
import Game from './Game';
import { GlobalStateProvider } from './GlobalStateContext';
import { getTotalScore, setTotalScore } from './GlobalState';



// Constants for experiment and static styles
const ThisExperiment = 'PreferancePerformance';
const STATIC_TRANSFORM = "rotateX(45deg) rotateY(-45deg)";

// Global variables for user and game settings
let UserId = 'empty';
let RunningName = '-';
let GameCondition = null;
let NUM_OF_REPEATED_REAL_ROUNDS = 0;
let startTimer = 0;
let endTimer = 0;
let totalTimer = 0;
let SignOfReward = '$';
let isStatic = true;
let transform;
let extended_name;
let selectedGame;
let selectedGameIndex;
const yesButtonInRight = Math.random() < 0.5;

class Start extends Component {
  constructor(props) {
    super(props);

    let RunCounter = KeyTableID();
    this.PaymentsSettings = props.game_settings.payments;
    selectedGameIndex = RunCounter % 3;
    this.selectedGame = props.game_settings.game.g_b[selectedGameIndex];
    this.displayTime = props.game_settings.game.display_time;
    this.selectedGame.type_1_score = props.game_settings.game.type_1_score;
    this.selectedGame.type_2_score = props.game_settings.game.type_2_score;
    this.selectedGame.type_1_probability = props.game_settings.game.type_1_probability;
    this.selectedGame.type_2_probability = props.game_settings.game.type_2_probability;

    // Determine game condition
    let cond = props.game_settings.game.cond;
    if (cond === 'o') {
      GameCondition = 'OneShot';
    } else if (cond === 'r') {
      GameCondition = 'Repeated';
    } else if (cond === 'rand') {
      GameCondition = Math.random() < 0.5 ? 'OneShot' : 'Repeated';
    } else if (cond === 'u_d') {
      GameCondition = RunCounter % 2 ? 'OneShot' : 'Repeated';
    }

    this.state = {
      hideMessages: false,
      showQuiz: true, // Initialize quiz to show first
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
  addRecord = (roundIndex, value) => {
    const { userAnswers } = this.state;
    this.setState(prevState => ({
      userAnswers: {
        ...prevState.userAnswers,
        [roundIndex]: value
      }
    }));
  };
  // Hide introduction and move to quiz
  handleHideMessages = () => {
    this.setState({ hideMessages: true });
  };

  // Hide quiz and move to Part4 selection
  handleQuizComplete = () => {
    this.setState({ showQuiz: false, showPart4: true });
  };

  // Hide Part4 selection and start game
  handlePart4Complete = () => {
    this.setState({ showPart4: false });
  };

    // Inserts a game line into the database
    insertGameLineToDB = (db_row) => {
      console.log("---> insert game line to db ",db_row)
      console.log("---> insert game line to db "+db_row.Color)

      this.props.insertGameLine(db_row);
    }

    
  // Placeholder method for forwarding actions (not currently used)
  Forward(finish_game, game_data) { }
  // Sends game data to the database and logs game completion
  sendDataToDB = (send) => {
    const current_time = getTimeDate();
    var reward_sum = 0;
    var temp_sign_of_reward = this.PaymentsSettings.sign_of_reward;
    let debug_args = {
      reward_sum,
    }

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
        var total_bonus = getTotalScore();
        var randomSelectedRound = "99";
        console.log("---> in sendDataToDB total_bonus=" + total_bonus);
        
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
    return total_bonus;
  }
    // Adds a bonus for a randomly selected round
    addGameBonus = (game_data) => {
      const { userAnswers } = this.state;
      const keys = Object.keys(userAnswers);
    
  
      const randomIndex = GameCondition === "OneShot" ? 4 : Math.floor(Math.random() * (NUM_OF_REPEATED_REAL_ROUNDS + 1)) + 4;
     
      const randomSelectedRound = keys[randomIndex - 1];
      const randomSelectedRoundValue = userAnswers[randomSelectedRound];
      const selectedRoundPoints = randomSelectedRoundValue === 'Yes' ? 1 : 0;
      const TotalBonus = [];
      TotalBonus.push(selectedRoundPoints);
     
  
      return {
        selectedRoundPoints: selectedRoundPoints,
        randomSelectedRound: randomSelectedRound
      };
    };

    newProps = {
      ...this.props,         // Spread the existing props
      insertGameLineToDB: this.insertGameLineToDB,           // Add myFunc
      sendDataToDB: this.sendDataToDB,          // Add myFunc2
    };
  render() {
    const { hideMessages, showQuiz, showPart4 } = this.state;
   console.log("===> this.newProps=",this.newProps)
    return (
      <div className="container">
        {/* Step 1: Show Introduction */}
        {!hideMessages ? (
          <PreferancePerformanceIntroduction 
            gameCondition={GameCondition} 
            onHideMessages={this.handleHideMessages} 
            selectedGame={this.selectedGame}
          />
        ) : /* Step 2: Show Quiz */
        showQuiz ? (
          <Quize 
            insertLine={this.props.insertGameLine} 
            onComplete={this.handleQuizComplete} 
            selectedGame={this.selectedGame}
          />
        ) : /* Step 3: Show Part4 Selection */
        showPart4 ? (
          <Part4Selection 
            selectedGame={this.selectedGame} 
            insertLine={this.props.insertGameLine} 
            onComplete={this.handlePart4Complete} 
          />
        ) : /* Step 4: Start the Game */
        (
          <GlobalStateProvider>
            <Game 
              isGreenFirst={Math.random() < 0.5}
              selectedGame={this.selectedGame} 
              selectedGameIndex={selectedGameIndex}
              props={this.newProps}
            />
          </GlobalStateProvider>
        )}
      </div>
    );
  }
  }


export default Start;
