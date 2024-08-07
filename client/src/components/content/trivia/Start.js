import React, { Component } from 'react';
import './gameStyles.css';
import trivia_questions from './trivia_questions.json';
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
import TriviaIntroduction from './TriviaIntroduction';
import FoodPreference from './FoodPreference';
const ThisExperiment = 'Trivia';



let UserId = 'empty';
let RunningName = '-';
let GameCondition = null;
let NUM_OF_PRACTICE_QUESTIONS = 4;
let lastIndex;
let startShowQuestionTimer = 0;
let endShowQuestionTimer = 0;
let startShowConfirmationTimer = 0;
let endShowConfirmationTimer = 0;
let totalShowQuestionTime = 0;
let totalShowConfirmationTime = 0;
const yesButtonInRight = Math.random() < 0.5;


class Start extends Component {
  constructor(props) {
    super(props);
    this.TotalBonus = [];
    let RunCounter = KeyTableID();
    let cond = props.game_settings.game.cond;
    this.Forward = this.Forward.bind(this);
    this.PaymentsSettings = props.game_settings.payments;

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
      if (RunCounter % 2)
        GameCondition = 'OneShot';
      else
        GameCondition = 'Repeated';
    }

    //set lastIndex according to GameCondition . 
    if (GameCondition == "OneShot") {
      lastIndex = 4;  // 3 practice questions + 1 trivia questions
    } else {
      lastIndex = 43; // 3 practice questions + 40 trivia questions
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
      gameCondition: GameCondition,
      hideMessages: false,
      practiceIsOver: false,
      hideTriviaCompleted: false,
      showWelcomeToFoodPreference: false,
      userAnswers: {},

    };
  }

  addRecord = (questionIndex, value) => {
    const { userAnswers } = this.state;
    this.setState(prevState => ({
      userAnswers: {
        ...prevState.userAnswers,
        [questionIndex]: value
      }
    }));
  };

  handleHideMessages = () => {
    this.setState({ hideMessages: true });
  }

  handelHideTriviaCompleted = () => {
    this.setState({ hideTriviaCompleted: true, showWelcomeToFoodPreference: true });
  }

  handelHideWelcomeToFoodPreference = () => {
    this.setState({ showWelcomeToFoodPreference: false });
  }

  handleHidePracticeIsOver = () => {
    this.setState({ practiceIsOver: true });
  }

  handleNext = () => {
    const { currentQuestionIndex } = this.state;
    let questions = [];
    questions = trivia_questions;
    const correctAnswer = questions[currentQuestionIndex].answers.find(answer => answer.option === questions[currentQuestionIndex].correct_answer).text;
    endShowQuestionTimer = getTimeDate().now;
    startShowConfirmationTimer = getTimeDate().now;
    totalShowQuestionTime = endShowQuestionTimer - startShowQuestionTimer;
    this.setState(prevState => ({
      currentQuestionIndex: Math.min(prevState.currentQuestionIndex + 1, lastIndex),
      correctAnswer: correctAnswer,
      showQuestion: false,
      showConfirmation: true,
    }));
  };


  handleConfirmation = (confirmed) => {
    const { currentQuestionIndex, showConfirmation, showQuestion, gameCondition, hideMessages } = this.state;
    endShowConfirmationTimer = getTimeDate().now;
    totalShowConfirmationTime = endShowConfirmationTimer - startShowConfirmationTimer;

    if (currentQuestionIndex + 1 == lastIndex) {
      endShowQuestionTimer = getTimeDate().now;
      this.setState(prevState => (
        {
          isLast: true,
          showConfirmation: false,
          showQuestion: false,
        }), () => {

        });
    }

    if (confirmed) {
      startShowQuestionTimer = getTimeDate().now;
        this.setState(prevState => (
        {
          showResult: false,
          yesClickCount: currentQuestionIndex > (NUM_OF_PRACTICE_QUESTIONS - 1) ? prevState.yesClickCount + 1 : prevState.yesClickCount,
          showQuestion: currentQuestionIndex != lastIndex,
          showConfirmation: false,
        }), () => {
          const db_row = {
            QuestionIndex: currentQuestionIndex,  // total 
            QuestionType: currentQuestionIndex < NUM_OF_PRACTICE_QUESTIONS ? "Practice" : "Trivia",
            Answer: 1,
            TotalYesAnswers: this.state.yesClickCount,
            TotalNoAnswers: this.state.noClickCount,
            GameCondition: GameCondition,
            HaveAnAnswerTime: totalShowQuestionTime,
            ConfirmationTime: totalShowConfirmationTime,
            Game: "Trivia",
           
          };

          
          this.addRecord(currentQuestionIndex, confirmed ? 'Yes' : 'No');
          this.insertGameLine(db_row);
          this.sendDataToDB(false);
         

        });
    } else {
      startShowQuestionTimer = getTimeDate().now;
      this.setState(prevState => ({
        showResult: false,
        noClickCount: prevState.noClickCount + 1,
        showQuestion: currentQuestionIndex != lastIndex,
        showConfirmation: false,
      }), () => {
        const db_row = {
          QuestionIndex: currentQuestionIndex,
          QuestionType: currentQuestionIndex < NUM_OF_PRACTICE_QUESTIONS ? "Practice" : "Trivia",
          Answer: 0,
          TotalYesAnswers: this.state.yesClickCount,
          TotalNoAnswers: this.state.noClickCount,
          GameCondition: GameCondition,
          HaveAnAnswerTime: totalShowQuestionTime,
          ConfirmationTime: totalShowConfirmationTime,

        };
        this.addRecord(currentQuestionIndex, confirmed ? 'Yes' : 'No');
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
          var total_bonus = result.selectedQuestionPoints;
          var randomSelectedQuestion = result.randomSelectedQuestion;

          this.PaymentsSettings.total_bonus = total_bonus;
          this.PaymentsSettings.randomSelectedQuestion = randomSelectedQuestion;

          this.props.insertPayment({
            exchange_ratio: this.PaymentsSettings.exchange_ratio,
            bonus_endowment: this.PaymentsSettings.bonus_endowment,
            show_up_fee: this.PaymentsSettings.show_up_fee,
            sign_of_reward: this.PaymentsSettings.sign_of_reward,
            random_question_Index: this.PaymentsSettings.randomSelectedQuestion,
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

  addGameBonus(game_data) {
    const { userAnswers } = this.state;

    const keys = Object.keys(this.state.userAnswers);
    keys.forEach(key => { console.log(`keys Key: ${key}, Value: ${this.state.userAnswers[key]}`); });
    /*
      if GameCondition is OneShot , the selected question will be the trivia question that
      the user answer (question #4 need to ignore practice questions) otherwise need to pick 
      random question between 1 and 40
    */

    const randomIndex = GameCondition == "OneShot" ? 4 : Math.floor(Math.random() * (43 - 3 + 1)) + 3;
    const randomSelectedQuestion = keys[randomIndex - 1];
    const randomSelectedQuestionValue = this.state.userAnswers[randomSelectedQuestion];
    var selectedQuestionPoints = randomSelectedQuestionValue == 'Yes' ? 1 : 0;
    console.log("-------------> in addGameBonus selectedQuestion=" + randomSelectedQuestion + "   selectedQuestionPoints=" + selectedQuestionPoints);
    this.TotalBonus.push(selectedQuestionPoints);
    return {
      selectedQuestionPoints: selectedQuestionPoints,
      randomSelectedQuestion: randomSelectedQuestion
    };
  }

  render() {
    const { currentQuestionIndex, showConfirmation, correctAnswer, hideTriviaCompleted, showWelcomeToFoodPreference,
      showQuestion, yesClickCount, noClickCount, practiceMode, gameCondition,
      hideMessages, practiceIsOver } = this.state;
    let questions = trivia_questions;
    const question = questions[currentQuestionIndex];
    const { answers } = question;

    // Declare a variable to hold the JSX for FoodPreference
    let foodPreferenceComponent = null;
    // Check if currentQuestionIndex is equal to 3
    const oneShotLast = GameCondition == "OneShot" && !showConfirmation && currentQuestionIndex == NUM_OF_PRACTICE_QUESTIONS;
    const repeatedLast = GameCondition == "Repeated" && !showConfirmation && currentQuestionIndex === questions.length - 1;
    if (oneShotLast || repeatedLast) {
      if (!hideTriviaCompleted) {
        return (
          <div className="practice-is-over">
            <h3>You completed the “trivia game”</h3>
            <p>
              You will now receive a food preference survey. <br></br>
              Note that you cannot leave or stop responding until you have completed the entire study and <br></br>
              have received your completion code, or else you will not receive compensation.
            </p>
            <button onClick={this.handelHideTriviaCompleted}>Next</button>
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
    if (GameCondition == "OneShot" && currentQuestionIndex === NUM_OF_PRACTICE_QUESTIONS - 1 && !practiceIsOver && !showConfirmation) {
      return (
        <div className="practice-is-over">
          <h3>Practice is Over</h3>
          <p>
            You will now play the trivia game for real bonus.<br></br>
            You will play one round of the trivia game.<br></br>
            Remember: If the correct answer is the one you had in mind, you will receive a £1 bonus!
          </p>
          <button onClick={this.handleHidePracticeIsOver}>Next</button>
        </div>
      )
    }
    if (GameCondition == "Repeated" && currentQuestionIndex === NUM_OF_PRACTICE_QUESTIONS - 1 && !practiceIsOver && !showConfirmation) {
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
                {currentQuestionIndex < (NUM_OF_PRACTICE_QUESTIONS - 1) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>}
                <p>Please read the following question. Pick your best answer and keep it in mind.</p>
                <p>{question.question}</p>
                <ul>
                  {answers.map((answer, index) => (
                    <li key={index}>{answer.text}</li>
                  ))}
                </ul>
                <button onClick={this.handleNext}>I have an answer in my mind</button>
              </div>
            ) : (
              <div>
                {showConfirmation && (
                  <>
                    {currentQuestionIndex <= (NUM_OF_PRACTICE_QUESTIONS - 1) && <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>}
                    <p>Correct answer is: {correctAnswer}</p>
                    <p>Is this the answer you had in mind?</p>

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
