import React from 'react';
import {DebuggerModalView} from "../../screens/gameHandle/game_handle";



const Summary = ({SummaryArgs}) => {
    console.log("---> in Summary3")

   // const DebugMode = Object.keys(SummaryArgs.debug_args).length > 0;

    return (
        <div>
           You will now receive a food preference survey. Note that you cannot leave or stop responding until you have completed the entire study and have received your completion code, or else you will not receive compensation.
        </div>
    )
};

export default Summary;
