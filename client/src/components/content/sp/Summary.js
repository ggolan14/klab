import React from 'react';
import {DebuggerModalView} from "../../screens/gameHandle/game_handle";

const Summary = ({SummaryArgs}) => {
    return (
        <label>
            {
                SummaryArgs && (
                    <DebuggerModalView>
                        <div className='meta_debug'>
                            <label>mean1_sum: <span>{SummaryArgs.mean1_sum}</span></label>
                            <label>mean2_sum: <span>{SummaryArgs.mean2_sum}</span></label>
                            <label>mean1_count: <span>{SummaryArgs.mean1_count}</span></label>
                            <label>mean2_count: <span>{SummaryArgs.mean2_count}</span></label>
                            <label>mean1_average: <span>{SummaryArgs.mean1_average}</span></label>
                            <label>mean2_average: <span>{SummaryArgs.mean2_average}</span></label>
                            <label>m1_m2_sum: <span>{SummaryArgs.m1_m2_sum}</span></label>
                            <label>m1_m2_sum_average: <span>{SummaryArgs.m1_m2_sum_average}</span></label>
                            <label>means_dis_sum: <span>{SummaryArgs.means_dis_sum}</span></label>
                            <label>start_points: <span>{SummaryArgs.start_points}</span></label>
                            <label>bonus_attention: <span>{SummaryArgs.bonus_attention}</span></label>
                            <label>points: <span>{SummaryArgs.points}</span></label>
                            <label>final_points: <span>{SummaryArgs.final_points}</span></label>
                            <div>
                                <label><span style={{color: 'blue', marginTop: 10}}>Mean1 values:</span></label>
                                {
                                    SummaryArgs.mean1_res.map(
                                        (val, index) => (
                                            <label key={'0' + index}>{val}</label>
                                        )
                                    )
                                }
                            </div>

                            <div
                                style={{marginTop: 20}}
                            >
                                <label><span style={{color: 'blue', marginTop: 10}}>Mean2 values:</span></label>
                                {
                                    SummaryArgs.mean2_res.map(
                                        (val, index) => (
                                            <label key={'1'+index}>{val}</label>
                                        )
                                    )
                                }
                            </div>
                        </div>

                    </DebuggerModalView>
                )
            }
        </label>
    )
};

export default Summary;


