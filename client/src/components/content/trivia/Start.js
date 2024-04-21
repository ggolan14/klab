import React, { Component } from 'react';
import './gameStyles.css';
import trivia_questions from './trivia_questions.json';
import practice_questions from './practice_questions.json';
import {getTimeDate} from "../../../utils/app_utils";
import {NewLogs} from "../../../actions/logger";
import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";
import TriviaIntroduction from './TriviaIntroduction';
import { number } from 'prop-types';
const ThisExperiment = 'Trivia';



let UserId = 'empty';
let RunningName = '-';
let StartTime = null;
let GAME_POINTS = 0;
let SUM_OF_CUPS = 0;
let GameSet = {};
let PaymentsSettings = null;
let GameCondition = null;
let NUM_OF_PRACTICE_QUESTIONS=4;
let lastIndex;


/*
const ResetAll = () => {
  UserId = 'empty';
  RunningName = '-';
  StartTime = null;
  GameSet = {};
  PaymentsSettings = null;
  GAME_POINTS = 0;
  SUM_OF_CUPS = 0;
  GameCondition = null;
};
*/

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
      //lastIndex: 0,
      gameCondition:GameCondition,
      hideMessages: false,
      
    };
  }
  handleHideMessages = () => {
    console.log("--------------------------------------> handleHideMessages")
    this.setState({ hideMessages: true });
  }
  handleNext = () => {
    //console.log("---> I have an answer was clicked")
    const { currentQuestionIndex, practiceMode,gameCondition ,isLast } = this.state;
    console.log("@@@@@ in handleNext currentQuestionIndex="+currentQuestionIndex)
    let questions = [];
    questions = trivia_questions;
    
    console.log("++++++ currentQuestionIndex="+currentQuestionIndex+"   lastIndex="+lastIndex +"   isLast="+isLast)
    
      const correctAnswer = questions[currentQuestionIndex].answers.find(answer => answer.option === questions[currentQuestionIndex].correct_answer).text;
      // Increment the index to show the next question
      this.setState(prevState => ({
        currentQuestionIndex: Math.min(prevState.currentQuestionIndex + 1, lastIndex),
        showConfirmation: true,
        correctAnswer: correctAnswer,
        showQuestion: false,
        showConfirmation:true
      }));
    
      


     // if (!practiceMode) {
       
     // }
      
 ///   }
  };
 

  handleConfirmation = (confirmed) => {
   // console.log("-------> ####  this.state.yesCount="+this.state.yesClickCount+ "  this.state.noCount="+this.state.noClickCount )
    
    const { currentQuestionIndex, showConfirmation,  showQuestion, gameCondition,hideMessages} = this.state;
    console.log("######## in handleConfirmation currentQuestionIndex="+currentQuestionIndex+"  lastIndex")
    
  

    if (currentQuestionIndex+1 == lastIndex) {
      console.log("---> in handleNext setting isLast to true");
      this.setState(prevState => ({
        isLast: true,
        showConfirmation: false,
        showQuestion: false,
        //currentQuestionIndex: 0 // Reset to the first question of trivia mode
     }));
    }

    if (confirmed) {
      this.setState(prevState => ({
        showResult: false,
        yesClickCount: prevState.yesClickCount + 1,
        showQuestion: currentQuestionIndex != lastIndex,
        showConfirmation:false,
      }), () => {
        const db_row = {
          NumOfYesAnswers: this.state.yesClickCount,
          NumOfNoAnswers: this.state.noClickCount,
          GameCondition: GameCondition,
        };
        console.log("---> currentQuestionIndex="+currentQuestionIndex + "  NUM_OF_PRACTICE_QUESTIONS="+NUM_OF_PRACTICE_QUESTIONS)
        
        if(currentQuestionIndex >= NUM_OF_PRACTICE_QUESTIONS){
          this.insertGameLine(true, this.state.yesClickCount, this.state.noClickCount,db_row);
          this.sendDataToDB(currentQuestionIndex);
        }
      });
    
    } else {
      this.setState(prevState => ({
        showResult: false,
        noClickCount: prevState.noClickCount + 1,
        showQuestion: currentQuestionIndex != lastIndex,
        showConfirmation:false,
      }), () => {
        const db_row = {
        NumOfNoAnswers: this.state.noClickCount,
        GameCondition: GameCondition      
      };
      console.log("---> db_row.noCount="+db_row.noClickCount)
        
        if(currentQuestionIndex >= NUM_OF_PRACTICE_QUESTIONS){
          this.insertGameLine(false, this.state.yesClickCount, this.state.noClickCount,db_row);
          this.sendDataToDB(currentQuestionIndex);
        }
      });
    }
   
   }
  
  insertGameLine = (confirmed, yesClickCount, noClickCount,db_row) => {
     console.log("%%%%  in insertGameLine()")
 //    console.log(`User selected ${confirmed ? 'Yes' : 'No'}`);
 //   console.log(`Yes count: ${yesClickCount}, No count: ${noClickCount}`);
     // Call insertGameLine with updated db_row
     this.props.insertGameLine(db_row);
  }

  sendDataToDB = (currentQuestionIndex) => {
   // const { currentQuestionIndex2} = this.state;
    console.log("********  in sendDataToDB() lastIndex="+lastIndex+ "  currentQuestionIndex="+currentQuestionIndex)
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
  const { currentQuestionIndex, showConfirmation, correctAnswer, showResult, showQuestion, yesClickCount, practiceMode, gameCondition,hideMessages,isLast} = this.state;
  console.log("$$$$$$$$ in render   currentQuestionIndex="+currentQuestionIndex +"   showConfirmation="+showConfirmation +"   correctAnswer="+correctAnswer +"   showResult="+showResult +"   showQuestion="+showQuestion +"   yesClickCount="+yesClickCount+"    practiceMode="+practiceMode+"   isLast="+isLast)
  let questions = trivia_questions;
  const question = questions[currentQuestionIndex];
  const { answers } = question;

  return (
    <div className="trivia-container">
      {/* Conditionally render TriviaIntroduction or the previous behavior */}
      {!hideMessages ? (
        <TriviaIntroduction onHideMessages={this.handleHideMessages} />
      ) : (
        // Add your previous return behavior here
         <div>
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
          <DebuggerModalView>
            <p>Current Question Index: {currentQuestionIndex+1}</p>
            <p>Game mode: {gameCondition}</p>
            <p>Is in practice: {practiceMode==true?"Yes":"No"}</p>
          </DebuggerModalView> 
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
