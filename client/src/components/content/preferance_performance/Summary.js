import React from 'react';

const Summary = (props) => {
     const final_bonus = props.summary_args.reward_sum;
     console.log("---> final_bonus="+final_bonus)
     return (
        <label>
            Please press the button below to complete your submission<br/>
        </label>
    )
};

export default Summary;


