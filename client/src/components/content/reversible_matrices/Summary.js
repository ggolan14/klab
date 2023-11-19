import React from 'react';
import {DebuggerModalView} from "../../screens/gameHandle/game_handle";


const DebugMatValues = ({val}) => (
    <div>
        <label>{val.Stage}</label>
        <label>{val.FinalValue1}</label>
        <label>{val.FinalValue2}</label>
        <label>{(Number(val.FinalValue2) || Number(val.FinalValue1) || 0)}</label>
    </div>
)

const Summary = ({SummaryArgs}) => {
    return (
        <>
            {
                SummaryArgs && (
                    <DebuggerModalView>
                        <div className='R_M-SummaryDebug'>
                            <label>GamePoints:<span>{SummaryArgs.game_points}</span></label>
                            <label>TotalMatrixView:<span>{SummaryArgs.total_matrix}</span></label>
                            <label>Bonus:<span>{SummaryArgs.bonus}</span></label>
                            <label>BonusEndowment:<span>{SummaryArgs.bonus_endowment}</span></label>
                            <label>TotalBonus:<span>{SummaryArgs.total_bonus}</span></label>
                            <label>Total pay:<span>{SummaryArgs.total_pay}</span></label>
                            <div className='R_M-SummaryDebugAllVal'>
                                <label>All values:</label>
                                <div>
                                    <label>Stage</label>
                                    <label>FinalValue1</label>
                                    <label>FinalValue2</label>
                                    <label>ValueForBonus</label>
                                </div>
                                {
                                    SummaryArgs.all_values.map(
                                        (val, index) => (
                                            <DebugMatValues key={index} val={val} />
                                        )
                                    )
                                }
                            </div>
                        </div>

                    </DebuggerModalView>
                )
            }
        </>

    )
};

export default Summary;


