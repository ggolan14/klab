import React, { useState, useEffect } from 'react';
import { DebuggerModalView } from "../../screens/gameHandle/game_handle";
import { getTimeDate } from "../../../utils/app_utils";
import { getTotalScore, setTotalScore, getGreenScore, setGreenScore, getBlueScore, setBlueScore } from './GlobalState';

const Trial = ({ type, isGreenFirst, blockIndex, totalNumOfCompletedBlocks, trialIndex, onComplete, gameConfig, totalTrialsInBlock, totalScoreInBlock, selectedGameIndex, props }) => {
  let startTimer = 0; // Start time of the trial

  const [greenResult, setGreenResult] = useState(null);
  const [blueResult, setBlueResult] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false); // State to manage button disable status

  let displayTime = props.game_settings.game.display_time;
  startTimer = getTimeDate().now;

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        onComplete(greenResult || blueResult);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onComplete, greenResult, blueResult]);

  const handleButtonClick = (color) => {
    setDisableButtons(true); // Disable both buttons immediately after clicking
    let totalTimer = getTimeDate().now - startTimer;
    let score, setScore, getScore, probability, scoreValue;

    if (color === "Green") {
      getScore = getGreenScore;
      setScore = setGreenScore;
      probability = props.game_settings.game.type_1_probability;
      scoreValue = props.game_settings.game.type_1_score;
    } else {
      getScore = getBlueScore;
      setScore = setBlueScore;
      probability = props.game_settings.game.type_2_probability;
      scoreValue = props.game_settings.game.type_2_score;
    }

    let resultScore = getScore();
    if (resultScore === 0) {
      resultScore = Math.random() < (probability / 100) ? scoreValue : 0;
      setScore(resultScore);
    }

    if (color === "Green") {
      setGreenResult(resultScore);
    } else {
      setBlueResult(resultScore);
    }

    setTotalScore(getTotalScore() + resultScore);

    console.log(`---> in handle${color}ButtonClick() New total score ${getTotalScore()} ${color}Score=${resultScore}`);

    setTimeout(() => {
      onComplete(resultScore, totalTimer, color);
      setDisableButtons(false); // Enable buttons after displayTime
    }, displayTime * 1000);
  };

  return (
    <div style={{ fontSize: '36px', textAlign: "center" }}>
      <DebuggerModalView>
        <p>Selected game: {selectedGameIndex}</p>
        <p>TotalNumOfCompletedRounds: {totalNumOfCompletedBlocks}</p>
        <p>Round Type: {type}</p>
        <p>Round#: {blockIndex}</p>
        <p>Step#: {trialIndex}</p>
      </DebuggerModalView>

      <h1>
        <b>Step {trialIndex} out of {totalTrialsInBlock}</b>
      </h1>
      Points scored in this round: {totalScoreInBlock}
      <br />

      {isGreenFirst ? (
        <>
          <button
            onClick={() => handleButtonClick("Green")}
            className="button green-button"
            style={{ color: 'black' }}
            disabled={disableButtons} // Disable green button
          >
            {greenResult === null ? "" : greenResult}
          </button>
          <button
            onClick={() => handleButtonClick("Blue")}
            className="button blue-button"
            style={{ color: 'black' }}
            disabled={disableButtons} // Disable blue button
          >
            {blueResult === null ? "" : blueResult}
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => handleButtonClick("Blue")}
            className="button blue-button"
            style={{ color: 'black' }}
            disabled={disableButtons} // Disable blue button
          >
            {blueResult === null ? "" : blueResult}
          </button>
          <button
            onClick={() => handleButtonClick("Green")}
            className="button green-button"
            style={{ color: 'black' }}
            disabled={disableButtons} // Disable green button
          >
            {greenResult === null ? "" : greenResult}
          </button>
        </>
      )}
    </div>
  );
};

export default Trial;
