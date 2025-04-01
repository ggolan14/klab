import React from 'react';

const Summary = ( { SummaryArgs } ) => {
    var mysummary=SummaryArgs;
     console.log("---> mysummary=",mysummary)
     let final_score=mysummary.reward_sum
     ;
    
     console.log("---> final_score="+final_score)
     return (
        <label>
            You completed the game with <b style={{ fontSize: "24px" }}>{final_score}</b> points.<br/>
            Please press the button below to complete your submission<br/>
        </label>
    )
};

export default Summary;


