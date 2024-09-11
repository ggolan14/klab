import React, { Component } from 'react';
import './gameStyles.css';
import questions from './food_questions.json'; // Import the questions

let GameCondition="Unknown"
let NUM_OF_QUESTIONS=null;

class FoodPreference extends Component {
  constructor(props) {
    super(props);
    GameCondition=props.GameCondition;
    if(GameCondition=="Repeated"){
      questions.splice(0, questions.length - 1);
    }
    NUM_OF_QUESTIONS = questions.length

    this.state = {
      answers: {}, // Store the selected answers
      currentQuestionIndex: 0
    };

    console.log("**** "+GameCondition)
  }

  handleAnswerSelection = (questionIndex, answerIndex) => {
    const { answers } = this.state;
    this.setState({
      answers: {
        ...answers,
        [questionIndex]: answerIndex
      }
    });
  };

  insertLine = () => {
    // Implement function to save data to database
    // Example: insert data into your database
    const { currentQuestionIndex, answers } = this.state;
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestionIndex]+1;
    if((currentQuestionIndex===answers.length) || typeof answer == 'undefined' || answer === null)
      return;
    console.log("---> answer="+answer)
    // Here you can use any method to save data to your database

    const db_row = {
        QuestionIndex: currentQuestionIndex,  // total 
        QuestionType:"FoodPreference",
        Answer: answer,
        Keyword: "N/A",
        TotalYesAnswers: "N/A",
        TotalNoAnswers: "N/A",
        GameCondition: GameCondition,
        HaveAnAnswerTime:"N/A",
        ConfirmationTime:"N/A",
      };
      this.props.insertGameLine(db_row);
      console.log(`Saving to database: Question - ${currentQuestion.question}, Answer - ${answer}`);
console.log("------> currentQuestionIndex="+currentQuestionIndex +"  NUM_OF_QUESTIONS ="+NUM_OF_QUESTIONS)
      if(currentQuestionIndex==NUM_OF_QUESTIONS-1){
        this.props.sendDataToDB(true);
      }
  };

  handleNextQuestion = () => {
    const { currentQuestionIndex } = this.state;
    this.insertLine(); // Call insertLine before moving to the next question
    if (currentQuestionIndex === questions.length - 1) {
      // Submit the survey if it's the last question
      this.handleSubmitSurvey();
    } else {
      // Move to the next question
      this.setState((prevState) => ({
        currentQuestionIndex: prevState.currentQuestionIndex + 1
      }));
    }
  };

  handleSubmitSurvey = () => {
    // Submit the survey (e.g., save to database)
    console.log('Survey submitted');
  };

  render() {
    const { currentQuestionIndex, answers } = this.state;
    const currentQuestion = questions[currentQuestionIndex];
    const isNextDisabled = typeof answers[currentQuestionIndex] === 'undefined';
  
    return (
      <div className="trivia-container">
        <h3>{currentQuestion.question}</h3>
        <ul>
          {currentQuestion.choices.map((choice, index) => (
            <li key={index}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="radio"
                name="choice"
                value={index}
                checked={this.state.answers[currentQuestionIndex] === index}
                onChange={() => this.handleAnswerSelection(currentQuestionIndex, index)}
                style={{ marginRight: '10px' }} // Adjust the spacing as needed
              />
              {choice}
            </label>
          </li>
          ))}
        </ul>
        <button onClick={this.handleNextQuestion} disabled={isNextDisabled}>
          {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    );
  }
}

export default FoodPreference;
