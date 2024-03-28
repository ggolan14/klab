import React from 'react';
import {DebuggerModalView} from "../../screens/gameHandle/game_handle";

const TrialInfo = ({Game, Round, Trial, FinalPay, index}) => {

    const data = (
        <div
            className={'tog_d-sum-l-rp '}
        >
            <label>Game:<span>{Game}</span></label>
            <label>Round <span>{Round}</span></label>
            <label>Trial:<span>{Trial}</span></label>
            <label>FinalPay:<span>{FinalPay}</span></label>
        </div>
    )

    return (
        <div className='tog_d-sum-l-rpi'>
            {/*<label>{index}</label>*/}
            {data}
        </div>
    )
}

const Summary = ({SummaryArgs}) => {

    const DebugMode = Object.keys(SummaryArgs.debug_args).length > 0;

    return (
        <div>
            <label>
                One round from each game you played has been selected at a random and the average of the payoffs have been calculated.<br/>
                Your bonus payment is {SummaryArgs.payment_text}.<br/>
                Please press the key bellow to get your Prolific completion code
            </label>
            {
                DebugMode && (
                    <DebuggerModalView>
                        <div className='tog_debug tog_d-sum'>
                            <div>
                                <label>Total game points: <span>{SummaryArgs.debug_args.game_points}</span></label>
                                <label>Total bonus points: <span>{SummaryArgs.debug_args.total_bonus_points}</span></label>
                                <label>Bonus info: <span>{SummaryArgs.debug_args.bonus_info}</span></label>
                                <label>Random indexes: <span>{SummaryArgs.debug_args.rnd_index}</span></label>
                                <label>Final bonus: <span>{SummaryArgs.debug_args.bonus}</span></label>
                                <label>BonusPoints/ExchangeRatio: <span>{SummaryArgs.debug_args.points_ratio}</span></label>
                            </div>

                            <div className='tog_d-sum-l'>
                                <label>Selected trials:</label>
                                {
                                    SummaryArgs.debug_args.selected_trials.map(
                                        (rp, rp_i) => (
                                            <TrialInfo
                                                {...rp}
                                                key={rp_i}
                                                index={rp_i}
                                            />
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </DebuggerModalView>
                )
            }
        </div>
    )
};

export default Summary;
