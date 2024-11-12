import React, { Component } from 'react';
import './gameStyles.css';
import { formatPrice } from '../../utils/StringUtils';

class PreferancePerformanceIntroduction extends Component {
  constructor(props) {
    super(props);
    console.log("===== this.props.signOfReward=" + this.props.signOfReward);
    let game = this.props.selectedGame;
    this.insertLine = this.props.insertLine;

    const part1 = (
      <span>
        <br/>
        <h2><b>Game Instructions </b></h2>
        <u>The Goal</u>
        <br/>
        Your goal is to accumulate as many points as possible.
        <br/>
        At the end of the game, each point will be worth 1 cent.
        <br/>
        You gain points by clicking the green and blue buttons.
        <br/>
        <br/><u>Gaining Points</u>
        <br/>
        Each button provides different points:
        <br/>
        <p className="bullet-text-green">
          The green button provides +3 points with a 75% chance, or 0 otherwise.
        </p>
        <p className="bullet-text-blue">
          The blue button provides +5 points with a 10% chance, or 0 otherwise.
        </p>
      </span>
    );

    const part2 = (
      <span>
        <h2><b>Game Instructions Cont.</b></h2>
        <br/>Once you receive the <b>positive</b> payoff from a button, <b>this button</b> will continue to provide the same payoff for all remaining steps in that round.
        <br/>
        ***** PICTURE HERE ***
        <br/>
        Example: the green button is chosen for 4 steps in a row. Once it provides +3 points (in step 2), it continues to provide +3 points in all the following steps.
      </span>
    );

    const part3 = (
      <span>
        <h2><b>Game Instructions Cont.</b></h2>
        <br/>
        In the game, you will experience {game.type_1_blocks_num + game.type_2_blocks_num} rounds in a random order: {game.type_1_blocks_num} rounds of <b>{game.type_1_trials_num}</b> steps & {game.type_2_blocks_num} rounds of <b>{game.type_2_trials_num} steps.</b>
        <br/>
        Before each round starts, you'll be told how many steps it has.
        <br/>
        <br/>
        Statistically, the blue button's expected value (average gain) is higher in rounds of 18 steps or more,
        <br/>
        and the green button's expected value is higher in rounds of 17 steps or less.
      </span>
    );

    this.state = {
      messages: [part1, part2, part3],
      currentIndex: 0,
      selectedButtonChoice: '', // New state for radio button selection
    };
  }

  handleNext = () => {
    const { currentIndex } = this.state;
    this.setState({ currentIndex: currentIndex + 1 });
  }

  handleBack = () => {
    const { currentIndex } = this.state;
    if (currentIndex > 0) {
      this.setState({ currentIndex: currentIndex - 1 });
    }
  }

  handleRadioChange = (event) => {
    this.setState({ selectedButtonChoice: event.target.value });
  }

  handleSubmitChoice = () => {
    if (this.state.selectedButtonChoice) {
      console.log('User selected:', this.state.selectedButtonChoice);
      const db_row = {
       
        Question: "Introduction - Select single button",
        Answer: this.state.selectedButtonChoice
        
    };
    this.insertLine(db_row);
      this.props.onHideMessages();
    } else {
      alert("Please select a button option before proceeding.");
    }
  }

  render() {
    const { messages, currentIndex, selectedButtonChoice } = this.state;
    console.log("===> currentIndex="+currentIndex)

    // Define part4 here within render to access state properly
    const part4 = (
      <div>
        <h2>Before the game begins, you have the option to select a single button for the entire game:</h2>
        <label style={{ display: 'block', textAlign: 'left' }}>
          <input
            type="radio"
            value="green"
            checked={selectedButtonChoice === 'green'}
            onChange={this.handleRadioChange}
          />
          Choose the green button
        </label>
        <label style={{ display: 'block', textAlign: 'left' }}>
          <input
            type="radio"
            value="blue"
            checked={selectedButtonChoice === 'blue'}
            onChange={this.handleRadioChange}
          />
          Choose the blue button
        </label>
        <label style={{ display: 'block', textAlign: 'left' }}>
          <input
            type="radio"
            value="both"
            checked={selectedButtonChoice === 'both'}
            onChange={this.handleRadioChange}
          />
          Choose to keep both
        </label>
        <div className="button-container">
          <button onClick={this.handleBack}>Back</button>
          <button onClick={this.handleSubmitChoice} disabled={!selectedButtonChoice}>Submit my choice</button>
        </div>
        <label>Good luck and enjoy the game!</label>
      </div>
    );

    // Add part4 to the end of the messages array in render
    const allMessages = [...messages, part4];

    return (
      <div className="trivia-container">
        {/* Display the current message */}
        <div>{allMessages[currentIndex]}</div>
        <div className="button-container">
          {/* Show "Back" button if not the first message */}
          {currentIndex <3  && (
            <button onClick={this.handleBack}>Back2</button>
          )}
          {/* Show "Next" button if not the last message */}
          {currentIndex < allMessages.length - 1 && (
            <button onClick={this.handleNext}>Next</button>
          )}
        </div>
      </div>
    );
  }
}

export default PreferancePerformanceIntroduction;
