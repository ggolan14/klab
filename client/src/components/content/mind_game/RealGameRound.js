import React, { useState } from 'react';
import sendGameResult from './sendGameResult';

const RealGameRound = ({ onNext }) => {
  const [step, setStep] = useState(1);
  const [diceRoll, setDiceRoll] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const userId = 'user123'; // Example user ID, replace with actual user ID

  const handleNext = () => {
    setStep(step + 1);
  };

  const rollDice = () => {
    setRolling(true);
    setTimeout(() => {
      const rollResult = Math.floor(Math.random() * 6) + 1;
      console.log("---> rollResult="+rollResult)
      setDiceRoll(rollResult);
      setRolling(false);
      setShowResult(true);
      sendGameResult(userId, 'real', rollResult);
    }, 2000); // Show result after animation
  };

  const handleAnswer = (answer) => {
    console.log(`User answered: ${answer}`);
    setShowResult(false);
    setDiceRoll(null);
    onNext(); // Proceed to the next round
  };

  return (
    <div className="dice-roll-container">
      {step === 1 && (
        <div className="centered-text">
          <p>This is a real round. Think of a number between 1 and 6 and keep it in your mind.</p>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div className="centered-text">
          {!rolling && !showResult && (
            <div>
              <button onClick={rollDice}>Roll the dice3</button>
            </div>
          )}
          {rolling && (
            <div className="dice-roll-animation">
              <div className="dice">
                <div className="dice-face face-1">1</div>
                <div className="dice-face face-2">2</div>
                <div className="dice-face face-3">3</div>
                <div className="dice-face face-4">4</div>
                <div className="dice-face face-5">5</div>
                <div className="dice-face face-6">6</div>
              </div>
            </div>
          )}
          {showResult && (
            <div>
              <p>Is this the number you thought about? {diceRoll}</p>
              <button onClick={() => handleAnswer('Yes')}>Yes</button>
              <button onClick={() => handleAnswer('No')}>No</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealGameRound;
