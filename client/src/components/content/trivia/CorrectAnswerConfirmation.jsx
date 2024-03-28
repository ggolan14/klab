import './CorrectAnswerConfirmation.css'; // Import the CSS file
const CorrectAnswerConfirmation = ({ onCancel, onConfirm, correctAnswer}) => {
    var correctAns=correctAnswer;
    console.log("---> correctAns="+correctAns)
    return (
      <div className="next-confirmation-dialog">
        
        <p>
           <br></br>The correct answer is <b>{correctAns}</b> . is that what you had in mind ?<br></br>
           <strong>Note: you will receive a 1£ bonus only if you report “yes”, and this round is selected.</strong><br></br>
        </p>
        <button onClick={onConfirm}>Yes</button>
        
        <button onClick={onConfirm}>No</button>
      </div>
    );
  };
  
  export default CorrectAnswerConfirmation;
  