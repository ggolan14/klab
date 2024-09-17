import React from 'react';
import {DebuggerModalView} from "../../screens/gameHandle/game_handle";
import { formatPrice } from '../../utils/StringUtils';



const Summary = ({SummaryArgs}) => {
   
     return (
        <label>
            Thank you for your participation.
            Your bounus is {formatPrice(SummaryArgs.reward_sum , SummaryArgs.sign_of_reward)} , and will be added to your participation payment.<br/>
            To recieve your payment, please click below.

        </label>
    )
};

export default Summary;
