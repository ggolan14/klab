import React, { useState } from 'react';
import './DiceRoll.css';

function DiceRoll() {
  const [diceResult, setDiceResult] = useState(1);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    setRolling(true);
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      console.log("---> result")
      setRolling(false);
    }, 1000); // Animation duration
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Roll the Dice2</h1>
      <button onClick={rollDice} style={{ fontSize: '20px', padding: '10px 20px' }} disabled={rolling}>
        Roll
      </button>
      <div className={`dice ${rolling ? 'rolling' : ''} show-${diceResult}`}>
        <div className="face front">⚀</div>
        <div className="face back">⚅</div>
        <div className="face right">⚃</div>
        <div className="face left">⚂</div>
        <div className="face top">⚁</div>
        <div className="face bottom">⚄</div>
      </div>
    </div>
  );
}

export default DiceRoll;
