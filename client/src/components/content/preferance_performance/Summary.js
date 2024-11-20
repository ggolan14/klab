import React from 'react';

const Summary = ( debug_args ) => {
     let final_score = debug_args.GameBonus;
     
     
    
     console.log("---> final_score="+final_score+"   debug_args"+debug_args.Game)
     return (
        <label>
            Yoy completed the game with <b style={{ fontSize: "24px" }}>{final_score}</b> points.<br/>
            Please press the button below to complete your submission<br/>
        </label>
    )
};

export default Summary;


