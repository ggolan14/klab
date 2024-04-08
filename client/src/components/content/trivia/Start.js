import React, { useState } from 'react';
import {KeyTableID} from "../../screens/gameHandle/game_handle";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import PropTypes from "prop-types";
import TriviaGame from './TriviaGame';
import jsonData from './trivia_questions.json';
import './TriviaGame.css'; // Import the CSS file
import CorrectAnswerConfirmation from './CorrectAnswerConfirmation'; // Import your NextConfirmationDialog component


const ThisExperiment = 'Trivia';

let UserId = 'empty';
let RunningName = '-';
let StartTime = null;
let GAME_POINTS = 0;
let SUM_OF_CUPS = 0;
let DebugMode = null;
let GameSet = {};
let PaymentsSettings = null;
let GameCondition = null;

const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    StartTime = null;
    DebugMode = null;
    GameSet = {};
    PaymentsSettings = null;
    GAME_POINTS = 0;
    SUM_OF_CUPS = 0;
    GameCondition = null;
};

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        let RunCounter = KeyTableID();

        

        PaymentsSettings = props.game_settings.payments;

        GameSet.trials = Number(props.game_settings.game.trials);
        GameSet.reward = Number(props.game_settings.game.reward);
        GameSet.cups_start = Number(props.game_settings.game.cups_start);
        GameSet.storage_cost = props.game_settings.game.s_c;
        let no_ask = props.game_settings.game.no_ask;
        let cond = props.game_settings.game.cond;

        if (cond === 's')
            GameCondition = 'Specific';
        else if (cond === 'g')
            GameCondition = 'General';
        else if (cond === 'r') {
            // GameCondition = 'Random';
            let rnd = Math.floor(Math.random() * 2);
            if (rnd)
                GameCondition = 'Specific';
            else
                GameCondition = 'General';
        }
        else if (cond === 'u_d') {
            // GameCondition = 'Uniform distribution';
            if (RunCounter % 2)
                GameCondition = 'Specific';
            else
                GameCondition = 'General';
        }
        if (isNaN(no_ask)){
            if (no_ask === 'Random')
                GameSet.no_ask = Math.floor(Math.random() * 10).toString();
        }
        else{
            GameSet.no_ask = (Number(GameSet.no_ask) - 1).toString();
        }


        if (GameSet.cups_start > 10)
            GameSet.cups_start = 10;

        try {
            GameSet.ball_speed = Number(props.game_settings.game.ball_speed) || 1;

        }catch (e) {
            GameSet.ball_speed = 1;
        }

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
        };

        this.props.SetLimitedTime(false);

        this.Forward = this.Forward.bind(this);
        this.initializeGame = this.initializeGame.bind(this);

        this.game_template = null;

        this.initializeGame();

    }

    initializeGame() {

        let game_template = [];
/*
        game_template.push({
            Component: GameWelcome
        });
        */

        game_template.push({
          //  Component: Game

        });

        this.game_template = game_template;
    }

    componentDidMount(){
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'G.L',
            type: 'LogGameType',
            more_params: {
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => this.setState({isLoading: false}));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa){
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    Forward(){
        console.log("---> Forward 111")
        let sc = this.state;
        if (sc.tasks_index === (this.game_template.length-1)){
            this.props.SetLimitedTime(false);
            let rec = this.props.getGameRecords();

            let q_cup = 0, q_no_cup = 0, keep = 0, throw_ = 0, place = 0, dontPlace = 0;
            for (let i=0; i<rec.length; i++){
                if (rec[i].cup_decision === 'KeepCup')
                    keep++;
                else if (rec[i].cup_decision === 'ThrowCup')
                    throw_++;

                if (rec[i].no_cup_decision === 'PlaceCup')
                    place++;
                else if (rec[i].no_cup_decision === 'DontPlace')
                    dontPlace++;

                if (rec[i].cup_decision !== '') {
                    q_cup++;
                }
                if (rec[i].no_cup_decision !== '') {
                    q_no_cup++;
                }
            }

            this.props.insertTextInput('q_cup', q_cup);
            this.props.insertTextInput('q_no_cup', q_no_cup);

            this.props.insertTextInput('keepT', keep);
            this.props.insertTextInput('keep', Math.round((keep/q_cup) * 10000) / 10000);

            this.props.insertTextInput('throwT', throw_);
            this.props.insertTextInput('throw', Math.round((throw_/q_cup) * 10000) / 10000);

            this.props.insertTextInput('placeT', place);
            this.props.insertTextInput('place', Math.round((place/q_no_cup) * 10000) / 10000);

            this.props.insertTextInput('dontPlaceT', dontPlace);
            this.props.insertTextInput('dontPlace', Math.round((dontPlace/q_no_cup) * 10000) / 10000);

            let probability = GAME_POINTS / PaymentsSettings.exchange_ratio;
            if (probability > 1) probability = 1;
            else if (probability < 0) probability = 0;

            const current_time = getTimeDate();
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {
                    game_points: GAME_POINTS,
                    prob: probability,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            let Total_time = Date.now() - StartTime;
            let full_seconds = Total_time/1000;
            let minutes = Math.floor(full_seconds/60);
            let seconds = Math.floor(full_seconds - minutes*60);

            let Total_milli = `${minutes}:${seconds}`;
            const Avg_cup_num = Math.round((SUM_OF_CUPS / GameSet.trials)*1000)/1000;
            this.props.insertTextInput('Total_point', GAME_POINTS);
            this.props.insertTextInput('Avg_cup_num', Avg_cup_num);
            this.props.insertTextInput('Total_milli', Total_milli);
            this.props.insertTextInput('Total_time', Total_time);
            this.props.insertTextInput('Condition', GameCondition);

            this.props.insertPayment({
                game_points: GAME_POINTS,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                prob: probability,
                bonus_endowment: PaymentsSettings.bonus_endowment,
                show_up_fee: PaymentsSettings.show_up_fee,
                sign_of_reward: PaymentsSettings.sign_of_reward,
                Time: current_time.time,
                Date: current_time.date
            });

            sc.isLoading = true;

            let debug_args = null;
            if (DebugMode) {
                debug_args = {
                    game_points: GAME_POINTS,
                    exchange_ratio: PaymentsSettings.exchange_ratio,
                    q_cup,
                    q_no_cup,
                    keepT: keep,
                    throwT: throw_,
                    placeT: place,
                    dontPlaceT: dontPlace,
                    keep: Math.round((keep/q_cup) * 10000) / 10000,
                    throw_: Math.round((throw_/q_cup) * 10000) / 10000,
                    place: Math.round((place/q_no_cup) * 10000) / 10000,
                    dontPlace: Math.round((dontPlace/q_no_cup) * 10000) / 10000,
                    probability,
                    bonus_endowment: PaymentsSettings.bonus_endowment,
                    show_up_fee: PaymentsSettings.show_up_fee,
                    total_cups: SUM_OF_CUPS,
                    trials: GameSet.trials,
                    Avg_cup_num,
                    Total_milli,
                    Total_time
                }
            }

            this.setState(sc, () => {
                this.props.sendGameDataToDB().then(
                    res => {
                        NewLogs({
                            user_id: UserId,
                            exp: ThisExperiment,
                            running_name: RunningName,
                            action: 'G.E.S',
                            type: 'LogGameType',
                            more_params: {
                                game_points: GAME_POINTS,
                                local_t: current_time.time,
                                local_d: current_time.date,
                            },
                        }).then((res) => {});
                        this.props.callbackFunction('FinishGame', {need_summary: true, args: debug_args});
                    }
                );
            });
        }
        else {
            if (sc.tasks_index === 0)
                this.props.SetLimitedTime(true);

            sc.tasks_index++;
        }
        this.setState(sc);
    }

    render() {
        return (
            <div>
              <MyTriviaGame></MyTriviaGame>
            </div>
          );
       
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};


export default Start;

function setGainMsg({cups_tax, base_reward}){
    let sc = this.state;
    sc.gain_msg =  {
        reward: this.current_trial.reward,
        cups_tax,
        base_reward
    };
    sc.stop_ball = true;

    const cups_num = sc.cups_selected.reduce((total, num) => total + (num?1:0), 0);
    SUM_OF_CUPS += cups_num;
    let db_row = {
        trial: sc.trial,
        ball_location: this.current_trial.ball_index+1,
        
    }
    if (DebugMode)
        sc.debug_row = db_row;

    this.setState(sc)
}

const MyTriviaGame = (props) => {
    console.log("---> in TriviaGame constructor")
    // State to hold the current question index and whether the confirmation dialog should be shown
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const totalQuestions = jsonData.length;
    const ThisExperiment = 'Trivia';
  
    // Function to handle navigation to the next question
    const goToNextQuestion = () => {
      // Show confirmation dialog
      
      setShowConfirmationDialog(true);
    };
  
    // Function to handle confirmation dialog cancellation
    const handleCancelConfirmation = () => {
      setShowConfirmationDialog(false);
    };
  
    // Function to handle confirmation dialog confirmation
    const handleConfirmConfirmation = () => {
      NewLogs({
        user_id: 123,
        exp: ThisExperiment,
        running_name: "myRunning",
        action: 'G.L',
        type: 'LogGameType',
        more_params: {
            local_t: getTimeDate().time,
            local_d: getTimeDate().date,
        },
    }).then((res) => {
        this.START_APP_MIL = Date.now();
        this.props.SetLimitedTime(true);
        this.setState({isLoading: false});
    });
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowConfirmationDialog(false);
    };
    const currentQuestion = jsonData[currentQuestionIndex];
    
    let content = null;
    if(showConfirmationDialog === true){
      content = (<div>
        <CorrectAnswerConfirmation
            onCancel={handleCancelConfirmation}
            onConfirm={handleConfirmConfirmation}
            correctAnswer={getCorrectAnswer()}
           />
      </div>
      )
    }
    else if(currentQuestionIndex===totalQuestions){
      console.log("currentQuestionIndex==totalQuestions")
      
      
      content = (<div>
        <label>You successfully finished the trivia experiment</label>
      </div>
      )
    }
    else if(currentQuestionIndex < totalQuestions){
      console.log("---> currentQuestionIndex="+currentQuestionIndex+"  totalQuestions="+totalQuestions)
      content=(
      <div>
      <h3><label style={{ fontWeight: 'bold' }}>Question#{currentQuestionIndex+1}:</label> <label>{jsonData[currentQuestionIndex].question}</label></h3>
      {/* Render answer options */}
      <ul>
      {jsonData[currentQuestionIndex].answers.map((answer, index) => (
        <li key={answer.option}>
          <label>
          <span style={{ color: 'blue' }}>Option#{answer.option}</span> <span style={{ color: 'green' }}>{answer.text}</span>
          </label>
        </li>
      ))}
      </ul>
      <button onClick={goToNextQuestion}>I have an answer in my mind.</button>
      
    </div>
      )
    } 
    else{
      content = (<div>
        content= <CorrectAnswerConfirmation></CorrectAnswerConfirmation>
      </div>
      )
     
  
    }
   
    function getCorrectAnswer(){
      const correctAnswer = jsonData[currentQuestionIndex].answers.map((answer, index) => {  
        console.log("---> Answer: "+answer.text);
        if (answer.option === currentQuestion.correct_answer) {
          return answer.text;
        }
      }).find(answer => answer !== undefined);
    
      return correctAnswer;
    }
  
    // Render the component
    return (
      <div className="quiz-container">
        <h1>Trivia Quiz</h1>
        {content}
      </div>
    );
  };
  
  // Export the component
  
  
