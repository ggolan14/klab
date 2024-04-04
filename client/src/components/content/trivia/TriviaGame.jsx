// Import React and the JSON data
import React, { useState } from 'react';
import jsonData from './trivia_questions.json';
import './TriviaGame.css'; // Import the CSS file
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import CorrectAnswerConfirmation from './CorrectAnswerConfirmation'; // Import your NextConfirmationDialog component



// Define a functional component
const TriviaGame = (props) => {
  // State to hold the current question index and whether the confirmation dialog should be shown
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const totalQuestions = jsonData.length;
  const ThisExperiment = 'Trivia';
  
  

  // Function to handle navigation to the next question
  const goToNextQuestion = () => {
    // Show confirmation dialog
    
    setShowConfirmationDialog(true);
  };

  // Function to handle confirmation dialog cancellation
  const handleCancelConfirmation = () => {
    setShowConfirmationDialog(false);
  };

  // Function to handle confirmation dialog confirmation
  const handleConfirmConfirmation = () => {
    NewLogs({
      user_id: 123,
      exp: ThisExperiment,
      running_name: "myRunning",
      action: 'G.L',
      type: 'LogGameType',
      more_params: {
          local_t: getTimeDate().time,
          local_d: getTimeDate().date,
      },
  }).then((res) => {
      this.START_APP_MIL = Date.now();
      this.props.SetLimitedTime(true);
      this.setState({isLoading: false});
  });
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setShowConfirmationDialog(false);
  };
  const currentQuestion = jsonData[currentQuestionIndex];
  
  let content = null;
  if(showConfirmationDialog === true){
    content = (<div>
      <CorrectAnswerConfirmation
          onCancel={handleCancelConfirmation}
          onConfirm={handleConfirmConfirmation}
          correctAnswer={getCorrectAnswer()}
         />
    </div>
    )
  }
  else if(currentQuestionIndex===totalQuestions){
    console.log("currentQuestionIndex==totalQuestions")
    
    content = (<div>
      <label>You successfully finished the trivia experiment</label>
    </div>
    )
  }
  else if(currentQuestionIndex < totalQuestions){
    console.log("---> currentQuestionIndex="+currentQuestionIndex+"  totalQuestions="+totalQuestions)
    content=(
    <div>
    <h3><label style={{ fontWeight: 'bold' }}>Question#{currentQuestionIndex+1}:</label> <label>{jsonData[currentQuestionIndex].question}</label></h3>
    {/* Render answer options */}
    <ul>
    {jsonData[currentQuestionIndex].answers.map((answer, index) => (
      <li key={answer.option}>
        <label>
        <span style={{ color: 'blue' }}>Option#{answer.option}</span> <span style={{ color: 'green' }}>{answer.text}</span>
        </label>
      </li>
    ))}
    </ul>
    <button onClick={goToNextQuestion}>I have an answer in my mind.</button>
    
  </div>
    )
  } 
  else{
    content = (<div>
      content= <CorrectAnswerConfirmation></CorrectAnswerConfirmation>
    </div>
    )
   

  }
 
  function getCorrectAnswer(){
    const correctAnswer = jsonData[currentQuestionIndex].answers.map((answer, index) => {  
      console.log("---> Answer: "+answer.text);
      if (answer.option === currentQuestion.correct_answer) {
        return answer.text;
      }
    }).find(answer => answer !== undefined);
  
    return correctAnswer;
  }

  // Render the component
  return (
    <div className="quiz-container">
      <h1>Trivia Quiz</h1>
      {content}
    </div>
  );
};

// Export the component
export default TriviaGame;
