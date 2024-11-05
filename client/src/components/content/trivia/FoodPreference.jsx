import React, { Component } from 'react';

class FoodPreference extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            selectedOption: '',
            nonRobotAnswer: ''
        };
    }

    handleNext = () => {
        this.setState({ currentStep: 2 });
    };

    handleSubmit = () => {
      const { selectedOption,nonRobotAnswer } = this.state;
      const currentQuestion = "Which of the following options best describes your dietary preferences?";
      const answer = selectedOption; // Adjust for 0-based index
  
      // If no answer is provided or the last question has been reached, exit early
      if (typeof answer === 'undefined' || answer === null) return;
  
      // Create a row of data to insert into the database
      const db_row = {
        QuestionIndex: 13,
        QuestionType: "FoodPreference",
        Answer: answer,
        Keyword: "N/A", // No specific keyword for this component
        TotalYesAnswers: "N/A",
        TotalNoAnswers: "N/A",
        GameCondition: "Repeated",
        HaveAnAnswerTime: "N/A", // Timing data could be inserted here
        ConfirmationTime: "N/A",  // Timing data could be inserted here
      };
  
      // Insert the row into the database
      this.props.insertGameLine(db_row);
      console.log(`Saving to database: Question - ${currentQuestion.question}, Answer - ${answer}`);
  


      const currentQuestion2 = "What is your favorite breakfast food?";
      const answer2 = nonRobotAnswer; // Adjust for 0-based index
      if (typeof answer === 'undefined' || answer === null) return;
  
      // Create a row of data to insert into the database
      const db_row2 = {
        QuestionIndex: 14,
        QuestionType: "FoodPreference",
        Answer: answer2,
        Keyword: "N/A", // No specific keyword for this component
        TotalYesAnswers: "N/A",
        TotalNoAnswers: "N/A",
        GameCondition: "Repeated",
        HaveAnAnswerTime: "N/A", // Timing data could be inserted here
        ConfirmationTime: "N/A",  // Timing data could be inserted here
      };

      // If it's the last question, send the data to the database
       this.props.insertGameLine(db_row2);
        this.props.sendDataToDB(true);
      
    };

    handleOptionChange = (e) => {
        this.setState({ selectedOption: e.target.value });
    };

    handleTextChange = (e) => {
        this.setState({ nonRobotAnswer: e.target.value });
    };

    render() {
        const { currentStep, selectedOption, nonRobotAnswer } = this.state;

        return (
            <div className="trivia-container">
                {currentStep === 1 && (
                    <div>
                        <p>Which of the following options best describes your dietary preferences?</p>
                        <div onChange={this.handleOptionChange}>
                            <label><input type="radio" name="diet" value="1" checked={selectedOption === '1'} /> Omnivorous (can eat everything)</label><br />
                            <label><input type="radio" name="diet" value="2" checked={selectedOption === '2'} /> Vegetarian (do not eat meat or seafood)</label><br />
                            <label><input type="radio" name="diet" value="3" checked={selectedOption === '3'} /> Pescatarian (eat seafood but not meat)</label><br />
                            <label><input type="radio" name="diet" value="4" checked={selectedOption === '4'} /> Flexitarian (mostly vegetarian but occasionally eat meat or seafood)</label><br />
                            <label><input type="radio" name="diet" value="5" checked={selectedOption === '5'} /> Vegan (do not eat meat, seafood, or any animal product)</label><br />
                            <label><input type="radio" name="diet" value="6" checked={selectedOption === '6'} /> Mostly vegan (do not eat meat or seafood, but occasionally eat eggs or milk)</label>
                        </div>
                        <button onClick={this.handleNext}>Next</button>
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <p>What is your favorite breakfast food?</p>
                        <textarea
                            value={nonRobotAnswer}
                            onChange={this.handleTextChange}
                            style={{
                                width: '100%',
                                height: '100px',
                                border: '2px solid lightgray',
                                borderRadius: '4px',
                                padding: '10px',
                            }}
                            placeholder="Enter your answer here"
                        />
                        <br /><br />
                        <button onClick={this.handleSubmit}>Submit</button>
                    </div>
                )}
            </div>
        );
    }
}

export default FoodPreference;
