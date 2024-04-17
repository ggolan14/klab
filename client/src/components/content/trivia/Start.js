import React, { Component } from 'react';
import './gameStyles.css';
import trivia_questions from './trivia_questions.json';
import practice_questions from './practice_questions.json';
import {getTimeDate} from "../../../utils/app_utils";
import {NewLogs} from "../../../actions/logger";
import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";
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

    if (cond === 'o')
            GameCondition = 'OneShot';
        else if (cond === 'r')
            GameCondition = 'Repeated';
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
      practiceMode: true,
      isLast: false,
      gameCondition:GameCondition,
      
    };
  }

  handleNext = () => {
    console.log("---> I have an answer was clicked")
    const { currentQuestionIndex, practiceMode,gameCondition ,isLast} = this.state;
    let questions = [];
    questions = trivia_questions;
    console.log("---> questions.length="+questions.length + "  gameCondition="+gameCondition +"  currentQuestionIndex="+ currentQuestionIndex)
    var lastIndex=0;
    if(gameCondition === "OneShot"){
      console.log("----------> OneShot lastIndex="+lastIndex)
    lastIndex = 4;
    }
    else{
    lastIndex = questions.length-1;
    console.log("----------> Repeated lastIndex="+lastIndex)
    }
    console.log("---> in handleNext  practiceMode="+practiceMode+"  lastIndex="+lastIndex+ "  currentQuestionIndex="+currentQuestionIndex)

    // Check if it's the last question in practice mode
    console.log("---> Before in handleNext  currentQuestionIndex="+currentQuestionIndex)
    if (currentQuestionIndex == lastIndex+1) {
      console.log("---> in handleNext setting isLast to true");
      this.setState(prevState => ({
        isLast: true,
        showConfirmation: true,
        currentQuestionIndex: 0 // Reset to the first question of trivia mode
     }));
    } else {
      console.log("---> in handleNext 22222");
      const correctAnswer = questions[currentQuestionIndex].answers.find(answer => answer.option === questions[currentQuestionIndex].correct_answer).text;
      // Increment the index to show the next question
      this.setState(prevState => ({
        currentQuestionIndex: Math.min(prevState.currentQuestionIndex + 1, lastIndex),
        showConfirmation: true,
        correctAnswer: correctAnswer,
        showQuestion: false
      }));
      console.log("---> After in handleNext  currentQuestionIndex="+currentQuestionIndex)

      


     // if (!practiceMode) {
       
     // }
      
    }
  };

  handleConfirmation = (confirmed) => {
    
    const { yesClickCount, practiceMode,isLast,currentQuestionIndex,gameCondition } = this.state;
    console.log("#####> yes button was clicked NUM of clicks=" + yesClickCount+"    isLast="+isLast);
    //const updatedYesClickCount = confirmed ? yesClickCount + 1 : yesClickCount;
  if((gameCondition=="OneShot" && currentQuestionIndex==4)|| false){
  console.log("Before setState()  yesClickCount=" + yesClickCount + "   confirmed=" + confirmed);

  // Increment yesClickCount
  const updatedYesClickCount = confirmed ? yesClickCount + 1 : yesClickCount;

  // Update state and call insertGameLine in the setState callback
  this.setState(prevState => ({
      showResult: true,
      showConfirmation: false,
      yesClickCount: confirmed ? ((prevState.yesClickCount)+1) : prevState.yesClickCount
  }), () => {
      const db_row = {
          NumOfYesAnswers: updatedYesClickCount, // Use the updated count
          GameCondition: GameCondition,
      };
      // Call insertGameLine with updated db_row
      this.props.insertGameLine(db_row);

      // Call sendGameDataToDB after insertGameLine in the callback
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
              this.props.callbackFunction('FinishGame', { need_summary: true, args: summary_args });
          }
      );
  });
}
    if(practiceMode){
      this.setState(prevState => ({
        showConfirmation: false,
        showQuestion: true
      }));
      
    }
    
};


render() {
  const { currentQuestionIndex, showConfirmation, correctAnswer, showResult, showQuestion, yesClickCount, practiceMode, gameCondition} = this.state;
  console.log("---> in render   currentQuestionIndex="+currentQuestionIndex +"   showConfirmation="+showConfirmation +"   correctAnswer="+correctAnswer +"   showResult="+showResult +"   showQuestion="+showQuestion +"   yesClickCount="+yesClickCount+"    practiceMode="+practiceMode)
  let questions = trivia_questions;
  const question = questions[currentQuestionIndex];
  const { answers } = question;

  return (
    <div className="trivia-container">
      {showQuestion && (
        <div>
          {currentQuestionIndex < (NUM_OF_PRACTICE_QUESTIONS-1) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is practice round</span>}
          <p>Please read the following question. Pick your best answer and keep it in mind.</p>
          <p>{question.question}</p>
          <ul>
            {answers.map((answer, index) => (
              <li key={index}>{answer.option}. {answer.text}</li>
            ))}
          </ul>
          <DebuggerModalView>
            <p>Current Question Index: {currentQuestionIndex+1}</p>
            <p>Game mode: {gameCondition}</p>
            <p>Is in practice: {practiceMode==true?"Yes":"No"}</p>
          </DebuggerModalView> 
        </div>
      )}
      {showResult ? (
        <div>
          <h1><strong>You completed the trivia game</strong></h1>
          <p>You will now receive a food preference survey. Note that you cannot leave or stop responding until you have completed the entire study and have received your completion code, or else you will not receive compensation.</p>
          <p>Total "Yes" clicks: {yesClickCount}</p>
        </div>
      ) : (
        <div>
          {!showConfirmation && <button onClick={this.handleNext}>I have an answer in my mind</button>}
          {showConfirmation && (
            <div>
              {currentQuestionIndex <= (NUM_OF_PRACTICE_QUESTIONS-1)  && <span style={{ fontWeight: 'bold', color: 'red' }}>This is practice round</span>}
              <p>Correct answer is: {correctAnswer}</p>
              <p>Is this the answer you had in mind?</p>
              <button onClick={() => this.handleConfirmation(true)}>Yes</button>
              <button onClick={() => this.handleConfirmation(false)}>No</button>
              <p>Note: you will receive a bonus for participating!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

}

export default Start;
