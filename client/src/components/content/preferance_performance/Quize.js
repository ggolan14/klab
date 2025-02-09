import React, { useState } from 'react';

const questions = [
  {
    text: "Which button is better on average in long rounds (19 trials or more)?",
    correctFeedback: "Correct!",
    wrongFeedback: "Incorrect. The blue button is better in long rounds, of 19 steps or more, where there are more chances for its rare big reward to occur",
    options: [
      " Both green and blue",
      " Green (75% chance to get +3)",
      " None of them",
      " Blue (10% chance to get +5)"
    ],
    correctIndex: 3
  },
  {
    text: "Which button is better on average in short rounds (18 trials or less)?",
    correctFeedback: "Correct!",
    wrongFeedback: "Incorrect. The green button is better in short rounds, of 18 steps or fewer, because it provides consistent rewards.",
    options: [
      " Both green and blue",
      " Green (75% chance to get +3)",
      " None of them",
      " Blue (10% chance to get +5)"
    ],
    correctIndex: 1
  },
  {
    text: "You clicked the green button and received +3. What can happen in the next step of the same round?",
    correctFeedback: "Correct!",
    wrongFeedback: "Incorrect. Once you receive the positive payoff from a button, that button will continue to provide the same payoff for all the remaining steps in that round.",
    options: [
      " You click the green button and receive +3",
      " You click the green button and receive 0",
      " Both options can happen",
      " None of the options can happen"
    ],
    correctIndex: 0
  },
  {
    text: "You clicked the blue button and received +5. What cannot happen in the next step of the same round?",
    correctFeedback: "Correct!",
    wrongFeedback: "Incorrect. Once you receive the positive payoff from a button, that button will continue to provide the same payoff for all the remaining steps in that round.",
    options: [
      " You click the green button and receive +3",
      " You click the green button and receive 0",
      " You click the blue button and receive 0",
      " You click the blue button and receive +5"
    ],
    correctIndex: 0
  }
];

const Quize = ({ insertLine, onComplete,selectedGame }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    setIsCorrect(index === questions[currentQuestion].correctIndex);
  };

  const handleNext = () => {
    insertLine({ question: questions[currentQuestion].text, answer: selectedAnswer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      onComplete(); // Proceed to the game after the last question
    }
  };

  return (
  <div className="quiz-container">
   

   <div style={{ alignItems: 'center', marginLeft:'400px'}}>
<h1 className="center-text"><b>Quiz</b></h1>
<h2 className="center-text"><b>Question {currentQuestion + 1}/{questions.length}</b></h2>
</div>
    <div className="question-container">
      <h3>
        <br></br>
        <b>
          {questions[currentQuestion].text.split(" ").map((word, index) =>
            ["long", "short", "cannot"].includes(word) ? (
              <u key={index}>{word} </u>
            ) : (
              `${word} `
            )
          )}
        </b>
      </h3>
    </div>
    <form className="options-container">
      {questions[currentQuestion].options.map((option, index) => (
        <label key={index} className="option-label">
          <input
            type="radio"
            name="quiz-option"
            value={index}
            checked={selectedAnswer === index}
            onChange={() => handleAnswerSelect(index)}
          />
          {option}
        </label>
      ))}
    </form>
    <div>
      <span
        className={isCorrect ? "correct-message" : "wrong-message"}
        style={{ visibility: isCorrect !== null ? "visible" : "hidden" }}
      >
        {isCorrect
          ? questions[currentQuestion].correctFeedback
          : questions[currentQuestion].wrongFeedback}
      </span>
    </div>
    <div className="button-container">
      <button
        className="shared-button"
        onClick={handleNext}
        disabled={isCorrect === null}
      >
        Submit
      </button>
    </div>
  </div>
);

};

export default Quize;