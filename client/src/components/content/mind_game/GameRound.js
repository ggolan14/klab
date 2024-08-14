import React, { useState } from 'react';
import './style.css';

const GameRound = ({ onShowConfirmation }) => {
  console.log("===> component loaded");
  const [diceClass, setDiceClass] = useState('');
  const [diceTransform, setDiceTransform] = useState('');
  const [random, setRandom] = useState(1);
  const [renderKey, setRenderKey] = useState(0); // State to trigger re-rendering
  const [showButton, setShowButton] = useState(true);
  const [doneText, setDoneText] = useState(''); // New state to control "Done" text

  const getRandomDiceValue = () => {
    let tmpRand = Math.floor(Math.random() * 6) + 1;
    console.log("++++++> in getRandomDiceValue  tmpRand=" + tmpRand);
    return tmpRand;
  };

  const randomDice = () => {
    console.log("===> in randomDice");
    const random = getRandomDiceValue();
    rollDice(random);
    setRenderKey(prevKey => prevKey + 1); // Increment the key to trigger re-rendering
  };

  const rollDice = (random) => {
    console.log("===> in roll dice 111 random=" + random);
    setDiceClass('rolling');
    console.log("===> in roll dice 222");
    setTimeout(() => {
      console.log("===> in roll dice 333");
      let transform;
      switch (random) {
        case 1:
          transform = 'rotateX(0deg) rotateY(0deg)';
          break;
        case 6:
          transform = 'rotateX(180deg) rotateY(0deg)';
          break;
        case 2:
          transform = 'rotateX(-90deg) rotateY(0deg)';
          break;
        case 5:
          transform = 'rotateX(90deg) rotateY(0deg)';
          break;
        case 3:
          transform = 'rotateX(0deg) rotateY(90deg)';
          break;
        case 4:
          transform = 'rotateX(0deg) rotateY(-90deg)';
          break;
        default:
          break;
      }
      console.log("===> in roll dice 444");
      setDiceTransform(transform);
      console.log("===> in roll dice 555");
      setDiceClass('');
      console.log("===> in roll dice 666");
      setShowButton(false); // Hide the button after the dice roll
      setDoneText(random); // Set the text to "Done"
      //onShowConfirmation(random); // Call the confirmation function
    }, 500);
  };

  console.log("===> component loaded with diceClass=" + diceClass + "   diceTransform=" + diceTransform + "  showButton=" + showButton);

  return (
    <div className="container">
      <div className={`dice ${diceClass}`} style={{ transform: diceTransform }} key={renderKey}>
        <div className="face front"></div>
        <div className="face back"></div>
        <div className="face top"></div>
        <div className="face bottom"></div>
        <div className="face right"></div>
        <div className="face left"></div>
      </div>
      {showButton ? (
        <div>
          <button className="roll" onClick={randomDice}>
            <h2>Roll Dice</h2>
          </button>
        </div>
      ) : (
        <div>
          <h2>{doneText}</h2>
        </div>
      )}
    </div>
  );
};

export default GameRound;
