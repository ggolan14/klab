import React from 'react';
import './App.css'; // Import the CSS file

const IntroductionScreen_2 = ({onNext, signOfReward }) => {

  return (
    <div className="introduction">
      <p>
      <h2>Welcome to the Mind game2222!</h2>
        <br></br>
        In this game, you will be asked to think of a number between 1 and 6 and keep it in your mind.
        Then you will roll a virtual die.
        You wil be asked to report if the number you rolled is the one you had in mind.
        <br></br>
        If the number you rolled <b>is</b> the one you had in mind, you <b>will</b> receive a {signOfReward}1 bonus.
        <br></br>
        if the number you rolled <b>is not</b> the one you had in mind, you <b>will not</b> recieve a bonus.
        <br></br>
        <br></br>
        Let's try it out.
        <br></br>
        <br></br>
        You will now go through 3 <b>practice</b> rounds of mind game.
        <br></br>
        Note: The goal of the practice rounds is to help you understand the game.  You will not gain any bonus in these rounds, and your answers will not be recorded.  
        you will be notified when the practice is over and the real game starts.
      </p>
      <button onClick={onNext}>Start Practice</button>
    </div>
  );
};

export default IntroductionScreen_2;
