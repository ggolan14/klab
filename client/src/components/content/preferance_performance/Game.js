import React, { useState } from 'react';
import { config } from './config/config';

const Trial = ({ type, onComplete }) => {
  const [greenResult, setGreenResult] = useState(null);
  const [blueResult, setBlueResult] = useState(null);

  const handleGreenButtonClick = () => {
    const value = Math.random() < 0.5 ? 0 : 3;
    setGreenResult(value);
  };

  const handleBlueButtonClick = () => {
    const value = Math.random() < 0.5 ? 0 : 5;
    setBlueResult(value);
  };

  return (
    <div>
      <h3>{type}</h3>
      <button
        onClick={handleGreenButtonClick}
        style={{ backgroundColor: 'green', color: 'white', margin: '10px', padding: '10px' }}
      >
        Green Button
      </button>
      <label>{greenResult !== null && `Result: ${greenResult}`}</label>
      <br />
      <button
        onClick={handleBlueButtonClick}
        style={{ backgroundColor: 'blue', color: 'white', margin: '10px', padding: '10px' }}
      >
        Blue Button
      </button>
      <label>{greenResult !== null && `Result: ${blueResult}`}</label>
      <br />
      <button onClick={onComplete} style={{ marginTop: '20px' }}>
        Next Trial
      </button>
    </div>
  );
};

const Block = ({ type, numberOfTrials, onComplete }) => {
  const [currentTrial, setCurrentTrial] = useState(0);

  const handleTrialComplete = () => {
    if (currentTrial < numberOfTrials - 1) {
      setCurrentTrial(currentTrial + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div>
      
      <Trial type={`${type} Trial ${currentTrial + 1}`} onComplete={handleTrialComplete} />
    </div>
  );
};

const Game = () => {
  const { X_1, X_2, Y_1, Y_2 } = config;
  const [currentShortBlock, setCurrentShortBlock] = useState(0);
  const [currentLongBlock, setCurrentLongBlock] = useState(0);
  const [isPlayingShortBlock, setIsPlayingShortBlock] = useState(true);
  //const [isPlayingShortBlock, setIsPlayingShortBlock] = useState(() => Math.random() >= 0.5);

  const handleBlockComplete = () => {
    if (isPlayingShortBlock) {
      if (currentShortBlock < X_1 - 1) {
        setCurrentShortBlock(currentShortBlock + 1);
        setIsPlayingShortBlock(false);
      } else if (currentLongBlock < X_2) {
        setIsPlayingShortBlock(false);
      }
    } else {
      if (currentLongBlock < X_2 - 1) {
        setCurrentLongBlock(currentLongBlock + 1);
        setIsPlayingShortBlock(true);
      } else if (currentShortBlock < X_1) {
        setIsPlayingShortBlock(true);
      }
    }
  };

  return (
    <div>
      <h1>Preferance Performance</h1>
      <br/>
      <br/>
      {isPlayingShortBlock && currentShortBlock < X_1 ? (
        <Block
          type={`ShortBlock ${currentShortBlock + 1}`}
          numberOfTrials={Y_1}
          onComplete={handleBlockComplete}
        />
      ) : (
        currentLongBlock < X_2 && (
          <Block
            type={`LongBlock ${currentLongBlock + 1}`}
            numberOfTrials={Y_2}
            onComplete={handleBlockComplete}
          />
        )
      )}
      {currentShortBlock >= X_1 && currentLongBlock >= X_2 && <h2>Game Completed!</h2>}
    </div>
  );
};

export default Game;
