import React from 'react';
import {DebuggerModalView} from "../../screens/gameHandle/game_handle";



const Summary = ({SummaryArgs}) => {
   
     return (
        <label>
            Based on the points you earned, your bonus payment is {SummaryArgs.sign_of_reward}{SummaryArgs.reward_sum}.<br/>
            You will get your bonus after all participants will finish the games<br/>
            Please press the button below to complete the exit survey.<br/>
            The short survey includes only a few questions, after which you will get your completion code.<br/>
            Important: we will not be able to pay you if you do not complete the survey!
        </label>
    )
};

export default Summary;
