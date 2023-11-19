import React from 'react';
import PropTypes from 'prop-types';

const span_style = {
    marginLeft: '0.3rem',
    marginRight: '0.3rem',
    fontWeight: 'bold',
    color: 'darkmagenta'
}

const Summary = ({SignOfReward, ShowUpFee}) => {
    return (
        <label>
            Exp summary
        </label>
    )
};

// Summary.propTypes = {
//     SignOfReward: PropTypes.string.isRequired,
//     GameBonus: PropTypes.number.isRequired,
//     ShowUpFee: PropTypes.number.isRequired,
// };

export default Summary;


