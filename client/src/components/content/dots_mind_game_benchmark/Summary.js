import React from 'react';

const Summary = ( debug_args ) => {
     let final_score = debug_args.GameBonus;
     
     
     
    
     console.log("---> final_score="+final_score+"   debug_args"+debug_args.Game)
     return (
        <label>
            Your bonus is : <b style={{ fontSize: "24px" }}>{final_score} {debug_args.SignOfReward}</b><br/>
           
        </label>
    )
};

export default Summary;