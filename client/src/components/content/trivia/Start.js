import React, { Component } from 'react';
import './gameStyles.css';
import trivia_questions from './trivia_questions.json';
import {getTimeDate} from "../../../utils/app_utils";
import {NewLogs} from "../../../actions/logger";
import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";
import TriviaIntroduction from './TriviaIntroduction';
import FoodPreference from './FoodPreference';
const ThisExperiment = 'Trivia';



let UserId = 'empty';
let RunningName = '-';
//let StartTime = null;
//let GAME_POINTS = 0;
//let SUM_OF_CUPS = 0;
//let GameSet = {};
//let PaymentsSettings = null;
let GameCondition = null;
let NUM_OF_PRACTICE_QUESTIONS=4;
let lastIndex;
let startShowQuestionTimer=0;
let endShowQuestionTimer=0;
let startShowConfirmationTimer=0;
let endShowConfirmationTimer=0;
let totalShowQuestionTime=0;
let totalShowConfirmationTime=0;
let practiceIsOver = false;

class Start extends Component {
  constructor(props) {
    super(props);
    this.TotalBonus = [];
    let RunCounter = KeyTableID();
    let cond = props.game_settings.game.cond;
    console.log("------> cond="+cond)
    this.Forward = this.Forward.bind(this);
    this.PaymentsSettings = props.game_settings.payments;

    if (cond === 'o'){
            GameCondition = 'OneShot';
            lastIndex=4;
        }
        else if (cond === 'r'){
            GameCondition = 'Repeated';
            lastIndex=7;
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
            if (RunCounter % 2)
                GameCondition = 'OneShot';
            else
                GameCondition = 'Repeated';
        }
    
    this.state = {
      currentQuestionIndex: 0,
      showConfirmation: false,
      correctAnswer: null,
      showResult: false,
      showQuestion: true,
      yesClickCount: 0,
      noClickCount: 0,
      practiceMode: true,
      isLast: false,
      gameCondition:GameCondition,
      hideMessages: false,
      practiceIsOver:false,
     
    };
  }
  handleHideMessages = () => {
    this.setState({ hideMessages: true });
  }

  handleHidePracticeIsOver = () => {
    this.setState({ practiceIsOver: true });
  }

  handleNext = () => {
    const { currentQuestionIndex, practiceMode,gameCondition ,isLast } = this.state;
    let questions = [];
    questions = trivia_questions;
    const correctAnswer = questions[currentQuestionIndex].answers.find(answer => answer.option === questions[currentQuestionIndex].correct_answer).text;
      endShowQuestionTimer=getTimeDate().now;
      startShowConfirmationTimer=getTimeDate().now;
      totalShowQuestionTime=endShowQuestionTimer-startShowQuestionTimer;
      console.log("---> 111 questionIndex="+currentQuestionIndex +"   updating totalShowQuestionTime to:"+totalShowQuestionTime)
      this.setState(prevState => ({
        currentQuestionIndex: Math.min(prevState.currentQuestionIndex + 1, lastIndex),
        correctAnswer: correctAnswer,
        showQuestion: false,
        showConfirmation:true,
        }));
  };
 

