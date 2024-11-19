import React, { useState, useEffect } from 'react';
import Block from './Block';

// Game component manages the sequence of blocks and tracks game progress
const Game = ({ isGreenFirst, selectedGame, selectedGameIndex, props: extraProps }) => { 
  
  const [gameConfig, setGameConfig] = useState({
    Type_1_blocks_num: 0,
    Type_1_trials_num: 0,
    Type_2_blocks_num: 0,
    Type_2_trials_num: 0,
  });

  const [currentBlockType, setCurrentBlockType] = useState('Type_1');
  const [type1BlockIndex, setType1BlockIndex] = useState(0);
  const [type2BlockIndex, setType2BlockIndex] = useState(0);
  const [showBlock, setShowBlock] = useState(true);
  const [gameStarted, setGameStarted] = useState(false); // Track if game has started
  const [totalScoreInGame,setTotalScoreInGame] = useState(0);

  // useEffect to initialize game configuration based on selectedGame
  useEffect(() => {
    if (selectedGame) {
      setGameConfig({
        Type_1_blocks_num: selectedGame.type_1_blocks_num || 0,
        Type_1_trials_num: selectedGame.type_1_trials_num || 0,
        Type_2_blocks_num: selectedGame.type_2_blocks_num || 0,
        Type_2_trials_num: selectedGame.type_2_trials_num || 0,
      });

      // Only set gameStarted to true if configuration has non-zero values
      if (
        (selectedGame.type_1_blocks_num || 0) > 0 ||
        (selectedGame.type_2_blocks_num || 0) > 0
      ) {
        setGameStarted(true); // Mark the game as started once valid config is set
      }
    }
  }, [selectedGame]);

  const handleBlockComplete = (totalScoreInBlock) => {
    setShowBlock(false);
    setTotalScoreInGame(totalScoreInGame + totalScoreInBlock);

    if (currentBlockType === 'Type_1') {
      if (type2BlockIndex < gameConfig.Type_2_blocks_num) {
        setCurrentBlockType('Type_2');
      }
      setType1BlockIndex(type1BlockIndex + 1);
    } else {
      if (type1BlockIndex < gameConfig.Type_1_blocks_num) {
        setCurrentBlockType('Type_1');
      }
      setType2BlockIndex(type2BlockIndex + 1);
    }
    
    setTimeout(() => setShowBlock(true), 500);
  };

  const allBlocksCompleted =
    type1BlockIndex === gameConfig.Type_1_blocks_num &&
    type2BlockIndex === gameConfig.Type_2_blocks_num;

  // useEffect to call sendDataToDB only when all blocks are completed and gameStarted is true
  useEffect(() => {
    if (gameStarted && allBlocksCompleted) {
      console.log("=====> All blocks completed! Invoking sendDataToDB.");
      extraProps.sendDataToDB(true);
    }
  }, [allBlocksCompleted, gameStarted, extraProps]);

  return (
    <div>
      {!allBlocksCompleted ? (
        showBlock && (
          <Block
            type={currentBlockType}
            isGreenFirst={isGreenFirst}
            blockIndex={currentBlockType === 'Type_1' ? type1BlockIndex + 1 : type2BlockIndex + 1}
            gameConfig={gameConfig}
            totalScoreInGame = {totalScoreInGame}
            onComplete={handleBlockComplete}
            selectedGameIndex={selectedGameIndex}
            props={extraProps}
          />
        )
      ) : (
        <h2>Game Completed!</h2>
      )}
    </div>
  );
};

export default Game;
