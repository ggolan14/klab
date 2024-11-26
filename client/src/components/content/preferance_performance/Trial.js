import React, { useState, useEffect } from 'react';
import { DebuggerModalView } from "../../screens/gameHandle/game_handle";
import { getTimeDate } from "../../../utils/app_utils";
import { getTotalScore, setTotalScore, getGreenScore, setGreenScore, getBlueScore, setBlueScore } from './GlobalState';

// Trial component represents a single trial with green and blue button options
const Trial = ({ type, isGreenFirst, blockIndex, trialIndex, onComplete, gameConfig, totalTrialsInBlock, totalScoreInBlock, selectedGameIndex, props }) => {


  let startTimer = 0; // Start time of the trial
  let endTimer = 0;   // End time of the trial


  // State variables to store the result of each button click
  const [greenResult, setGreenResult] = useState(null); // Result for the green button
  const [blueResult, setBlueResult] = useState(null);   // Result for the blue button

  // State to hold the game configuration
  const [gameGonfig, setGameConfig] = useState(null);

  // Get display time (in seconds) from props
  let displayTime = props.game_settings.game.display_time;
  startTimer = getTimeDate().now; // Record the start time of the trial

  // useEffect hook to perform actions when the component mounts
  useEffect(() => {
    endTimer = 0; // Reset end time for the trial

    // Initialize game configuration state if provided
    if (gameConfig) {
      setGameConfig({
        gameGonfig
      });
    }

    // Function to handle spacebar key press for completing the trial
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        onComplete(greenResult || blueResult); // Complete the trial with the result of any button clicked
      }
    };

    // Add event listener for spacebar press
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onComplete, greenResult, blueResult]); // Dependencies to trigger the effect

  // Function to handle green button click
  const handleGreenButtonClick = () => {

    let totalTimer = getTimeDate().now - startTimer; // Calculate total elapsed time
    let greenScore = getGreenScore(); // Get the current green score

    // If greenScore is possitive , don't generate random value , otherwise generate randome value based on probability and score settings
    if (greenScore === 0) {
      let prob = props.game_settings.game.type_1_probability; // Probability of scoring
      let score = props.game_settings.game.type_1_score;      // Score for a successful click
      greenScore = Math.random() < (prob / 100) ? score : 0; // Calculate greenScore
      setGreenScore(greenScore); // Update the global green score
    }

    // Update greenResult state and total score
	
    setGreenResult(greenScore);
    setTotalScore(getTotalScore() + greenScore);

    console.log(`---> in handleGreenButtonClick() New total score ${getTotalScore()} greenScore=${greenScore}`);

    // Wait for displayTime seconds before calling onComplete
    setTimeout(() => {
      onComplete(greenScore, totalTimer, "Green"); // Pass green result to onComplete after timeout
    }, displayTime * 1000);
  };

  // Function to handle blue button click
  const handleBlueButtonClick = () => {
    let totalTimer = getTimeDate().now - startTimer; // Calculate total elapsed time
    let blueScore = getBlueScore(); // Get the current blue score

    // If blueScore is possitive , don't generate random value , otherwise generate randome value based on probability and score settings
    if (blueScore === 0) {
      let prob = props.game_settings.game.type_2_probability; // Probability of scoring
      let score = props.game_settings.game.type_2_score;      // Score for a successful click
      blueScore = Math.random() < (prob / 100) ? score : 0; // Calculate blueScore
      setBlueScore(blueScore); // Update the global blue score
    }

    // Update blueResult state and total score
	
    setBlueResult(blueScore);
    setTotalScore(getTotalScore() + blueScore);

    console.log(`---> in handleBlueButtonClick() New total score ${getTotalScore()} blueScore=${blueScore}`);

    // Wait for displayTime seconds before calling onComplete
    setTimeout(() => {
      onComplete(blueScore, totalTimer, "Blue"); // Pass blue result to onComplete after timeout
    }, displayTime * 1000);
  };

  return (
    <div style={{ fontSize: '36px', textAlign: "center" }}>
      {/* Debugger view to display selected game and trial info */}
      <DebuggerModalView>
        <p>Selected game: {selectedGameIndex}</p>
        <p>Round Type: {type}</p>
        <p>Round#: {blockIndex}</p>
        <p>Step#: {trialIndex}</p>
      </DebuggerModalView>

      {/* Display trial information */}
      <h1>
        <b>Step {trialIndex} out of {totalTrialsInBlock}</b>
      </h1>
      Points scored in this round: {totalScoreInBlock}
      <br />

      {/* Render buttons based on the order specified by isGreenFirst */}
      {isGreenFirst ? (
        <>
          {/* Render green button first */}
          <button
            onClick={handleGreenButtonClick}
            className="button green-button"
            style={{ color: 'black' }} // Ensure text color is black
          >
            {greenResult === null ? "" : greenResult} {/* Display green result if available */}
          </button>
          <button
            onClick={handleBlueButtonClick}
            className="button blue-button"
            style={{ color: 'black' }} // Ensure text color is black
          >
            {blueResult === null ? "" : blueResult} {/* Display blue result if available */}
          </button>
        </>
      ) : (
        <>
          {/* Render blue button first */}
          <button
            onClick={handleBlueButtonClick}
            className="button blue-button"
            style={{ color: 'black' }} // Ensure text color is black
          >
            {blueResult === null ? "" : blueResult} {/* Display blue result if available */}
          </button>
          <button
            onClick={handleGreenButtonClick}
            className="button green-button"
            style={{ color: 'black' }} // Ensure text color is black
          >
            {greenResult === null ? "" : greenResult} {/* Display green result if available */}
          </button>
        </>
      )}
    </div>
  );
};

export default Trial;
