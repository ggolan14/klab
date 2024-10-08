import React from 'react';
import {DebuggerModalView} from "../../screens/gameHandle/game_handle";
import { formatPrice } from '../../utils/StringUtils';



const Summary = ({SummaryArgs}) => {
   
     return (
        <label>
            Thank you for your participation.
            Your bonus is {formatPrice(SummaryArgs.reward_sum , SummaryArgs.sign_of_reward)} , and will be added to your participation payment.<br/>
            To receive your payment, please click the button below.
        </label>
    )
};

export default Summary;
