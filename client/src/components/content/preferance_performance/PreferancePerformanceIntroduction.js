import React, { Component } from 'react';
import './gameStyles.css';
import { formatPrice } from '../../utils/StringUtils';
class PreferancePerformanceIntroduction extends Component {
    
  constructor(props) {
    super(props);
    console.log("===== this.props.signOfReward=" + this.props.signOfReward);

    const isRepeated = this.props.gameCondition === "Repeated";

    const part1 = (
      <span>
        <br/>
        <h2><b>Game Instructions </b></h2>
        <u>The Goal</u>
        <br/>
        Your golal is to accumulate as many points as possible.
        <br/>
        At the end of the game each cent will worth 1 cent.
        <br/>
        You gain points by clicking the green and the blue butons.
        <br/>
        <br/><u>Gaining Points</u>
        <br/>
        Your golal is to accumulate as many points as possible.
        <br/>
        At the end of the game each cent will worth 1 cent.
        <br/>
        You gain points by clicking the green and the blue butons.
        <br/>
        <br/><u>Choosing a button</u>
        <br/>
        Each button provides different points:
        <br/>
        <p class="bullet-text-green">
          The green button provides +3 points with a 75% chance, or 0 otherwise.
        </p>
        <p class="bullet-text-blue">
          The blue button provides +5 points with a 10% chance, or 0 otherwise.
        </p>
        
        

      </span>
    );

    const part2 = (
        <span>
        <h2><b>Game Instructions Cont.</b></h2>
        <br/>Once you recieve the <b>possitive</b> payoff from a button , <b>this button</b> will continue to provide the same payoff for all  remaining steps in that round.
        <br/>
        ***** PICTURE HERE ***
        <br/>
        Example: the greenbutton is choosen for 4 steps in a row. Once it provides +3 points (in step2) , it continues to provide +3 points in all the following steps.
        </span>
    ) ;

    const part3 = (
      <span>
        <h2><b>Game Instructions Cont.</b></h2>
        <br/>
        In the game you will experiance 8 rounds in a random order: 4 rounds of <b>10</b> steps & 4 rounds of <b>15 steps.</b>
        <br/>
        Before each round starts, you'll be told how many steps it has.
        <br/>
        <br/>
        Statisically, the blue button's expected value (avarage gain) is higher in rounds of 18 steps or more,
        <br/>
        and the green button's expected value is higher in rounds of 17 steps or less.
        <br/>
        </span>
    );

    this.state = {
      messages: [part1, part2, part3],
      currentIndex: 0 // Initial index to display the first message
    };
  }

  // Handle click on "Next" button
  handleNext = () => {
    const { currentIndex, messages } = this.state;
    // Increment index to display the next message
    if (currentIndex < messages.length - 1) {
      this.setState({ currentIndex: currentIndex + 1 });
    } else {
      // Start showing trivia questions
      this.props.onHideMessages();
    }
  }

  // Handle click on "Back" button
  handleBack = () => {
    const { currentIndex } = this.state;
    if (currentIndex > 0) {
      this.setState({ currentIndex: currentIndex - 1 });
    }
  }

  render() {
    const { messages, currentIndex } = this.state;

    return (
      <div className="trivia-container">
        
        {/* Display the current message */}
        <p>{messages[currentIndex]}</p>
        <div className="button-container">
        {/* Show "Back" button if not the first message */}
        {currentIndex > 0 && (
          <button onClick={this.handleBack}>Back</button>
        )}
        {/* Show "Next" button if not the last message */}
        {currentIndex < messages.length - 1 && (
          <button onClick={this.handleNext}>Next</button>
        )}
        {/* Show "Start Trivia" button if the last message */}
        {currentIndex === messages.length - 1 && (
          <button onClick={this.props.onHideMessages}>Next</button>
        )}
        </div>
      </div>
    );
  }
}

export default PreferancePerformanceIntroduction;
