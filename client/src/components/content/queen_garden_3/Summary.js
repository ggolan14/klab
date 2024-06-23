import React from 'react';

const Summary = (props) => {
     const final_bonus = props.summary_args.reward_sum;
     console.log("---> final_bonus="+final_bonus)
     return (
        <label>
            Please press the button below to complete the exit survey.<br/>
            The short survey includes only a few questions. 
        </label>
    )
};

export default Summary;