  handleConfirmation = (confirmed) => {
    const { currentQuestionIndex, showConfirmation,  showQuestion, gameCondition,hideMessages} = this.state;
    const currentTime = getTimeDate().now
    endShowConfirmationTimer=getTimeDate().now;
    totalShowConfirmationTime = endShowConfirmationTimer - startShowConfirmationTimer;
    if (currentQuestionIndex+1 == lastIndex) {
      endShowQuestionTimer=getTimeDate().now;
      this.setState(prevState => (
        {
        isLast: true,
        showConfirmation: false,
        showQuestion: false,
       }), () => {
    
});
    }
    
    if (confirmed) {
      startShowQuestionTimer=getTimeDate().now;
      //console.log("!!!!!!! Show question 2 "+getTimeDate().now+"  currentQuestionIndex="+currentQuestionIndex)
      this.setState(prevState => (
        
        {
        showResult: false,
        yesClickCount: currentQuestionIndex>(NUM_OF_PRACTICE_QUESTIONS-1) ? prevState.yesClickCount + 1:prevState.yesClickCount,
        showQuestion: currentQuestionIndex != lastIndex,
        showConfirmation:false,
      }), () => {
        const db_row = {
          QuestionIndex: currentQuestionIndex-3,  // total 
          QuestionType:"Trivia",
          Answer: 1,
          TotalYesAnswers: this.state.yesClickCount,
          TotalNoAnswers: this.state.noClickCount,
          GameCondition: GameCondition,
          HaveAnAnswerTime:totalShowQuestionTime,
          ConfirmationTime:totalShowConfirmationTime,
        };
        
        if(currentQuestionIndex >= NUM_OF_PRACTICE_QUESTIONS){
          this.insertGameLine(db_row);
          this.sendDataToDB(false);
        }
      });
    } else {
      startShowQuestionTimer=getTimeDate().now;
     // console.log("!!!!!!! Show question  1"+getTimeDate().now+"  currentQuestionIndex="+currentQuestionIndex)
      this.setState(prevState => ({
        showResult: false,
        noClickCount: currentQuestionIndex>(NUM_OF_PRACTICE_QUESTIONS-1) ? prevState.noClickCount + 1 : prevState.noClickCount,
        showQuestion: currentQuestionIndex != lastIndex,
        showConfirmation:false,
      }), () => {
        const db_row = {
          QuestionIndex: currentQuestionIndex-3,
          QuestionType:"Trivia",
          Answer: 0,
          TotalYesAnswers: this.state.yesClickCount,
          TotalNoAnswers: this.state.noClickCount,
          GameCondition: GameCondition,
          HaveAnAnswerTime:totalShowQuestionTime,
          ConfirmationTime:totalShowConfirmationTime,
              
      };
       if(currentQuestionIndex >= NUM_OF_PRACTICE_QUESTIONS){
          this.insertGameLine(db_row);
          this.sendDataToDB(false);
        }
      });
    }
   
   }
  
  insertGameLine = (db_row) => {
      // console.log("%%%%  in insertGameLine()   NumOfNoAnswers="+db_row.NumOfNoAnswers+"    NumOfYesAnswers="+db_row.NumOfYesAnswers)
      this.props.insertGameLine(db_row);
  }

  Forward(finish_game, game_data){
    console.log("---> In Forward")
  }

