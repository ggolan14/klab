/**
 * FoodPreference Component
 * 
 * This component renders a questionnaire about the user's food preferences. The user is presented with a series of 
 * multiple-choice questions, and their selections are saved to the database after each question. The component supports 
 * two modes: "Repeated" and "OneShot", with different numbers of questions depending on the mode.
 * 
 * The component handles:
 * 1. Rendering questions and choices from a JSON file (`food_questions.json`).
 * 2. Tracking and saving the user's answer for each question.
 * 3. Navigating between questions using a "Next" button.
 * 4. Inserting the user's answers into the database and submitting the survey when completed.
 * 
 * @param {Function} insertGameLine - Function to insert a row of data (question and answer) into the database.
 * @param {Function} sendDataToDB - Function to send the entire survey data to the database once completed.
 * @param {String} GameCondition - The condition of the game, either "Repeated" or "OneShot", which determines the number of questions.
 */
import React, { Component } from 'react';
import './gameStyles.css';
import questions from './food_questions.json'; // Import the food preference questions from a JSON file

// Global variables to track the game condition and number of questions
let GameCondition = "Unknown";
let NUM_OF_QUESTIONS = null;

class FoodPreference extends Component {
  constructor(props) {
    super(props);

    // Set the game condition based on the prop
    GameCondition = props.GameCondition;

    // If the game condition is "Repeated", only keep the last question
    if (GameCondition === "Repeated") {
      questions.splice(0, questions.length - 1); // Keep only the last question
    }

    // Set the total number of questions
    NUM_OF_QUESTIONS = questions.length;

    // Initialize the component's state
    this.state = {
      answers: {}, // Store the user's selected answers
      currentQuestionIndex: 0, // Track the current question being displayed
    };

    console.log("**** Game Condition: " + GameCondition);
  }

  /**
   * Handle the selection of an answer for the current question.
   * 
   * @param {Number} questionIndex - The index of the current question.
   * @param {Number} answerIndex - The index of the selected answer.
   */
  handleAnswerSelection = (questionIndex, answerIndex) => {
    const { answers } = this.state;

    // Update the answers state with the selected answer
    this.setState({
      answers: {
        ...answers,
        [questionIndex]: answerIndex, // Map question index to the selected answer index
      },
    });
  };

  /**
   * Insert the current question's data into the database.
   * This function is called before moving to the next question.
   */
  insertLine = () => {
    const { currentQuestionIndex, answers } = this.state;
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestionIndex] + 1; // Adjust for 0-based index

    // If no answer is provided or the last question has been reached, exit early
    if (typeof answer === 'undefined' || answer === null) return;

    // Create a row of data to insert into the database
    const db_row = {
      QuestionIndex: currentQuestionIndex,
      QuestionType: "FoodPreference",
      Answer: answer,
      Keyword: "N/A", // No specific keyword for this component
      TotalYesAnswers: "N/A",
      TotalNoAnswers: "N/A",
      GameCondition: GameCondition,
      HaveAnAnswerTime: "N/A", // Timing data could be inserted here
      ConfirmationTime: "N/A",  // Timing data could be inserted here
    };

    // Insert the row into the database
    this.props.insertGameLine(db_row);
    console.log(`Saving to database: Question - ${currentQuestion.question}, Answer - ${answer}`);

    // If it's the last question, send the data to the database
    if (currentQuestionIndex === NUM_OF_QUESTIONS - 1) {
      this.props.sendDataToDB(true);
    }
  };

  /**
   * Handle moving to the next question.
   * Inserts the current answer into the database and then moves to the next question.
   * If the user is on the last question, the survey is submitted.
   */
  handleNextQuestion = () => {
    const { currentQuestionIndex } = this.state;

    // Insert the current question's data before moving to the next one
    this.insertLine();

    // If this is the last question, submit the survey
    if (currentQuestionIndex === questions.length - 1) {
      this.handleSubmitSurvey();
    } else {
      // Move to the next question
      this.setState((prevState) => ({
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
      }));
    }
  };

  /**
   * Handle the survey submission.
   * Called when the user completes the last question.
   */
  handleSubmitSurvey = () => {
    console.log('Survey submitted');
    // Additional logic for final submission can be added here (e.g., showing a confirmation message).
  };

  render() {
    const { currentQuestionIndex, answers } = this.state;
    const currentQuestion = questions[currentQuestionIndex];

    // Disable the "Next" button if no answer is selected for the current question
    const isNextDisabled = typeof answers[currentQuestionIndex] === 'undefined';

    return (
      <div className="trivia-container">
        {/* Render the current question */}
        <h3>{currentQuestion.question}</h3>

        {/* Render the answer choices as radio buttons */}
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
                  style={{ marginRight: '10px' }} // Add some spacing between the radio button and label
                />
                {choice}
              </label>
            </li>
          ))}
        </ul>

        {/* Render the "Next" button, which is disabled if no answer is selected */}
        <button onClick={this.handleNextQuestion} disabled={isNextDisabled}>
          {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    );
  }
}

export default FoodPreference;
