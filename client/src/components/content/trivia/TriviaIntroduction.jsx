import React, { Component } from 'react';
import './gameStyles.css';
import { formatPrice } from '../../utils/StringUtils';

class TriviaIntroduction extends Component {

  constructor(props) {
    super(props);
    console.log("===== this.props.signOfReward=" + this.props.signOfReward);

    const isRepeated = this.props.gameCondition === "Repeated";

    const part1 = (
      <span>
        <h2>Welcome to the study, let's start.</h2>
        <br />
        This study includes two parts.
        <br />In the first part, you will play the trivia-game and can win a bonus {isRepeated ? "based on your performance." : "depending on your performance."}
        <br />In the second part, {isRepeated ? "you will fill out a food preference survey and there will be no bonus." : "you will be asked to answer several questions about your self-assessment and preferences and there will be no bonus."}
        <br /><br />
        Note that you should not leave or stop responding until you have completed the entire study and have received your completion code.
        If you leave or stop responding before completing the two parts, you will not receive compensation.
        <br />
      </span>
    );

    const part2 = isRepeated ? (
      <span>
      In this game, you will be presented with multiple-choice trivia questions, ranging in difficulty.
      <br />
      Your task is to think of the correct answer to the question and keep it in your mind.
      <br />After the question is presented and you decide on your answer, the correct answer will be revealed, and you will be asked to report whether it matches the one you had in mind.
      <br />Once you complete the study, the computer will randomly choose one round of the trivia game.
	  <br /> If the correct answer <strong>is</strong> the one you had in mind, you will receive a <strong>{formatPrice(1, this.props.signOfReward)} bonus.</strong> 
      <br /> If the correct answer <strong>is not</strong> the one you had in mind, you <strong>will not receive</strong> a bonus.
    </span>
    ) : (
      <span>
      In this game, you will be presented with multiple-choice trivia questions, ranging in difficulty.
      <br />
      Your task is to think of the correct answer to the question and keep it in your mind.
      <br />After the question is presented and you decide on your answer, the correct answer will be revealed, and you will be asked to report whether it matches the one you had in mind.
      <br /> If the correct answer <strong>is</strong> the one you had in mind, you will receive a <strong>{formatPrice(1, this.props.signOfReward)} bonus.</strong> 
      <br /> If the correct answer <strong>is not</strong> the one you had in mind, you <strong>will not receive</strong> a bonus.
    </span>
    );

    const message_3 = (
      <span>
        Let’s try it out!<br /><br />You will now go through 3 practice rounds of the trivia game.<br />Note: the goal of the practice rounds is to help you understand the game.<br />You will not gain any bonus in these rounds and your answers will not be recorded.<br />You will be notified when the practice is over and the real game starts. 
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
    console.log("===> in handleNext  currentIndex="+currentIndex)
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
    console.log("===> in render  currentIndex="+currentIndex)
    return (
      <div className="trivia-container">
        {currentIndex === 1 && <h2>Welcome to the trivia game!</h2>}
        {/* Display the current message */}
        <p><br /><br />{messages[currentIndex]}</p>
        {/* Show "Next" button if not the last message */}
        {currentIndex < messages.length - 1 && (
          <button className="fixed-button" onClick={this.handleNext}>Next</button>
        )}
        {/* Show "Start Trivia" button if the last message */}
        {currentIndex === messages.length - 1 && (
          <button className="fixed-button" onClick={this.props.onHideMessages}>Start Practice</button>
        )}
      </div>
    );
  }
}

export default TriviaIntroduction;
