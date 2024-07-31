import React, { useState } from 'react';
import sendGameResult from './sendGameResult';

const RealGameRound = ({ onAdd,onNext,signOfReward } ) => {
  const [step, setStep] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [real1, setReal1] = useState(true);
  const [real2, setReal2] = useState(false);
  const [real3, setReal3] = useState(false);
  const [realNewRound, setRealNewRound] = useState(false);
  const userId = 'user123'; // Example user ID, replace with actual user ID

  const handleNext = () => {
    
    if(realNewRound){
      setReal1(true)
      setReal2(false)
      setReal3(false)
    }
    else if(setReal1){
      setReal1(false)
      setReal2(true)
      setReal3(false)
    }
    else if(setReal2){
      setReal1(false)
      setReal2(false)
      setReal3(true)
    }
    else if(setReal3){
      setReal1(true)
      setReal2(false)
      setReal3(false)
      //setRealNewRound(true)
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
    //  sendGameResult(userId, 'practice', rollResult);
    }, 2000); // Show result after animation
  };

  const handleAnswer = (answer) => {
    console.log(`User answered: ${answer}`);
    setShowResult(false);
    setDiceRoll(null);
    setReal1(true)
    setReal2(false)
    setReal2(false)
    onAdd(answer)
    onNext(); // Proceed to the next round
  };

  return (
<div className="dice-roll-container">
      {real1 && (
        <div className="centered-text">
           <p>Think of one of the following numbers:<br/>1,2,3,4,5,6<br/>keep this number in your mind</p>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
      {real2 && (
        <div className="centered-text">
          {!rolling && !showResult && (
            <div>
              
              <button onClick={rollDice}>Real - Roll the dice</button>
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
              <p>Is this the number you had in mind? {diceRoll}</p>
              <button onClick={() => handleAnswer('Yes')}>Yes</button>
              <button onClick={() => handleAnswer('No')}>No</button>
              <br></br>
              <label>Note: you will recieve a {signOfReward}bonus only if you report "Yes"</label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealGameRound;
