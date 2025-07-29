import React from 'react';

const Summary = (debug_args) => {
    let final_score = debug_args.GameBonus;




    console.log("---> final_score=" + final_score + "   debug_args" + debug_args.Game)
    return (

        <label style={{ fontSize: "24px", width: "900px" }}>
            Your bonus is <b style={{ fontSize: "24px" }}>{final_score} {debug_args.SignOfReward}</b>.<br />
            Before you go, we would like to disclose that all the information provided to you in this study was true, except for one detail that may have been inaccurate.
            Different information was provided to different participants in this study.
            Specifically, you may have received inaccurate information on the percentage of trials in which more dots appeared on each side.
            This was done with the goal of understanding how different types of information affect people's decisions
            in the dots task.
            <br /><br />
            <span style={{ fontWeight: "bold" }}>We thank you again for your participation.</span>
        </label>


    )
};

export default Summary;