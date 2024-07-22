import React from 'react';

const IntroductionScreen_2 = ({ onNext }) => {
  return (
    <div className="dice-roll-container">
      <p>In this game, you will be asked to guess a number. Let's start the practice.</p>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default IntroductionScreen_2;
