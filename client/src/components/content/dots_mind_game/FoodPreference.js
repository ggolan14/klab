import React, { Component } from 'react';

const DIETARY_PREFRENCES_QUESTION = "Which of the following options best describes your dietary preferences?";
const NON_ROBOT_QUESTIO = "What is your favorite breakfast food?";

class FoodPreference extends Component {
    constructor(props) {
        super(props);
        console.log("----> in FoodPreference constructor")
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
        const { selectedOption, nonRobotAnswer } = this.state;
        
        if (!selectedOption || !nonRobotAnswer) return; // Ensure values exist
    
        const db_row1 = {
            QuestionIndex: 13,
            QuestionType: "FoodPreference",
            Question:DIETARY_PREFRENCES_QUESTION,
            Answer: selectedOption,
            GameCondition: "Repeated"
        };
    
        const db_row2 = {
            QuestionIndex: 14,
            QuestionType: "FoodPreference",
            Question:NON_ROBOT_QUESTIO,
            Answer: nonRobotAnswer,
            GameCondition: "Repeated"
        };
    
        this.props.insertGameLine(db_row1);
        this.props.insertGameLine(db_row2);
    
        // Ensure sendGameDataToDB is executed, then move forward
        if (typeof this.props.sendGameDataToDB === "function") {
            const result = this.props.sendGameDataToDB(true);
            
            if (result && typeof result.then === "function") {
                // If sendGameDataToDB returns a promise, wait for it to complete
                result.then(() => {
                    this.props.Forward(); // Move to next step (step 4)
                }).catch((error) => {
                    console.error("Error sending game data to DB:", error);
                    this.props.Forward(); // Proceed even if there was an error
                });
            } else {
                // If sendGameDataToDB is not a promise, call Forward immediately
                this.props.Forward();
            }
        } else {
            console.warn("sendGameDataToDB is not a function");
            this.props.Forward();
        }
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
                        <button disabled={!selectedOption} onClick={this.handleNext}>Next</button>
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
                        <button disabled={!nonRobotAnswer} onClick={this.handleSubmit}>Submit</button>
                    </div>
                )}
            </div>
        );
    }
}

export default FoodPreference;
