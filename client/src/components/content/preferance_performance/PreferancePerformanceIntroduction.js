import React, { Component } from 'react';
import './gameStyles.css';
import ImgIntro1 from './images/introduction1.png';
import ImgIntro2 from './images/introduction2.png';

class PreferancePerformanceIntroduction extends Component {
  constructor(props) {
    super(props);

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
          The more points you gain the higher your bonus will be.
          <br />
          You gain points by clicking the green and blue buttons.
          <br /><br /><u>Gaining Points</u>
          <br />
          Each button provides different points:
          <br />
          <p>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor: 'greenyellow',
              marginRight: '8px'
            }}></span>
            The green button provides +{game.type_1_score} points with a {game.type_1_probability}% chance, or 0 otherwise.
          </p>
          <p>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              backgroundColor: 'rgb(0, 217, 255)',
              marginRight: '8px'
            }}></span>
             The blue button provides +{game.type_2_score} points with a {game.type_2_probability}% chance, or 0 otherwise.
          </p>
        </div>
        <div style={{ flex: '0 0 auto', textAlign: 'center', paddingTop: '70px' }}>
          <label>Example: a step in the game</label>
          <br />
          <img src={ImgIntro1} alt="Game Introduction" style={{ width: '300px', height: '200px', borderRadius: '8px' }} /> 
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
        <div style={{ lineHeight: "1.8" }}> {/* Adjust line height as needed */}
          <br />
          The game has 40 rounds, divided half by half into rounds of:
          <br />
          • <b>5 steps</b> (button choices)
          <br />
          • <b>15 steps</b>
          <br />
          Before each round starts, you’ll see how many steps it has.
          <br /><br />
          <b>Your bonus depends on matching the button to the round length:</b>
          <br />
          • Green is better in short rounds, of 18 steps or fewer, because it provides consistent rewards.
          <br />
          • Blue is better in long rounds, of 19 steps or more, where there are more chances for its rare big reward to occur.
        </div>
      </span>
    );
    

    this.state = {
      messages: [part1, part2, part3],
      currentIndex: 0,
    };
  }

  handleNext = () => {
    this.setState({ currentIndex: this.state.currentIndex + 1 });
  };

  handleBack = () => {
    this.setState({ currentIndex: this.state.currentIndex - 1 });
  };

  render() {
    const { messages, currentIndex } = this.state;

    return (
      <div className="trivia-container">
        <div>{messages[currentIndex]}</div>
        <div className="button-container">
          {currentIndex > 0 && <button className="shared-button" onClick={this.handleBack}>Back</button>}
          {currentIndex < messages.length - 1 
            ? <button className="shared-button" onClick={this.handleNext}>Next</button> 
            : <button className="shared-button" onClick={this.props.onHideMessages}>Continue</button>}
        </div>
      </div>
    );
  }
}

export default PreferancePerformanceIntroduction;
