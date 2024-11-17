import React, { useState, useEffect } from 'react';
import { DebuggerModalView } from "../../screens/gameHandle/game_handle";

// Trial component represents a single trial with green and blue button options
const Trial = ({ isGreenFirst, blockIndex, trialIndex, onComplete, gameConfig, totalTrialsInBlock, totalScoreInBlock, selectedGameIndex, props }) => {
  
  console.log("------------------->  Trial isGreenFirst="+isGreenFirst)

  
  
  // State variables to store the result for each button click
  const [greenResult, setGreenResult] = useState(null);
  const [blueResult, setBlueResult] = useState(null);

  // State to hold the game configuration
  const [gameGonfig, setGameConfig] = useState(null);

  // Get display time from props
  let displayTime = props.game_settings.game.display_time;

  // useEffect to initialize and add event listeners when the component mounts
  useEffect(() => {
    // Check if gameConfig exists and initialize game configuration state
    if (gameConfig) {
      setGameConfig({
        gameGonfig
      });
    }
    
    // Handle spacebar press to complete the trial
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        onComplete(greenResult || blueResult); // Pass result on spacebar press if any result exists
      }
    };
    
    // Add event listener for spacebar press
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onComplete, greenResult, blueResult]); // Dependencies to re-run useEffect

  // Handle click event for the green button
  const handleGreenButtonClick = () => {
    let prob = props.game_settings.game.type_1_probability;
    let score = props.game_settings.game.type_1_score;
    
    // Calculate result based on probability and score settings
    const result = Math.random() < (prob / 100) ? score : 0;
    setGreenResult(result); // Set the result for green button

    // Wait for displayTime seconds before calling onComplete
    setTimeout(() => {
      onComplete(result); // Pass green result to onComplete after timeout
    }, displayTime * 1000);
  };

  // Handle click event for the blue button
  const handleBlueButtonClick = () => {
    let prob = props.game_settings.game.type_2_probability;
    let score = props.game_settings.game.type_2_score;

    // Calculate result based on probability and score settings
    const result = Math.random() < (prob / 100) ? score : 0;
    setBlueResult(result); // Set the result for blue button

    // Wait for displayTime seconds before calling onComplete
    setTimeout(() => {
      onComplete(result); // Pass blue result to onComplete after timeout
    }, displayTime * 1000);
  };

  return (
    <div style={{ fontSize:'36px'}}>
      {/* Debugger view to show selected game and trial info */}
      <DebuggerModalView>
        <p>Selected game: {selectedGameIndex}</p>
        <p>Block: {blockIndex}</p>
        <p>Trial number: {trialIndex}</p>
      </DebuggerModalView>

      {/* Display current trial information */}
      <h1>
        Trial {trialIndex} out of {totalTrialsInBlock}
      </h1>

      {/* Render buttons based on the order specified by isGreenFirst */}
      {isGreenFirst ? (
        <>
          {/* Green button displayed first */}
          <button onClick={handleGreenButtonClick} className="button green-button">
            {greenResult === null ? "" : greenResult} {/* Display result if available */}
          </button>
          <button onClick={handleBlueButtonClick} className="button blue-button">
            {blueResult === null ? "" : blueResult} {/* Display result if available */}
          </button>
        </>
      ) : (
        <>
          {/* Blue button displayed first */}
          <button onClick={handleBlueButtonClick} className="button blue-button">
            {blueResult === null ? "" : blueResult} {/* Display result if available */}
          </button>
          <button onClick={handleGreenButtonClick} className="button green-button">
            {greenResult === null ? "" : greenResult} {/* Display result if available */}
          </button>
        </>
      )}
      <br/>Points scored in this block: {totalScoreInBlock}
    </div>
  );
};

export default Trial;
