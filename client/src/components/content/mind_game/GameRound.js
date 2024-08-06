import React, { useState } from 'react';
import sendGameResult from './sendGameResult';

const GameRound = ({ isPractice,onAdd, onNext, signOfReward }) => {
  const [step, setStep] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [phase1, setPhase1] = useState(true);
  const [phase2, setPhase2] = useState(false);
  const [phase3, setPhase3] = useState(false);
  const [practiceNewRound, setPracticeNewRound] = useState(false);
  const [diceVisible, setDiceVisible] = useState(false); // New state for dice visibility
  const [finalTransform, setFinalTransform] = useState(''); // New state for final transform
  const userId = 'user123'; // Example user ID, replace with actual user ID

  const handleNext = () => {
    if (practiceNewRound) {
        
      setPhase1(true);
      setPhase2(false);
      setPhase3(false);
    } else if (phase1) {
        setDiceVisible(false)
      setPhase1(false);
      setPhase2(true);
      setPhase3(false);
    } else if (phase2) {
      setPhase1(false);
      setPhase2(false);
      setPhase3(true);
    } else if (phase3) {
      setPhase1(true);
      setPhase2(false);
      setPhase3(false);
    }
    setStep(step + 1);
  };

  const getTransformForFace = (face) => {
    console.log("=========>  face="+face)
    switch (face) {
      case 1:
        return 'rotateX(0deg) rotateY(0deg)';
      case 2:
        return 'rotateX(360deg) rotateY(270deg)';
      case 3:
        return 'rotateX(0deg) rotateY(180deg)';
      case 4:
        return 'rotateX(0deg) rotateY(90deg)';
      case 5:
        return 'rotateX(270deg) rotateY(360deg)';
      case 6:
        return 'rotateX(90deg) rotateY(360deg)';
      default:
        return 'rotateX(0deg) rotateY(0deg)';
    }
  };

  const rollDice = () => {
    setRolling(true);
    setDiceVisible(true); // Set dice visibility to true when rolling starts
    setTimeout(() => {
      const rollResult = Math.floor(Math.random() * 6) + 1;
      //const rollResult = 2;
      console.log("---> rollResult=" + rollResult);
      setDiceRoll(rollResult);
      setFinalTransform(getTransformForFace(rollResult)); // Set final transform based on roll result
      setRolling(false);
      setShowResult(true);
    }, 3000); // Show result after animation
  };

  const handleAnswer = (answer) => {
    console.log(`User answered: ${answer}`);
    setShowResult(false);
    setDiceRoll(null);
    setPhase1(true);
    setPhase2(false);
    setPhase3(false);
    onAdd(answer);
    onNext(); // Proceed to the next round
  };

  return (
    <div className="dice-roll-container">
      {isPractice && (
        <span style={{ fontWeight: 'bold', color: 'red' }}>This is a practice round</span>
      )}
      {phase1 && (
        <>
          <p>Think of one of the following numbers:<br />1,2,3,4,5,6<br />keep this number in your mind</p>
          <button onClick={handleNext}>Next</button>
        </>
      )}
      {phase2 && (
        <>
          {!rolling && !showResult && (
            <div>
              <button onClick={rollDice}>Roll the dice</button>
            </div>
          )}
          {diceVisible && (
            <div className="dice-roll-animation">
              <div className="dice" style={{ transform: rolling ? '' : finalTransform, animation: rolling ? 'roll 4s ease-in-out forwards' : 'none' }}>
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
              <br />
              <label>Note: you will receive a {signOfReward}1 bonus only if you report "Yes"</label>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameRound;
