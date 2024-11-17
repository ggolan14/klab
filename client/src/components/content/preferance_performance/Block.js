import React, { useState } from 'react';
import Trial from './Trial';

// Block component manages a sequence of trials and calculates the total score for a block
const Block = ({ isGreenFirst, type, blockIndex, gameConfig, onComplete, selectedGameIndex, props }) => {

  console.log("------------------->  Block isGreenFirst="+isGreenFirst)
  
  // Determine the number of trials based on block type
  let totalTrialsInBlock = type === 'Type_1' ? gameConfig.Type_1_trials_num : gameConfig.Type_2_trials_num;

  // State to track the current trial index within the block
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);

  // State to manage whether a trial is currently displayed
  const [showTrial, setShowTrial] = useState(false);

  // State to keep track of the total score accumulated in this block
  const [totalScoreInBlock, setTotalScoreInBlock] = useState(0);

  // Starts the block by showing the first trial
  const handleStart = () => {
    setShowTrial(true); // Show the first trial when Start is clicked
  };

  // Handles the completion of each trial, updating the score and managing the trial sequence
  const handleTrialComplete = (score) => {
    console.log("---> in handleTrialComplete()  score in trial " + currentTrialIndex + " is " + score);
    // Add the score from the completed trial to the total block score
    setTotalScoreInBlock(totalScoreInBlock + score);

    // Check if there are more trials left in the block
    if (currentTrialIndex < totalTrialsInBlock - 1) {
      // Move to the next trial in the block
      setCurrentTrialIndex(currentTrialIndex + 1);
    } else {
      // All trials in the block are complete
      setShowTrial(false); // Hide trials
      setCurrentTrialIndex(0); // Reset trial index for the next block
      onComplete(); // Notify the parent component that the block is complete
    }

    const db_row = {
       
      TrailIndex: currentTrialIndex,
      Score: score,
      
  };
  
  props.insertGameLineToDB(db_row);

  };

  return (
    <div>
      {/* Display the block introduction and start button when no trial is shown */}
      {!showTrial && (
        <>
          <h1>The next block consists of {totalTrialsInBlock} steps</h1>
          <p>
            Both the green and blue buttons are available for you
            <br />
            Please start when you are ready
          </p>
          <div className="button-container">
            <button onClick={handleStart}>Start</button>
          </div>
        </>
      )}

      {/* Display the Trial component when a trial is active */}
      {showTrial && (
        <Trial
          key={currentTrialIndex} // Unique key for each trial to manage React's re-rendering
          type={type} // Pass the block type to the trial
          isGreenFirst={isGreenFirst} // Control button order in trial
          blockIndex={blockIndex} // Pass the block index
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
