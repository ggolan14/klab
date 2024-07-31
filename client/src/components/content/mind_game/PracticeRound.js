import React, { useState } from 'react';
import sendGameResult from './sendGameResult';

const PracticeRound = ({ onAdd,onNext,signOfReward }) => {
  const [step, setStep] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [practice1, setPractice1] = useState(true);
  const [practice2, setPractice2] = useState(false);
  const [practice3, setPractice3] = useState(false);
  const [practiceNewRound, setPracticeNewRound] = useState(false);
  const userId = 'user123'; // Example user ID, replace with actual user ID

  const handleNext = () => {
    
    if(practiceNewRound){
      setPractice1(true)
      setPractice2(false)
      setPractice3(false)
    }
    else if(setPractice1){
      setPractice1(false)
      setPractice2(true)
      setPractice3(false)
    }
    else if(setPractice2){
      setPractice1(false)
      setPractice2(false)
      setPractice3(true)
    }
    else if(setPractice3){
      setPractice1(true)
      setPractice2(false)
      setPractice3(false)
      //setPracticeNewRound(true)
    }
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
      sendGameResult(userId, 'practice', rollResult);
    }, 2000); // Show result after animation
  };

  const handleAnswer = (answer) => {
    console.log(`User answered: ${answer}`);
    setShowResult(false);
    setDiceRoll(null);
    setPractice1(true)
    setPractice2(false)
    setPractice2(false)
    onAdd(answer)
    onNext(); // Proceed to the next round
  };

  return (
<div className="dice-roll-container">
      {practice1 && (
        <div className="centered-text">
          <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>
          <p>Think of one of the following numbers:<br/>1,2,3,4,5,6<br/>keep this number in your mind</p>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
      {practice2 && (
        <div className="centered-text">
          {!rolling && !showResult && (
            <div>
              <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>
              <br></br>
              <button onClick={rollDice}>Practice - Roll the dice</button>
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
              <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>
              <br></br>
              <p>Is this the number you had in mind? {diceRoll}</p>
              <button onClick={() => handleAnswer('Yes')}>Yes</button>
              <button onClick={() => handleAnswer('No')}>No</button>
              <br></br>
              <label>Note: you will recieve a {signOfReward}1 bonus only if you report "Yes"</label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeRound;
