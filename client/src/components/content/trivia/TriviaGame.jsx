import React, { Component } from 'react';

class TriviaGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestionIndex: 0,
      score: 0,
      showConfirmation: false,
      selectedAnswer: null
    };
  }

  handleNextQuestion = () => {
    const { currentQuestionIndex } = this.state;
    const { questions } = this.props;

    if (currentQuestionIndex < questions.length - 1) {
      this.setState({ showConfirmation: true });
    } else {
      // User has answered all questions, handle end of game
      this.handleEndOfGame();
    }
  };

  handleAnswer = (answer) => {
    this.setState({ selectedAnswer: answer });
  };

  handleConfirmAnswer = (isConfirmed) => {
    const { currentQuestionIndex, selectedAnswer } = this.state;
    const { questions } = this.props;

    if (isConfirmed && selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      this.setState((prevState) => ({
        score: prevState.score + 1,
        showConfirmation: false,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        selectedAnswer: null
      }));
    } else {
      // Handle incorrect answer or cancellation of confirmation
      this.setState({
        showConfirmation: false,
        selectedAnswer: null
      });
    }
  };

  handleEndOfGame = () => {
    // Logic to handle end of game, such as displaying final score
  };

  render() {
    const { currentQuestionIndex, score, showConfirmation, selectedAnswer } = this.state;
    const { questions, isPracticeMode } = this.props;
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div>
        <h2>Question {currentQuestionIndex + 1}</h2>
        <p>{currentQuestion.question}</p>
        <ul>
          {currentQuestion.answers.map((answer, index) => (
            <li key={index} onClick={() => this.handleAnswer(answer.option)}>
              {answer.text}
            </li>
          ))}
        </ul>
        {showConfirmation && (
          <div>
            <p>{isPracticeMode ? "Are you sure you want to continue to the next question?" : "Is this your final answer?"}</p>
            {selectedAnswer && (
              <p>Selected answer: {selectedAnswer}</p>
            )}
            <button onClick={() => this.handleConfirmAnswer(true)}>Yes</button>
            <button onClick={() => this.handleConfirmAnswer(false)}>No</button>
          </div>
        )}
        {!showConfirmation && (
          <button onClick={this.handleNextQuestion}>{isPracticeMode ? "Continue to next question" : "Next question"}</button>
        )}
      </div>
    );
  }
}

export default TriviaGame;
