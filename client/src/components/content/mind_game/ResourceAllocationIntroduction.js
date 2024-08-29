import React, { Component } from 'react';
import './gameStyles.css';
import { formatPrice } from '../../utils/StringUtils';
class ResourceAllocationIntroduction extends Component {
    
  constructor(props) {
    super(props);

    const message_1 =  (
      <span>
        <p>
         Imagine that you are a manager at a large company. Two employees named Bill and James also work at the company. Bill and James both do the same job and make the same salary each year. This year, Bill and James received the same evaluations, which were the highest in the company. The company has decided to reward Bill and James for their exceptionally good work.
         The company has a total of three concert packages to give Bill and James, each worth $500. These packages include seats, VIP passes, and free food. The packages are valid for the next few weeks, so if no one gets them, they will be wasted. 
        </p>
      </span>
    );
    
    const message_2 = (
      <span>
        <p>
        You have decided to flip a coin. If it lands on Heads, you will give the package to Bill; if it lands on Tails, you will give the package to James.
        You flipped the coin and it landed on Heads, so you gave Bill the extra package. Both employees know that your decision was made by a coin flip.
        </p>
      </span>
    );
    const message_3 = (
      <span>
        <p>
        <br></br>
        Let's try it out.
        <br></br>
        <br></br>
        You will now go through 3 <b>practice</b> rounds of mind game.
        <br></br>
        Note: The goal of the practice rounds is to help you understand the game.  You will not gain any bonus in these rounds, and your answers will not be recorded.  
        you will be notified when the practice is over and the real game starts.
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

export default ResourceAllocationIntroduction;
