import React, { useState } from 'react';
import Trial from './Trial';
import { DebuggerModalView } from "../../screens/gameHandle/game_handle";
import { getTotalScore, setTotalScore, getGreenScore, setGreenScore, getBlueScore, setBlueScore } from './GlobalState';

// Block component manages a sequence of trials and calculates the total score for a block
const Block = ({ isGreenFirst, type, blockIndex,totalNumOfCompletedBlocks, gameConfig, onComplete, selectedGameIndex, props }) => {
  // Determine the number of trials based on block type
  let totalTrialsInBlock = type === 'Type_1' ? gameConfig.Type_1_trials_num : gameConfig.Type_2_trials_num;
  let totalBlocksInGame = gameConfig.Type_1_blocks_num + gameConfig.Type_2_blocks_num

  // State to track the current trial index within the block
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);

  // State to manage whether a trial is currently displayed
  const [showTrial, setShowTrial] = useState(false);

  // State to keep track of the total score accumulated in this block
  const [totalScoreInBlock, setTotalScoreInBlock] = useState(0);

  // State to display the block completion message
  const [showBlockCompletionMessage, setShowBlockCompletionMessage] = useState(false);

  // Starts the block by showing the first trial
  const handleStart = () => {
    setGreenScore(0);
    setBlueScore(0);
    setShowTrial(true); // Show the first trial when Start is clicked
    setShowBlockCompletionMessage(false); // Hide the block completion message
  };

  const handleContinue = () => {
    setShowTrial(true); // Show the first trial when Start is clicked
    setShowBlockCompletionMessage(false); // Hide the block completion message
    onComplete(totalScoreInBlock);
  };

  // Handles the completion of each trial, updating the score and managing the trial sequence
  const handleTrialComplete = (score, totalTime, color) => {
    const newBlockVal=totalScoreInBlock + score;
    setTotalScoreInBlock(newBlockVal);
    // Check if there are more trials left in the block
    if (currentTrialIndex < totalTrialsInBlock - 1) {
      // Move to the next trial in the block
      setCurrentTrialIndex(currentTrialIndex + 1);
    } else {
      // All trials in the block are complete
      setShowTrial(false); // Hide trials
      setCurrentTrialIndex(0); // Reset trial index for the next block
      setShowBlockCompletionMessage(true); // Show block completion message
    }

    const db_row = {
      BlockType: type,
      RoundIndex: blockIndex,
      TotalCompletedRounds:  totalNumOfCompletedBlocks,
      TrailIndex: currentTrialIndex + 1,
      Score: score,
      TotalTime: totalTime,
      Color: color,
    };

    props.insertGameLineToDB(db_row);
  };

  return (

    <div style={{ textAlign: "center" }}>
      {/* Display the block completion message */}
      {showBlockCompletionMessage && (
        <>
          <b>You have completed round {totalNumOfCompletedBlocks+1} out of {totalBlocksInGame}</b>
          <br />
          <br />
          In this round you scored {totalScoreInBlock} points
          <br />
          Your curent game score is {getTotalScore()} points
          <br />
          <br />
          <b>Please continue to the next round when you are ready</b>
          <br />
          <br />

          <div className="button-container">
            <button onClick={handleContinue}>Continue</button>
          </div>
        </>
      )}

      {/* Display the block introduction and start button when no trial is shown */}
      {!showTrial && !showBlockCompletionMessage && (
        <div style={{ textAlign: "center", lineHeight: '2.6' }}>

          <p>
            <b>The next round consists of {totalTrialsInBlock} steps</b>
            <br />
            Both the green and the blue buttons are available to you
            <br />
            Please start when you are ready
          </p>
          <div className="button-container">
            <button onClick={handleStart}>Start</button>
          </div>
        </div>
      )}

      {/* Display the Trial component when a trial is active */}
      {showTrial && (
        <Trial
          key={currentTrialIndex} // Unique key for each trial to manage React's re-rendering
          type={type} // Pass the block type to the trial
          isGreenFirst={isGreenFirst} // Control button order in trial
          blockIndex={blockIndex} // Pass the block index
          totalNumOfCompletedBlocks={totalNumOfCompletedBlocks} //Total
          trialIndex={currentTrialIndex + 1} // Display a 1-based index for users
          onComplete={handleTrialComplete} // Function to call when a trial is complete
          gameConfig={gameConfig} // Pass game configuration settings
          totalTrialsInBlock={totalTrialsInBlock} // Total trials in this block
          totalScoreInBlock={totalScoreInBlock} // Current score in this block
          selectedGameIndex={selectedGameIndex} // Game index for tracking
          props={props} // Additional props if needed
        />
      )}
    </div>
  );
};

export default Block;
