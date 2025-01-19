import React, { Component } from 'react';
import foodQuestions from './food_questions.json';

class FoodPreference extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentQuestionIndex: 0,
            answers: Array(foodQuestions.length + 1).fill(null), // Extra slot for open question
            showWelcomePage: true,
            showOpenQuestion: false,
            openAnswer: ""
        };
    }

    startSurvey = () => {
        this.setState({ showWelcomePage: false });
    };

    insertLine = () => {
        const { currentQuestionIndex, answers } = this.state;
        if (currentQuestionIndex >= answers.length || answers[currentQuestionIndex] === null) {
            return;
        }

        const currentQuestion = foodQuestions[currentQuestionIndex];
        const answer = currentQuestionIndex < foodQuestions.length ? answers[currentQuestionIndex] + 1 : answers[currentQuestionIndex];

        console.log(`---> answer=${answer}`);

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

        this.props.insertGameLine(db_row);
        console.log(`Saving to database: Question - ${currentQuestionIndex < foodQuestions.length ? currentQuestion.question : "Open Question"}, Answer - ${answer}`);
    };

    handleNextQuestion = () => {
        this.insertLine();

        this.setState((prevState) => {
            if (this.props.GameCondition === "Repeated" || prevState.currentQuestionIndex === foodQuestions.length - 1) {
                return { showOpenQuestion: true, currentQuestionIndex: foodQuestions.length };
            }
            return { currentQuestionIndex: prevState.currentQuestionIndex + 1 };
        });
    };

    handleOpenAnswerChange = (event) => {
        this.setState({ openAnswer: event.target.value });
    };

    handleSubmitOpenQuestion = () => {
        const { openAnswer, answers } = this.state;
        const updatedAnswers = [...answers];
        updatedAnswers[foodQuestions.length] = openAnswer; // Save open answer

        this.setState({ answers: updatedAnswers }, () => {
            console.log(`Open question answer: ${this.state.openAnswer}`);
            this.insertLine(); // Save open question to DB
            this.props.sendGameDataToDB(true);
            this.props.Forward();
        });
    };

    handleAnswerSelection = (questionIndex, index) => {
        const newAnswers = [...this.state.answers];
        newAnswers[questionIndex] = index;
        this.setState({ answers: newAnswers });
    };

    render() {
        if (this.state.showWelcomePage) {
            return (
                <div className="trivia-container">
                    <h2>Welcome to the food preference survey</h2>
                    <p>In this survey, you will be asked {this.props.GameCondition == "Repeated" ? 2 : 41} questions about your food preferences.<br />
                        Please answer the {this.props.GameCondition == "Repeated" ? 2 : 41} questions according to your actual preferences.
                    </p>
                    <button onClick={this.startSurvey}>Next</button>
                </div>
            );
        }

        if (this.state.showOpenQuestion) {
            return (
                <div className="trivia-container">
                    <h3>Please provide additional comments about your food preferences:</h3>
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