  sendDataToDB = (send) => {
   // console.log("********  in sendDataToDB() lastIndex="+lastIndex+ "  currentQuestionIndex="+currentQuestionIndex)
    const current_time = getTimeDate();
/*
    var total_bonus=this.calculateBonus();
    this.PaymentsSettings.total_bonus = total_bonus;
    
            this.props.insertPayment({
                exchange_ratio: this.PaymentsSettings.exchange_ratio,
                bonus_endowment: this.PaymentsSettings.bonus_endowment,
                show_up_fee: this.PaymentsSettings.show_up_fee,
                sign_of_reward: this.PaymentsSettings.sign_of_reward,
                bonus_payment:this.PaymentsSettings.total_bonus,
                Time: current_time.time,
                Date: current_time.date
            });
*/

var total_bonus=123;
this.PaymentsSettings.total_bonus = total_bonus;

        this.props.insertPayment({
            exchange_ratio: "1",
            bonus_endowment:"2",
            show_up_fee: "3",
            sign_of_reward: "4",
            bonus_payment:"5",
            Time: current_time.time,
            Date: current_time.date
        });
    const summary_args = {
      //game_points: 56,
    };
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
          }).then((res) => {});
          if(send ){
           this.props.callbackFunction('FinishGame', { need_summary: true, args: summary_args });
          }
          
      }
  );

    
  }
  
  calculateBonus(){
    var total_bonus=this.TotalBonus.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    var exchange_ratio = this.PaymentsSettings.exchange_ratio;
    total_bonus = total_bonus / exchange_ratio ;
    total_bonus= (Math.round(total_bonus * 100) / 100).toFixed(2);
    console.log("---> in calculateBonus()  total_bonus="+total_bonus+"  exchange_ratio="+exchange_ratio)
    return total_bonus;
 }

 addGameBonus(game_data){
  console.log("-------------> in addGameBonus");
  var selectedQuestion= Math.floor(Math.random() * game_data.length);
  var selectedQuestionPoints=game_data[selectedQuestion].Answer==1 ? 999 : 0;
  console.log("---> game_data.length="+game_data.length + "   selectedQuestion="+(selectedQuestion+1)+"   selectedQuestionPoints="+selectedQuestionPoints)
  this.TotalBonus.push(selectedQuestionPoints);
  }

  render() {
    const { currentQuestionIndex, showConfirmation, correctAnswer, showResult, showQuestion, yesClickCount, noClickCount, practiceMode, gameCondition, hideMessages,practiceIsOver, isLast } = this.state;
    let questions = trivia_questions;
    const question = questions[currentQuestionIndex];
    const { answers } = question;

    // Declare a variable to hold the JSX for FoodPreference
    let foodPreferenceComponent = null;
    console.log("--->  questions.length="+questions.length+"  currentQuestionIndex="+currentQuestionIndex +" showQuestion="+showQuestion+"   showConfirmation="+showConfirmation+"  practiceIsOver="+practiceIsOver)
    // Check if currentQuestionIndex is equal to 3
    if (currentQuestionIndex === questions.length -1 && !showConfirmation) {
        // If equal, assign FoodPreference JSX to the variable
        return <FoodPreference GameCondition={GameCondition} insertGameLine={this.insertGameLine} sendDataToDB={this.sendDataToDB}/>
        
    }
    if(currentQuestionIndex === NUM_OF_PRACTICE_QUESTIONS - 1 && !practiceIsOver && !showConfirmation){
      return (
        <div className="practice-is-over">
          <h3>Practice is Over</h3>
          <p>
            You will now play the trivia game for real bonus.<br></br>
            You will play 40 rounds of the trivia game.<br></br>
            Remember: at the end of the study, one round will be randomly selected by the computer. If in that round the correct answer is the one you had in mind, you will receive a £1 bonus!
          </p>
          <button onClick={this.handleHidePracticeIsOver}>Next</button>
        </div>
      )
    }

    return (
        <div className="trivia-container">
            {/* Render FoodPreference component if currentQuestionIndex is 3 */}
            {foodPreferenceComponent}

            {!hideMessages ? (
                <TriviaIntroduction onHideMessages={this.handleHideMessages} messageIndex={currentQuestionIndex} />
            ) : (
                <div>
                    <DebuggerModalView>
                        <p>Current Question Index: {currentQuestionIndex + 1}</p>
                        <p>Game mode: {gameCondition}</p>
                        <p>Is in practice: {practiceMode == true ? "Yes" : "No"}</p>
                        <p>Num of YES clicks: {yesClickCount}</p>
                        <p>Num of NO clicks: {noClickCount}</p>
                    </DebuggerModalView>
                    {showQuestion ? (
                        <div>
                            {currentQuestionIndex < (NUM_OF_PRACTICE_QUESTIONS - 1) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is practice round</span>}
                            <p>Please read the following question. Pick your best answer and keep it in mind.</p>
                            <p>{question.question}</p>
                            <ul>
                                {answers.map((answer, index) => (
                                    <li key={index}>{answer.option}. {answer.text}</li>
                                ))}
                            </ul>
                            <button onClick={this.handleNext}>I have an answer in my mind</button>
                        </div>
                    ) : (
                        <div>
                            {showConfirmation && (
                                <>
                                    {currentQuestionIndex <= (NUM_OF_PRACTICE_QUESTIONS - 1) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is practice round</span>}
                                    <p>Correct answer is: {correctAnswer}</p>
                                    <p>Is this the answer you had in mind?</p>
                                    <button onClick={() => this.handleConfirmation(true)}>Yes</button>
                                    <button onClick={() => this.handleConfirmation(false)}>No</button>
                                    <p>Note: you will receive a bonus only if you report "Yes"</p>
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
