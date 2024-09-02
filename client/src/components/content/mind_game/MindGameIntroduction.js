import React, { Component } from 'react';
import './gameStyles.css';
import { formatPrice } from '../../utils/StringUtils';
class MindGameIntroduction extends Component {
    
  constructor(props) {
    super(props);

    const message_1 =  (
      <span>
        <p>This study includes two parts. 
        <br></br>
        In the first part, you will play the “mind-game” and can win a bonus depending on your performance. 
        <br></br>
        In the second part, you will be asked to answer several questions about your self assessment and preferences and there will be no bonus.
        <br></br>
        <br></br>
        Note that you should not leave or stop responding until you have completed the entier study and have recieved your completion code.
        If you leave or stop responding before completing the two games, you will not recieve compension.

      </p>
      </span>
    );
    const message_2 = (
      <span>
        <p>
        <h2><b>Welcome to the Mind game!</b></h2>
        <br></br>
        In this game, you will be asked to think of a number between 1 and 6 and keep it in your mind. Then, you will roll a virtual die.
        You wil be asked to report if the number you rolled is the one you had in mind.
        <br></br>
        If the number you rolled <b>is</b> the one you had in mind, you <b>will</b> receive a {formatPrice(1,this.props.signOfReward)} bonus.
        <br></br>
        if the number you rolled <b>is not</b> the one you had in mind, you <b>will not</b> recieve a bonus.
        <br></br>
        </p>
      </span>
    );
    const message_3 = (
      <span>
        <p>
        <br></br>
        Let's try it out!
        <br></br>
        <br></br>
        You will now go through 3 <b>practice</b> rounds of mind game.
        <br></br>
        Note: The goal of the practice rounds is to help you understand the game.  You will not gain any bonus in these rounds, and your answers will not be recorded.  
        You will be notified when the practice is over and the real game starts.
      </p>
      </span>
    );

    this.state = {
      messages: [
        message_1,
        message_2,
        message_3,
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
