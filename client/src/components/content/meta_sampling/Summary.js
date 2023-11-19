import React from 'react';
import PropTypes from 'prop-types';

const span_style = {
    marginLeft: '0.3rem',
    marginRight: '0.3rem',
    fontWeight: 'bold',
    color: 'darkmagenta'
}

const Summary = ({SignOfReward, ShowUpFee, GameBonus, RandomRound, IsCorrect}) => {

    return (
        <label>
            The computer randomly selected one round.<br/>
            Randomly selected round number={RandomRound}.<br/>
            {
                IsCorrect === 'True' && (
                    <>In this round your final answer was correct and thus <span style={span_style}>a bonus of {SignOfReward}{GameBonus}</span> Will be transferred to your account in the next 48 hours.</>
                )
            }
            {
                IsCorrect === 'False' && (
                    <>In this round your final answer was incorrect thus you will not receive a bonus payment.</>
                )
            }
            <br/>
        </label>
    )
};

export default Summary;


