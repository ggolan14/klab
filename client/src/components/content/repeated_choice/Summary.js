import React from 'react';
import PropTypes from 'prop-types';

const span_style = {
    marginLeft: '0.3rem',
    marginRight: '0.3rem',
    fontWeight: 'bold',
    color: 'darkmagenta'
}

const Summary = ({SignOfReward, ShowUpFee, GameBonus, summary_args}) => {
    return (
        <label
          style={{
              maxWidth: '90%'
          }}
        >
            {
                summary_args.language === 'German' ? (
                  <>
                      Eine Entscheidungsaufgabe wurde zufällig ausgewählt und Ihre
                      <span
                        style={span_style}
                      >
                          Bonuszahlung beträgt {SignOfReward}{GameBonus.toString()}
                      </span>
                      Zusätzlich erhalten Sie für Ihre Teilnahme eine Aufwandsentschädigung von
                      <span
                        style={span_style}
                      >
                          {SignOfReward}{ShowUpFee}
                      </span>.
                  </>
                ) : (
                  <>
                      One task has been randomly selected for your bonus payment and you will receive
                      <span
                        style={span_style}
                      >
                          a bonus of {SignOfReward}{GameBonus.toString()}
                      </span>
                      in addition to the
                      <span
                        style={span_style}
                      >
                          {SignOfReward}{ShowUpFee} show up fee
                      </span>.
                  </>
                )
            }
        </label>
    )
};


export default Summary;


