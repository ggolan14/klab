import React from 'react';

const Summary = ({SummaryArgs}) => {
    return (
        <div>
            {
                SummaryArgs && (Object.keys(SummaryArgs).length > 0) && (
                    <>
                        <label>q_cup:<span>{SummaryArgs.q_cup}</span></label>
                        <label>q_no_cup:<span>{SummaryArgs.q_no_cup}</span></label>
                        <label>keepT:<span>{SummaryArgs.keepT}</span></label>
                        <label>throwT:<span>{SummaryArgs.throwT}</span></label>
                        <label>placeT:<span>{SummaryArgs.placeT}</span></label>
                        <label>dontPlaceT:<span>{SummaryArgs.dontPlaceT}</span></label>
                        <label>keep:<span>{SummaryArgs.keep}</span></label>
                        <label>throw:<span>{SummaryArgs.throw_}</span></label>
                        <label>place:<span>{SummaryArgs.place}</span></label>
                        <label>dontPlace:<span>{SummaryArgs.dontPlace}</span></label>
                        <label>GamePoints:<span>{SummaryArgs.game_points}</span></label>
                        <label>ExchangeRatio:<span>{SummaryArgs.exchange_ratio}</span></label>
                        <label>Probability:<span>{SummaryArgs.probability}</span></label>
                        <label>BonusEndowment:<span>{SummaryArgs.bonus_endowment}</span></label>
                        <label>ShowUpFee:<span>{SummaryArgs.show_up_fee}</span></label>
                        <label>TotalCups:<span>{SummaryArgs.total_cups}</span></label>
                        <label>Trials:<span>{SummaryArgs.trials}</span></label>
                        <label>Avg_cup_num:<span>{SummaryArgs.Avg_cup_num}</span></label>
                        <label>Total_milli:<span>{SummaryArgs.Total_milli}</span></label>
                        <label>Total_time:<span>{SummaryArgs.Total_time}</span></label>
                    </>
                )
            }
        </div>
    )
};

export default Summary;


