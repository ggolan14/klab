import React, { useState, useEffect } from 'react';
import { DebuggerModalView } from "../../screens/gameHandle/game_handle";
import { getTimeDate } from "../../../utils/app_utils";
import { getTotalScore, setTotalScore, getGreenScore,setGreenScore,getBlueScore, setBlueScore} from './GlobalState';

// Trial component represents a single trial with green and blue button options
const Trial = ({ type, isGreenFirst, blockIndex, trialIndex, onComplete, gameConfig, totalTrialsInBlock, totalScoreInBlock, selectedGameIndex, props }) => {


  let startTimer = 0;
  let endTimer = 0;


  // State variables to store the result for each button click
  const [greenResult, setGreenResult] = useState(null);
  const [blueResult, setBlueResult] = useState(null);

  // State to hold the game configuration
  const [gameGonfig, setGameConfig] = useState(null);

  // Get display time from props
  let displayTime = props.game_settings.game.display_time;
  startTimer = getTimeDate().now;

  // useEffect to initialize and add event listeners when the component mounts
  useEffect(() => {
    endTimer = 0;
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

    let totalTimer = getTimeDate().now - startTimer;
    let greenScore=getGreenScore();

    if(greenScore==0){
      let prob = props.game_settings.game.type_1_probability;
      let score = props.game_settings.game.type_1_score;
      greenScore = Math.random() < (prob / 100) ? score : 0;
      setGreenScore(greenScore);
    }
    
    // Calculate result based on probability and score settings
    
    setGreenResult(greenScore); // Set the result for green button
    setTotalScore(getTotalScore() + greenScore)
    console.log("---> in handleGreenButtonClick() New total score " + getTotalScore()+" greenScore="+greenScore)

    // Wait for displayTime seconds before calling onComplete
    setTimeout(() => {
      onComplete(greenScore, totalTimer, "Green"); // Pass green result to onComplete after timeout
    }, displayTime * 1000);
  };

  // Handle click event for the blue button
  const handleBlueButtonClick = () => {
    let totalTimer = getTimeDate().now - startTimer;
    let blueScore=getBlueScore();

    if(blueScore==0){
      let prob = props.game_settings.game.type_2_probability;
      let score = props.game_settings.game.type_2_score;
      blueScore = Math.random() < (prob / 100) ? score : 0;
      setBlueScore(blueScore);
    }
    
    // Calculate result based on probability and score settings
    
    setBlueResult(blueScore); // Set the result for green button
    setTotalScore(getTotalScore() + blueScore)
    console.log("---> in handleBlueButtonClick() New total score " + getTotalScore()+" blueScore="+blueScore)

    // Wait for displayTime seconds before calling onComplete
    setTimeout(() => {
      onComplete(blueScore, totalTimer, "Blue"); // Pass green result to onComplete after timeout
    }, displayTime * 1000);
  };

  return (
    <div style={{ fontSize: '36px', textAlign: "center" }}>
      {/* Debugger view to show selected game and trial info */}
      <DebuggerModalView>
        <p>Selected game: {selectedGameIndex}</p>
        <p>Round Type: {type}</p>
        <p>Round#: {blockIndex}</p>
        <p>Step#: {trialIndex}</p>
      </DebuggerModalView>

      {/* Display current trial information */}
      <h1>
        <b>Step {trialIndex} out of {totalTrialsInBlock}</b>
      </h1>
      Points scored in this round: {totalScoreInBlock}
      <br />

      {/* Render buttons based on the order specified by isGreenFirst */}
      {isGreenFirst ? (
        <>
          {/* Green button displayed first */}
          <button
            onClick={handleGreenButtonClick}
            className="button green-button"
            style={{ color: 'black' }} // Ensure text color is black
          >
            {greenResult === null ? "" : greenResult} {/* Display result if available */}
          </button>
          <button
            onClick={handleBlueButtonClick}
            className="button blue-button"
            style={{ color: 'black' }} // Ensure text color is black
          >
            {blueResult === null ? "" : blueResult} {/* Display result if available */}
          </button>
        </>
      ) : (
        <>
          {/* Blue button displayed first */}
          <button
            onClick={handleBlueButtonClick}
            className="button blue-button"
            style={{ color: 'black' }} // Ensure text color is black
          >
            {blueResult === null ? "" : blueResult} {/* Display result if available */}
          </button>
          <button
            onClick={handleGreenButtonClick}
            className="button green-button"
            style={{ color: 'black' }} // Ensure text color is black
          >
            {greenResult === null ? "" : greenResult} {/* Display result if available */}
          </button>
        </>
      )}
    </div>
  );
};

export default Trial;