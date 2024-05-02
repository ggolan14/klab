import React, { Component } from 'react';
import './gameStyles.css';
import trivia_questions from './trivia_questions.json';
import {getTimeDate} from "../../../utils/app_utils";
import {NewLogs} from "../../../actions/logger";
import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";
import TriviaIntroduction from './TriviaIntroduction';
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

class Start extends Component {
  constructor(props) {
    super(props);
    let RunCounter = KeyTableID();
    let cond = props.game_settings.game.cond;
    console.log("------> cond="+cond)

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
     
    };
  }
  handleHideMessages = () => {
    this.setState({ hideMessages: true });
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
          NumOfYesAnswers: this.state.yesClickCount,
          NumOfNoAnswers: this.state.noClickCount,
          GameCondition: GameCondition,
          HaveAnAnswerTime:totalShowQuestionTime,
          ConfirmationTime:totalShowConfirmationTime,
        };
        
        if(currentQuestionIndex >= NUM_OF_PRACTICE_QUESTIONS){
          this.insertGameLine(db_row);
          this.sendDataToDB(currentQuestionIndex);
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
          NumOfYesAnswers: this.state.yesClickCount,
          NumOfNoAnswers: this.state.noClickCount,
          GameCondition: GameCondition,
          HaveAnAnswerTime:totalShowQuestionTime,
          ConfirmationTime:totalShowConfirmationTime,
              
      };
       if(currentQuestionIndex >= NUM_OF_PRACTICE_QUESTIONS){
          this.insertGameLine(db_row);
          this.sendDataToDB(currentQuestionIndex);
        }
      });
    }
   
   }
  
  insertGameLine = (db_row) => {
      // console.log("%%%%  in insertGameLine()   NumOfNoAnswers="+db_row.NumOfNoAnswers+"    NumOfYesAnswers="+db_row.NumOfYesAnswers)
      this.props.insertGameLine(db_row);
  }

  sendDataToDB = (currentQuestionIndex) => {
   // console.log("********  in sendDataToDB() lastIndex="+lastIndex+ "  currentQuestionIndex="+currentQuestionIndex)
    const current_time = getTimeDate();
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
          if(currentQuestionIndex==lastIndex ){
            this.props.callbackFunction('FinishGame', { need_summary: true, args: summary_args });
          }
          
      }
  );

    
  }
  


render() {
  const { currentQuestionIndex, showConfirmation, correctAnswer, showResult, showQuestion, yesClickCount,noClickCount, practiceMode, gameCondition,hideMessages,isLast} = this.state;
  //console.log("$$$$$$$$ in render   currentQuestionIndex="+currentQuestionIndex +"   showConfirmation="+showConfirmation +"   correctAnswer="+correctAnswer +"   showResult="+showResult +"   showQuestion="+showQuestion +"   yesClickCount="+yesClickCount+"    practiceMode="+practiceMode+"   isLast="+isLast)
  let questions = trivia_questions;
  const question = questions[currentQuestionIndex];
  const { answers } = question;
  const date = new Date();

  return (
    <div className="trivia-container">
     
      {(!hideMessages) ? (
        <TriviaIntroduction onHideMessages={this.handleHideMessages} messageIndex={currentQuestionIndex} />
      ) : (
        // Add your previous return behavior here
         <div>
          <DebuggerModalView>
            <p>Current Question Index: {currentQuestionIndex+1}</p>
            <p>Game mode: {gameCondition}</p>
            <p>Is in practice: {practiceMode==true?"Yes":"No"}</p>
            <p>Num of YES clicks: {yesClickCount}</p>
            <p>Num of NO clicks: {noClickCount}</p>
          </DebuggerModalView> 
          {showQuestion ? (
            <div>
              {currentQuestionIndex < (NUM_OF_PRACTICE_QUESTIONS-1) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is practice round</span>}
              <p>Please read the following question. Pick your best answer and keep it in mind.</p>
              <p>{question.question}</p>
              <ul>
                {answers.map((answer, index) => (
                  <li key={index}>{answer.option}. {answer.text}</li>
                ))}
              </ul>
              {<button onClick={this.handleNext}>I have an answer in my mind</button>}
              
            </div>
      ) : (
            <div>
              {( showConfirmation)  && (
                <>
                  {currentQuestionIndex <= (NUM_OF_PRACTICE_QUESTIONS-1)  && <span style={{ fontWeight: 'bold', color: 'red' }}>This is practice round</span>}
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
