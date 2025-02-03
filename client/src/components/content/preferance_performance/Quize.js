import React, { useState } from 'react';

const questions = [
  {
    text: "Which button is better on average in long rounds (19 trials or more)?",
    correctFeedback: "correctFeedback-1",
    wrongFeedback: "wrongFeedback-1",
    options: [
      " Both green and blue",
      " Green (75% chance to get +3)",
      " None of them",
      " Blue (10% chance to get +5)"
    ],
    correctIndex: 1
  },
  {
    text: "Which button is better on average in short rounds (18 trials or less)?",
    correctFeedback: "correctFeedback-2",
    wrongFeedback: "wrongFeedback-2",
    options: [
      " Both green and blue",
      " Green (75% chance to get +3)",
      " None of them",
      " Blue (10% chance to get +5)"
    ],
    correctIndex: 0
  },
  {
    text: "You clicked the green button and received +3. What can happen in the next step of the same round?",
    correctFeedback: "correctFeedback-3",
    wrongFeedback: "wrongFeedback-3",
    options: [
      " You click the green button and receive +3",
      " You click the green button and receive 0",
      " Both options can happen",
      " None of the options can happen"
    ],
    correctIndex: 1
  },
  {
    text: "You clicked the blue button and received +5. What cannot happen in the next step of the same round?",
    correctFeedback: "correctFeedback-4",
    wrongFeedback: "wrongFeedback-4",
    options: [
      " You click the green button and receive +3",
      " You click the green button and receive 0",
      " You click the blue button and receive 0",
      " You click the blue button and receive +5"
    ],
    correctIndex: 1
  }
];

const Quize = ({ insertLine, onComplete }) => {
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
    <div className="quize-container">
      <h3>{questions[currentQuestion].text}</h3>
      <form>
        {questions[currentQuestion].options.map((option, index) => (
          <div key={index}>
            <label className="option-label">
              <input
                type="radio"
                name="quiz-option"
                value={index}
                checked={selectedAnswer === index}
                onChange={() => handleAnswerSelect(index)}
              />
               {option}
            </label>
          </div>
        ))}
        <br></br>
      </form>
      {isCorrect !== null && (
        <p className={isCorrect ? "correct-message" : "wrong-message"}>
          {isCorrect ? questions[currentQuestion].correctFeedback : questions[currentQuestion].wrongFeedback}
        </p>
      )}
      <br/>
      <button onClick={handleNext} disabled={isCorrect === null}>
        Next
      </button>
    </div>
  );
};

export default Quize;