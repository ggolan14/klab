import React, { useState } from 'react';

const MathQuestion = ({ onAnswer }) => {
  const correctAnswer = 7;
  const [selectedOption, setSelectedOption] = useState(null);
  const [showQuestion, setShowQuestion] = useState(true); // State to control whether to show the question

  const handleAnswerChange = (event) => {
    setSelectedOption(parseInt(event.target.value)); // Update selected option
  };

  const handleSubmit = () => {
    if (selectedOption !== null) { // dummy comment
      const isCorrect = selectedOption === correctAnswer;
      onAnswer(isCorrect);
      
      if (!isCorrect) {
        setShowQuestion(false); // Hide the question if the answer is incorrect
      }
    }
  };

  return (
    <div>
      {showQuestion ? (
        <>
          <h3>The sum of 5 plus 2 is:</h3>
          <form>
            {[5, 8, 7, 10, 52, 9].map((option, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <label>
                  <input
                    type="radio"
                    name="mathAnswer"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleAnswerChange}
                  />
                  {option}
                </label>
              </div>
            ))}
            <button type="button" onClick={handleSubmit}>
              Next
            </button>
          </form>
        </>
      ) : (
        <>
        <h1 style={{ color: 'red' }}>Verification failed</h1>
        <p>We are sorry.<br></br>You are not eligible to take part in this study.<br></br> Thank you!
        </p>
        </>
      )}
    </div>
  );
};

export default MathQuestion;
