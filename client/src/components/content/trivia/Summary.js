import React from 'react';
import {DebuggerModalView} from "../../screens/gameHandle/game_handle";



const Summary = ({SummaryArgs}) => {
   
     return (
        <label>
            Thank you for your participation.
            You earned a bounus payment of {SummaryArgs.sign_of_reward}{SummaryArgs.reward_sum} which will be added to your participation payment.<br/>
            In order to recieve your compensation, please press on the button below.

        </label>
    )
};

export default Summary;
