import React, { useState } from 'react';
import Trial from './Trial';

const Block = ({ type, blockIndex, gameConfig, onComplete,selectedGameIndex }) => {
  let totalTrialsInBlock = type === 'Type_1' ? gameConfig.Type_1_trials_num : gameConfig.Type_2_trials_num;
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [showTrial, setShowTrial] = useState(false);
  const [totalScoreInBlock, setTotalScoreInBlock] = useState(0);

  const handleStart = () => {
    setShowTrial(true); // Show the first trial when Start is clicked
  };

  const handleTrialComplete = (score) => {
    console.log("---> in handleTrialComplete()  score in trail "+currentTrialIndex+" is "+score)
    setTotalScoreInBlock(totalScoreInBlock+score);
    
    if (currentTrialIndex < totalTrialsInBlock - 1) {
      // Move to the next trial in the block
      setCurrentTrialIndex(currentTrialIndex + 1);
    } else {
      // All trials in the block are complete
      setShowTrial(false); // Hide trials
      setCurrentTrialIndex(0); // Reset trial index for the next block
      onComplete(); // Notify that the block is complete
    }
  }; 

  return (
    <div>
      {!showTrial && (
        <>
          <h1>The next block consists of {totalTrialsInBlock} steps</h1>
          <p>
            Both the green and blue buttons are available for you
            <br />
            Please start when you are ready
          </p>
          <button onClick={handleStart}>Start</button>
        </>
      )}

      {showTrial && (
        <Trial
          key={currentTrialIndex} // Unique key for each trial
          type={type}
          blockIndex={blockIndex}
          trialIndex={currentTrialIndex + 1} // 1-based index for display
          onComplete={handleTrialComplete}
          gameConfig={gameConfig}
          totalTrialsInBlock={totalTrialsInBlock}
          totalScoreInBlock={totalScoreInBlock}
          selectedGameIndex={selectedGameIndex}
        />
      )}
    </div>
  );
};

export default Block;
