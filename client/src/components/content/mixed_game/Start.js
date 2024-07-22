import React, { useState } from 'react';
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";


const ThisExperiment = 'MixedGame';

let UserId = 'empty';
let RunningName = '-';

const Start = (props) => {
  let RunCounter = KeyTableID();
  console.log("--------> MixedGame RunCounter="+RunCounter)
  //this.props=props;
  const [step, setStep] = useState(1); // Track current step of the game

  const handleNext = () => {
    const db_row = {
      RoundNumber: step,  // total 
      Step: step,
    };
    console.log("111")
    //insertGameLine(db_row);
    console.log("222")
    setStep(step + 1);
    if(step==10){
    //  sendDataToDB();
    }
  };

  const insertGameLine = (db_row) => {
    console.log("333")
   // this.props.insertGameLine(db_row);
    console.log("444")
  }
  
  return (
    <div className="App">
      <DebuggerModalView>
              
              <p>Game mode: ttt</p>
             
              
             
            </DebuggerModalView>
      TTTTT
    </div>
  );
};

export default Start;
