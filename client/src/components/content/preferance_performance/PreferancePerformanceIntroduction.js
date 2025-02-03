import React, { Component } from 'react';
import './gameStyles.css';
import { formatPrice } from '../../utils/StringUtils';
import ImgIntro1 from './images/introduction1.png';
import ImgIntro2 from './images/introduction2.png';

class PreferancePerformanceIntroduction extends Component {
  constructor(props) {
    super(props);

    this.insertLine = this.props.insertLine;

    let game = this.props.selectedGame;

    const part1 = (
      <div width="500px" style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        <div style={{ flex: 1, lineHeight: '1.4' }}>
          <br />
          <h2 style={{ textAlign: "center" }}><b>Game Instructions</b></h2>
          <u>The Goal</u>
          <br />
          Your goal is to accumulate as many points as possible.
          <br />
          At the end of the game, each point will be worth 1 cent.
          <br />
          You gain points by clicking the green and blue buttons.
          <br />
          <br /><u>Gaining Points</u>
          <br />
          Each button provides different points:
          <br />
          <p style={{ margin: '0', marginBottom: '4px', lineHeight: '1.4', display: 'flex', alignItems: 'center' }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor: 'greenyellow',
              marginRight: '8px'
            }}></span>
            The green button provides +{game.type_1_score} points with a {game.type_1_probability}% chance, or 0 otherwise.
          </p>
          <p style={{ margin: '0', marginBottom: '4px', lineHeight: '1.4', display: 'flex', alignItems: 'center' }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor: 'rgb(0, 217, 255)',
              marginRight: '8px'
            }}></span>
            The blue button provides +{game.type_2_score} points with a {game.type_2_probability}% chance, or 0 otherwise.
          </p>
          <br />
        </div>
        <div style={{ flex: '0 0 auto', textAlign: 'center', paddingTop: '70px' }}>
          <label>Example: a step in the game</label>
          <br />
          <img
            src={ImgIntro1}
            alt="Game Introduction"
            style={{ width: '300px', height: '200px', borderRadius: '8px', paddingTop: '10px' }}
          /> 
        </div>
      </div>
    );

    const part2 = (
      <span>
        <h2 style={{ textAlign: "center" }}><b>Game Instructions</b></h2>
        <br />Once you receive the <b>positive</b> payoff from a button, <b>this button</b> will continue to provide the same payoff for all remaining steps in that round.
        <br />
        <div>
          <img
            src={ImgIntro2}
            alt="Game Introduction"
            style={{ width: '800px', maxHeight: '500px', borderRadius: '8px' }}
          />
          <br />
          Example: the green button is chosen for 4 steps in a row. Once it provides +{game.type_1_score} points (in step 2), it continues to provide +{game.type_1_score} points in all the following steps.
          <br />
        </div>

      </span>

    );

    const part3 = (
      <span>
        <h2 style={{ textAlign: "center" }}><b>Game Rounds</b></h2>
        <br />
        The game has 40 rounds, divided half by half into rounds of:
        <br />
        • <b>5 steps</b> (button choices)
        <br />
        • <b>15 steps</b>
        <br /><br />
        Before each round starts, you’ll see how many steps it has.
        <br /><br />
        <b>Your bonus depends on matching the button to the round length:</b>
        <br />
        • Green is better in short rounds, of 18 steps or fewer, <br />
          because it provides consistent rewards.
        <br />
        • Blue is better in long rounds, of 19 steps or more, <br />
          where there are more chances for its rare big reward to occur.
      </span>
    );

    // Define radio options and shuffle them **only once**
    const radioOptions = [
      {
        value: "green",
        label: `Choose to use only the green button (${this.props.selectedGame.type_1_probability}% chance to gain +${this.props.selectedGame.type_1_score} points, or 0 otherwise)`,
      },
      {
        value: "blue",
        label: `Choose to use only the blue button (${this.props.selectedGame.type_2_probability}% chance to gain +${this.props.selectedGame.type_2_score} points, or 0 otherwise)`,
      },
      {
        value: "both",
        label: "Choose to keep both the green and the blue buttons optional throughout the game",
      }
    ];

    // Shuffle the radio options ONCE and store them in state
    const shuffledOptions = [...radioOptions].sort(() => Math.random() - 0.5);

    this.state = {
      messages: [part1, part2, part3],
      currentIndex: 0,
      selectedButtonChoice: '', // Stores selected radio button value
      shuffledOptions, // Stores the shuffled radio buttons
    };
  }

  handleNext = () => {
    const { currentIndex } = this.state;
    this.setState({ currentIndex: currentIndex + 1 });
  };

  handleBack = () => {
    const { currentIndex } = this.state;
    if (currentIndex > 0) {
      this.setState({ currentIndex: currentIndex - 1 });
    }
  };

  handleRadioChange = (event) => {
    this.setState({ selectedButtonChoice: event.target.value });
  };

  handleSubmitChoice = () => {
    if (this.state.selectedButtonChoice) {
      const db_row = {
        Question: "Introduction - Select single button",
        Answer: this.state.selectedButtonChoice
      };

      this.insertLine(db_row);
      this.props.onHideMessages();
    } else {
      alert("Please select a button option before proceeding.");
    }
  };

  render() {
    const { messages, currentIndex, selectedButtonChoice, shuffledOptions } = this.state;

    const part4 = (
      <div style={{ lineHeight: '2.6' }}>
        <h2 style={{ textAlign: "center" }}><b>Game Instructions</b></h2>
        <br />
        Before the game begins, you have the option to select a single button for the entire game:
        <br />
        {shuffledOptions.map(option => (
          <label key={option.value} style={{ display: 'block', textAlign: 'left' }}>
            <input
              type="radio"
              value={option.value}
              checked={selectedButtonChoice === option.value}
              onChange={this.handleRadioChange}
              style={{ marginRight: '8px' }}
            />
            {option.label}
          </label>
        ))}
        <div className="button-container" style={{ lineHeight: '1.6' }}>
          <button className="shared-button" onClick={this.handleBack}>Back</button>
          <button
            className="shared-button"
            onClick={this.handleSubmitChoice}
            disabled={!selectedButtonChoice}
          >
            Submit my choice
          </button>
        </div>
        <label className="center-text">
          <label style={{ textAlign: "center", display: "block" }}>
            Good luck and enjoy the game!
          </label>
        </label>
      </div>
    );

    const allMessages = [...messages, part4];

    return (
      <div className="trivia-container">
        <div>{allMessages[currentIndex]}</div>
        <div className="button-container">
          {currentIndex > 0 && currentIndex < 3 && (
            <button className="shared-button" onClick={this.handleBack}>Back</button>
          )}
          {currentIndex < allMessages.length - 1 && (
            <button className="shared-button" onClick={this.handleNext}>Next</button>
          )}
        </div>
      </div>
    );
  }
}

export default PreferancePerformanceIntroduction;
