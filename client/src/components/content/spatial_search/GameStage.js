import React, { useState } from 'react';
import './gameStyles.css';
import GameBoard from './GameBoard.js';

const GameStage = ({ GameCondition, trialDuration ,gameSettings}) => {

    const [stage, setStage] = useState('instructions'); // 'instructions' -> 'training' -> 'mainTask'
    //const [taskCompleted, setTaskCompleted] = useState(false);

    const handleNextStage = () => {
        console.log("---> handleNextStage")
        if (stage === 'instructions') setStage('trainingInstruction');
        else if (stage === 'trainingInstruction') setStage('training');
        else if (stage === 'training') setStage('mainTaskInstruction');
        else if (stage === 'mainTaskInstruction') setStage('mainTask');
    };

    const finishGame = () => {
        console.log("---> finishGame")
        setStage('finish');
    };
    console.log("----> before return stage=" + stage)
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
            {stage === 'trainingInstruction' && (
                <div>
                    <h2>Training Stage</h2>
                    <p>Please complete the maze by moving your icon using the arrow keys (↑, ↓, ←, →).
                        You can hold down the keys for smooth and continuous movement.
                        To complete the training, successfully navigate your icon to the maze exit.
                    </p>
                    <button onClick={handleNextStage}>Next</button>
                </div>
            )}
            {stage === 'training' && (
                <div>
                    
                    {/*<SpatialSearch stage="training"/>*/}
                    {/*<Element />*/}
                    <GameBoard
                        stage="training"
                        GameCondition={GameCondition}
                        trialDuration={trialDuration}
                        onTrainingComplete={() => setStage('mainTask')}
                        gameSettings={gameSettings}
                    />

                </div>
            )}
            {stage === 'mainTaskInstruction' && (
                <div>
                    <h2>Main Task</h2>
                    <p>Find the hidden resources before time runs out.</p>
                    <button onClick={handleNextStage}>Next</button>
                </div>
            )}
            {stage === 'mainTask' && (
                <div>
                   
                    {/*<Element />*/}
                    {/* <SpatialSearch stage="mainTask" /> */}
                    <GameBoard
                        stage="mainTask"
                        GameCondition={GameCondition}
                        trialDuration={trialDuration}
                        onFinishGame={finishGame}
                        gameSettings={gameSettings}
                    />
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
