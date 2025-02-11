import React, { Component } from 'react';

class Part4Selection extends Component {
  constructor(props) {
    super(props);
    const shuffledOptions = this.shuffleArray([
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
    ]);

    this.state = {
      selectedButtonChoice: '', // Stores selected choice
      shuffledOptions: shuffledOptions, // Store shuffled options
      optionsOrder: shuffledOptions.map(option => option.value).join('-') // Concatenated order
    };
  }

  // Function to shuffle an array using Fisher-Yates algorithm
  shuffleArray(array) {
    let shuffledArray = [...array]; // Create a copy of the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  handleRadioChange = (event) => {
    this.setState({ selectedButtonChoice: event.target.value });
  };

  handleSubmitChoice = () => {
    console.log("this.state.optionsOrder = "+this.state.optionsOrder)
    if (this.state.selectedButtonChoice) {
      const db_row = {
        Question: "Introduction - Select single button",
        Answer: this.state.selectedButtonChoice,
        OptionsOrder: this.state.optionsOrder, // Save order of options
      };

      this.props.insertLine(db_row);
      this.props.onComplete(); // Proceed to game
    } else {
      alert("Please select a button option before proceeding.");
    }
  };

  render() {
    return (
      <div style={{ lineHeight: '2.6' }}>
        <h2 style={{ textAlign: "center" }}><b>Pre-Commitment</b></h2>
        <p>Before the game begins, you have the option to select a single button for the entire game:</p>
        {this.state.shuffledOptions.map(option => (
          <label key={option.value} style={{ display: 'block', textAlign: 'left' }}>
            <input
              type="radio"
              value={option.value}
              checked={this.state.selectedButtonChoice === option.value}
              onChange={this.handleRadioChange}
              style={{ marginRight: '8px' }}
            />
            {option.label}
          </label>
        ))}
        <div className="button-container">
          <button className="shared-button" onClick={this.handleSubmitChoice} disabled={!this.state.selectedButtonChoice}>
            Submit my choice
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          Good luck and enjoy the game!
        </div>
      </div>
      
    );
  }
}

export default Part4Selection;
