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
    wrongFeedback: "Incorrect. The green button is better in short rounds, of 18 steps or fewer,because it provides consistent rewards.",
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
    <div 
      className="quize-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "80vw",
        textAlign: "center",
        
       
      }}
    >
        
      <span><h1><b>Quiz</b></h1></span>
      <span><h2><b>Question {currentQuestion + 1}/{questions.length}</b></h2></span>
      <br></br>
      <div className="question-container" style={{ width: "100%", textAlign: "center", whiteSpace: "nowrap" , marginRight:"500px" }}>
        <span>
  <h3 style={{ display: "inline-block", whiteSpace: "nowrap" , textAlign:"center"}}>
    <b>
      {questions[currentQuestion].text.split(" ").map((word, index) =>
        (word === "long" || word === "short" || word === "cannot" )? <u key={index}> {word} </u> : ` ${word} `
        
      )}
    </b>
  </h3>
  </span>
  
</div>
  
<form className="options-container">
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
</form>

<div>
  <span
    className={isCorrect ? "correct-message" : "wrong-message"}
    style={{
      textAlign: "center",
      marginLeft: "50px",
      visibility: isCorrect !== null ? "visible" : "hidden",
      display: "inline-block",
      minHeight: "20px", // Adjust this value based on your design requirements
    }}
  >
    {isCorrect
      ? questions[currentQuestion].correctFeedback
      : questions[currentQuestion].wrongFeedback}
  </span>
</div>

      <br></br>
      <br></br>
      <div className="button-container">
      <button button className="shared-button"onClick={handleNext} disabled={isCorrect === null}>
        Submit
      </button>
      </div>
      <br/>
    </div>
  );
};

export default Quize;