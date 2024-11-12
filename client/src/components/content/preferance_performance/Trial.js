import React, { useEffect, useState } from 'react';
import { DebuggerModalView } from "../../screens/gameHandle/game_handle";

const Trial = ({ type, blockIndex, trialIndex, onComplete, gameConfig, totalTrialsInBlock, totalScoreInBlock,selectedGameIndex }) => {
  const [greenResult, setGreenResult] = useState(null);
  const [blueResult, setBlueResult] = useState(null);
  const [gameGonfig, setGameConfig] = useState(null);

  useEffect(() => {
    if (gameConfig) {
      setGameConfig({
        gameGonfig
      });
    }
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        onComplete(greenResult || blueResult); // Pass result on spacebar press if any result exists
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onComplete, greenResult, blueResult]);

  const handleGreenButtonClick = () => {
    const result = Math.random() < 0.75 ? 3 : 0; // 75% chance for +3 points
    setGreenResult(result);

    setTimeout(() => {
      onComplete(result); // Pass green result to onComplete after 2 seconds
    }, 2000);
  };

  const handleBlueButtonClick = () => {
    const result = Math.random() < 0.1 ? 5 : 0; // 10% chance for +5 points
    setBlueResult(result);

    setTimeout(() => {
      onComplete(result); // Pass blue result to onComplete after 2 seconds
    }, 2000);
  };

  return (
    <div>
      <DebuggerModalView>
        <p>Selected game: {selectedGameIndex}</p>
        <p>Block: {blockIndex}</p>
        <p>Trial number: {trialIndex}</p>
      </DebuggerModalView>
      <h4>
        Trial {trialIndex} out of {totalTrialsInBlock}
      </h4>
      
      <button onClick={handleGreenButtonClick} style={{minHeight:'50px', minWidth:'100px' , backgroundColor: 'green', color: 'white', margin: '5px', padding: '10px' }}>
        {greenResult === null ? "" : greenResult} {/* Conditional text display */}
      </button>
      
      <button onClick={handleBlueButtonClick} style={{ minHeight:'50px',minWidth:'100px' ,backgroundColor: '#4da6ff', color: 'white', margin: '5px', padding: '10px' }}>
        {blueResult === null ? "" : blueResult}
      </button>
      
      <br />
      Points scored in this block: {totalScoreInBlock}
      
      <br />
      <button onClick={() => onComplete(greenResult || blueResult)} style={{ marginTop: '20px' }}>Next Trial</button>
    </div>
  );
};

export default Trial;
