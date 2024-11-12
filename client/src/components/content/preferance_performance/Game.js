import React, { useState, useEffect } from 'react';
import Block from './Block';

const Game = ({ selectedGame,selectedGameIndex }) => {  // Receive selectedGame as a prop
  const [gameConfig, setGameConfig] = useState({
    Type_1_blocks_num: 0,
    Type_1_trials_num: 0,
    Type_2_blocks_num: 0,
    Type_2_trials_num: 0,
  });
  console.log("**** selectedGameIndex="+selectedGameIndex)
  const [currentBlockType, setCurrentBlockType] = useState('Type_1');
  const [type1BlockIndex, setType1BlockIndex] = useState(0);
  const [type2BlockIndex, setType2BlockIndex] = useState(0);
  const [showBlock, setShowBlock] = useState(true);

  useEffect(() => {
    if (selectedGame) {
      // Initialize gameConfig using values from selectedGame
      setGameConfig({
        Type_1_blocks_num: selectedGame.type_1_blocks_num || 0,
        Type_1_trials_num: selectedGame.type_1_trials_num || 0,
        Type_2_blocks_num: selectedGame.type_2_blocks_num || 0,
        Type_2_trials_num: selectedGame.type_2_trials_num || 0,
      });
    }
  }, [selectedGame]);

  const handleBlockComplete = () => {
    console.log("-------> in handle block complete")
    setShowBlock(false);

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

  return (
    <div>
      {!allBlocksCompleted ? (
        showBlock && (
          <Block
            type={currentBlockType}
            blockIndex={currentBlockType === 'Type_1' ? type1BlockIndex + 1 : type2BlockIndex + 1}
            gameConfig={gameConfig}
            onComplete={handleBlockComplete}
            selectedGameIndex={selectedGameIndex}
          />
        )
      ) : (
        <h2>Game Completed!</h2>
      )}
    </div>
  );
};

export default Game;
