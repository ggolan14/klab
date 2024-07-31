import React from 'react';
import './App.css'; // Import the CSS file

const IntroductionScreen_1 = ({ onNext }) => {
  return (
    <div className="introduction">
      <p>This study includes two games. 
        In the first game, you will play the "mind game" and can win bonus depanding on your performance.
        In second game , you will play a trivia game and there will be no bonus.
        <br></br>
        Note that you should not leave or stop responding until you have completed the entier study and have recieved your completion code.
        If you leave or stop responding before completing the two games, you will not recieve compension.

      </p>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default IntroductionScreen_1;
