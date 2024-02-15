import React from 'react';

const Summary = (props) => {
     const final_bonus = props.summary_args.reward_sum;
     console.log("---> final_bonus="+final_bonus)
     return (
        <label>
            Based on the points you earned, your bonus payment is {props.SignOfReward}{final_bonus}.<br/>
            You will get your bonus after all participants will finish the study<br/>
            Please press the button below to complete the exit survey.<br/>
            The short survey includes only a few questions, after which you will get your completion code.<br/>
            Important: we will not be able to pay you if you do not complete the survey!
        </label>
    )
};

export default Summary;


