import React from 'react';

const Summary = (props) => {
     const final_bonus = props.summary_args.reward_sum;
     console.log("---> final_bonus="+final_bonus)
     return (
        <label
        >
            Based on the points you earned, your bonus payment is {props.SignOfReward}{final_bonus}.<br/>
            You will get your bonus after all participants will finish the study
        </label>
    )
};

export default Summary;


