import React, { useState } from 'react';
import './App.css'; // Import the CSS file
import IntroductionScreen_1 from './IntroductionScreen_1';
import IntroductionScreen_2 from './IntroductionScreen_2';
import PracticeRound from './PracticeRound';
import RealGameRound from './RealGameRound';

const App = () => {
  const [step, setStep] = useState(1); // Track current step of the game

  const handleNext = () => {
    setStep(step + 1);
  };

  return (
    <div className="App">
      {step === 1 && <IntroductionScreen_1 onNext={handleNext} />}
      {step === 2 && <IntroductionScreen_2 onNext={handleNext} />}
      {step >= 3 && step <= 5 && <PracticeRound onNext={handleNext} />}
      {/* Render PracticeRound three times */}
      {step >= 6 && step <= 9 && <RealGameRound onNext={handleNext} />}
      {/* Render RealGameRound four times */}
      {step === 10 && <p className="dice-roll-container">Game completed</p>}
    </div>
  );
};

export default App;
