import React, { Component } from 'react';


class TriviaIntroduction extends Component {
    
  constructor(props) {
    const message_1="This study includes two parts. In the first part, you will play the trivia game and can win a bonus based on your performance. In the second part, you will fill out a food preference survey with no bonus. Note that you should not leave or stop responding until you have completed the entire study and have received your completion code. ";
    const message_2="In this game, you will be presented with a multiple-choice trivia question. Your task is to think of the correct answer to the question and keep it in your mind. After the question is presented and you decide on your answer, the correct answer will be revealed and you will be asked to report whether it matches the one you had in mind. If the correct answer is the one you had in mind, you will you will receive a 1£ bonus. If the correct answer is not the one you had in mind, you will not receive a bonus.";
    const message_3="Let’s try it out! You will now go through 3 practice rounds of the trivia game. Note: the goal of the practice rounds is to help you understand the game. You will not gain any bonus in these rounds and your answers will not be recorded. You will be notified when the practice is over and the real game starts. "
    //const message_4="You will now play the trivia game for real bonus. You will play one round of the trivia game. Remember: If the correct answer is the one you had in mind, you will receive a 1£ bonus!"
    super(props);

    console.log("---> messageIndex="+props.messageIndex)
    
    this.state = {
      messages: [
        message_1,
        message_2,
        message_3 
       // message_4
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
      <div>
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
