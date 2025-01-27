import React, { Component } from 'react';
import foodQuestions from './food_questions.json';

class FoodPreference extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentQuestionIndex: 0, // Tracks the current question index
            answers: Array(foodQuestions.length + 1).fill(null), // Stores user answers, extra slot for open question
            showWelcomePage: true, // Controls whether the welcome page is displayed
            showOpenQuestion: false, // Controls visibility of open-ended question
            openAnswer: "" // Stores the user's open-ended response
        };
    }

    // Starts the survey by hiding the welcome page
    startSurvey = () => {
        this.setState({ showWelcomePage: false });
    };

    // Inserts the current question's answer into the database
    insertLine = () => {
        const { currentQuestionIndex, answers } = this.state;
        if (currentQuestionIndex >= answers.length || answers[currentQuestionIndex] === null) {
            return; // Ensures that only answered questions are inserted
        }

        const currentQuestion = foodQuestions[currentQuestionIndex];
        const answer = currentQuestionIndex < foodQuestions.length ? answers[currentQuestionIndex] + 1 : answers[currentQuestionIndex];

        console.log(`---> answer=${answer}`);

        // Constructs the database entry
        const db_row = {
            QuestionIndex: currentQuestionIndex,
            QuestionType: currentQuestionIndex < foodQuestions.length ? "FoodPreference" : "OpenEnded",
            Answer: answer,
            TotalYesAnswers: "N/A",
            TotalNoAnswers: "N/A",
            GameCondition: this.props.GameCondition,
            HaveAnAnswerTime: "N/A",
            ConfirmationTime: "N/A",
        };

        // Calls parent function to save the response in the database
        this.props.insertGameLine(db_row);
        console.log(`Saving to database: Question - ${currentQuestionIndex < foodQuestions.length ? currentQuestion.question : "Open Question"}, Answer - ${answer}`);
    };

    // Moves to the next question or shows the open-ended question
    handleNextQuestion = () => {
        this.insertLine(); // Save the current answer to the database

        this.setState((prevState) => {
            if (this.props.GameCondition === "Repeated" || prevState.currentQuestionIndex === foodQuestions.length - 1) {
                return { showOpenQuestion: true, currentQuestionIndex: foodQuestions.length }; // Show open-ended question
            }
            return { currentQuestionIndex: prevState.currentQuestionIndex + 1 }; // Move to the next question
        });
    };

    // Handles text input for the open-ended question
    handleOpenAnswerChange = (event) => {
        this.setState({ openAnswer: event.target.value });
    };

    // Submits the open-ended response and saves it to the database
    handleSubmitOpenQuestion = () => {
        const { openAnswer, answers } = this.state;
        const updatedAnswers = [...answers];
        updatedAnswers[foodQuestions.length] = openAnswer; // Save open answer

        this.setState({ answers: updatedAnswers }, () => {
            console.log(`Open question answer: ${this.state.openAnswer}`);
            this.insertLine(); // Save open question to DB
            this.props.sendGameDataToDB(true); // Notify parent component that survey is complete
            this.props.Forward(); // Navigate to the next step
        });
    };

    // Updates the selected answer for the current question
    handleAnswerSelection = (questionIndex, index) => {
        const newAnswers = [...this.state.answers];
        newAnswers[questionIndex] = index;
        this.setState({ answers: newAnswers });
    };

    render() {
        // Show welcome page initially
        if (this.state.showWelcomePage) {
            return (
                <div className="trivia-container">
                    <h2>Welcome to the food preference survey</h2>
                    <p>In this survey, you will be asked {this.props.GameCondition === "Repeated" ? 2 : 41} questions about your food preferences.<br />
                        Please answer the {this.props.GameCondition === "Repeated" ? 2 : 41} questions according to your actual preferences.
                    </p>
                    <button onClick={this.startSurvey}>Next</button>
                </div>
            );
        }

        // Show open-ended question when survey is complete
        if (this.state.showOpenQuestion) {
            return (
                <div className="trivia-container">
                    <h3>What is your favorite breakfast food?</h3>
                    <textarea
                        style={{ border: '1px solid #ccc' }}
                        value={this.state.openAnswer}
                        onChange={this.handleOpenAnswerChange}
                        rows="4"
                        cols="50"
                    />
                    <button onClick={this.handleSubmitOpenQuestion} disabled={!this.state.openAnswer.trim()}>Submit</button>
                </div>
            );
        }

        // Display current multiple-choice question
        const { currentQuestionIndex } = this.state;
        const currentQuestion = foodQuestions[currentQuestionIndex];
        const isNextDisabled = this.state.answers[currentQuestionIndex] === null;

        return (
            <div className="trivia-container">
                <h3>{currentQuestion.question}</h3>
                <ul>
                    {currentQuestion.choices.map((choice, index) => (
                        <li key={index}>
                            <label style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="radio"
                                    name={`choice_${currentQuestionIndex}`}
                                    value={index}
                                    checked={this.state.answers[currentQuestionIndex] === index}
                                    onChange={() => this.handleAnswerSelection(currentQuestionIndex, index)}
                                    style={{ marginRight: '10px' }}
                                />
                                {choice}
                            </label>
                        </li>
                    ))}
                </ul>
                <button onClick={this.handleNextQuestion} disabled={isNextDisabled}>
                    {currentQuestionIndex === foodQuestions.length - 1 ? 'Next' : 'Next'}
                </button>
            </div>
        );
    }
}

export default FoodPreference;
