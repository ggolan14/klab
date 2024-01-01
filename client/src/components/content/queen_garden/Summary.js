import React from 'react';
import PropTypes from 'prop-types';

const span_style = {
    marginLeft: '0.3rem',
    marginRight: '0.3rem',
    fontWeight: 'bold',
    color: 'darkmagenta'
}

const Summary = (props) => {
    return (
        <label
        >
            Based on the points you earned, your bonus payment is {props.SignOfReward}{props.GameBonus}.<br/>
            You will get your bonus after all participants will finish the study
        </label>
    )
};
// SignOfReward
// ShowUpFee
// GameBonus


export default Summary;


