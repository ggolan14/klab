import React, { useState } from 'react';
//import Element from './Element.js';
import GameBoard from './GameBoard.js';
const GameStage = (cond , trialDuration) => {
    console.log("---> 222 props=",cond+"  duration=",trialDuration)
    const [stage, setStage] = useState('instructions'); // 'instructions' -> 'training' -> 'mainTask'
    //const [taskCompleted, setTaskCompleted] = useState(false);
    
    const handleNextStage = () => {
        if (stage === 'instructions') setStage('training');
        else if (stage === 'training') setStage('mainTask');
    };

    const finishGame = () => {
        setStage('finish');
      };

    return (
        <div>
            {stage === 'instructions' && (
                <div>
                    <h2>Welcome!</h2>
                    <p>
                    In this task, you will explore 5 different mazes, searching for hidden resources.
Please use the arrow keys (↑, ↓, ←, →) to move around the maze.
Once the hidden resources are discovered, they will turn green and remain visible until the end of the game.

Before you begin, there will be a short training stage to help you get comfortable with the controls.

Good luck and enjoy the task!

                    </p>
                    <button onClick={handleNextStage}>Next</button>
                </div>
            )}

            {stage === 'training' && (
                <div>
                    <h2>Training Stage</h2>
                    <p>Please complete the maze by moving your icon using the arrow keys (↑, ↓, ←, →).
You can hold down the keys for smooth and continuous movement.
To complete the training, successfully navigate your icon to the maze exit.
</p>
                    {/*<SpatialSearch stage="training"/>*/}
                    {/*<Element />*/}
                    <GameBoard  
                    stage="training"
                    onTrainingComplete={() => setStage('mainTask')}/>
                                       
                </div>
            )}

            {stage === 'mainTask' && (
                <div>
                    <h2>Main Task</h2>
                    <p>Find the hidden resources before time runs out.</p>
                    {/*<Element />*/} 
                    {/* <SpatialSearch stage="mainTask" /> */}
                    <GameBoard  
                    stage="mainTask"
                    onFinishGame={finishGame}/>
                </div>
            )}

          {stage === 'finish' && (
                <div>
                    <h2>Game Over!</h2>
                    <p>Thank you</p>
                    {/*<Element />*/} 
                    {/* <SpatialSearch stage="mainTask" /> */}
                   {/** 
                   <GameBoard  
                    stage="mainTask"
                    onGameComplete={() => setStage('gameOver')}/>
                    */} 
                    
                </div>
            )}
        </div>
    );
};

export default GameStage;
