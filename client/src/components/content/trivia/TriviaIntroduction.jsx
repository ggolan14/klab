import React, { Component } from 'react';
import './gameStyles.css';

class TriviaIntroduction extends Component {
    
  constructor(props) {
    super(props);

    const message_1 =  (
      <span>
        This study includes two parts.<br/>In the first part, you will play the trivia-game and can win a bonus based on your performance.<br/>In the second part, you will be asked to answer several questions about your self assessment and preferences and there will be no bonus.<br/>Note that you should not leave or stop responding until you have completed the entire study<br/>and have received your completion code.<br/>If you leave or stop responding before completing the two parts,<br/>you will not receive compensation.<br/>
      </span>
    );
    const message_2 = (
      <span>
        In this game, you will be presented with a multiple-choice trivia question.<br/>Your task is to think of the correct answer to the question and keep it in your mind.<br/>After the question is presented and you decide on your answer,<br/>the correct answer will be revealed and you will be asked to report whether it matches the one you had in mind.<br/>If the correct answer <strong>is</strong> the one you had in mind, you will you will receive <strong>a £1 bonus.</strong><br/>If the correct answer <strong>is not</strong> the one you had in mind, you <strong>will not receive</strong> a bonus.
      </span>
    );
    const message_3 = (
      <span>
        Let’s try it out!<br/><br/>You will now go through 3 practice rounds of the trivia game.<br/>Note: the goal of the practice rounds is to help you understand the game.<br/>You will not gain any bonus in these rounds and your answers will not be recorded.<br/>You will be notified when the practice is over and the real game starts. 
      </span>
    );

    this.state = {
      messages: [
        message_1,
        message_2,
        message_3 
      ],
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
      <div className="introduction">
        {currentIndex === 1 && <h2>Welcome to the trivia game!</h2>}
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

export default TriviaIntroduction;
