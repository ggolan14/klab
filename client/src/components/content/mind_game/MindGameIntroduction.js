import React, { Component } from 'react';
import './gameStyles.css';
import { formatPrice } from '../../utils/StringUtils';
class MindGameIntroduction extends Component {
    
  constructor(props) {
    super(props);
    console.log("===== this.props.signOfReward=" + this.props.signOfReward);

    const isRepeated = this.props.gameCondition === "Repeated";

    const part1 = (
      <span>
        <h2>Welcome to the study, let's start.</h2>
        <br />
        This study includes two parts.
        <br />In the first part, you will play the mind-game and can win a bonus {isRepeated ? "depending on your performance." : "depending on your performance."}
        <br />In the second part, {isRepeated ? "you will fill out a food preference survey and there will be no bonus." : "you will be asked to answer several questions about your self-assessment and preferences and there will be no bonus."}
        <br /><br />
        Note that you should not leave or stop responding until you have completed the entire study and have received your completion code.
        If you leave or stop responding before completing the two parts, you will not receive compensation.
        <br />
      </span>
    );

    const part2 = isRepeated ? (
      <span>
        <p>
        <h2><b>Welcome to the Mind game!</b></h2>
        <br></br>
        In this game, you will be asked to think of a number between 1 and 6 and keep it in your mind. Then, you will roll a virtual die.
        You wil be asked to report if the number you rolled is the one you had in mind.
        <br></br>
        Once you completed the study, the computer will randomly choose <b>one</b> round of the mind game.
        <br></br>
        If in this selected round you reported that the number you rolled <b>is</b> the one that you hade in mind, you <b>will</b> receive a {formatPrice(1,this.props.signOfReward)} bonus.
        <br></br>
        If in this selected round you reported that the number you rolled <b>is not</b> the one you had in mind, you <b>will not</b> receive a bonus.
        <br></br>
        </p>
      </span>
    ) : (
      <span>
        <p>
        <h2><b>Welcome to the Mind game!</b></h2>
        <br></br>
        In this game, you will be asked to think of a number between 1 and 6 and keep it in your mind. Then, you will roll a virtual die.
        You wil be asked to report if the number you rolled is the one you had in mind.
        <br></br>
        If the number you rolled <b>is</b> the one you had in mind, you <b>will</b> receive a {formatPrice(1,this.props.signOfReward)} bonus.
        <br></br>
        if the number you rolled <b>is not</b> the one you had in mind, you <b>will not</b> receive a bonus.
        <br></br>
        </p>
      </span>
    );

    const message_3 = (
      <span>
        Let’s try it out!<br /><br />You will now go through 3 practice rounds of the mind game.<br />Note: the goal of the practice rounds is to help you understand the game.<br />You will not gain any bonus in these rounds and your answers will not be recorded.<br />You will be notified when the practice is over and the real game starts. 
      </span>
    );

    this.state = {
      messages: [part1, part2, message_3],
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

  render() {
    const { messages, currentIndex } = this.state;

    return (
      <div className="trivia-container">
        
        {/* Display the current message */}
        <p>{messages[currentIndex]}</p>
        {/* Show "Next" button if not the last message */}
        {currentIndex < messages.length - 1 && (
          <button onClick={this.handleNext}>Next</button>
        )}
        {/* Show "Start Trivia" button if the last message */}
        {currentIndex === messages.length - 1 && (
          <button onClick={this.props.onHideMessages}>Start Practice</button>
        )}
      </div>
    );
  }
}

export default MindGameIntroduction;
