import {DebuggerModalView} from "../../../screens/gameHandle/game_handle";
import React from "react";

export const DebuggerItem = ({debugger_props, TotalPoints, TrialResults}) => {
  if (!debugger_props || !Object.keys(debugger_props).length)
    return <></>;

  return (
    <DebuggerModalView>
      <div className='Q_G-Debugger'>
        <div className='Q_G-Debugger1'>
          <label>Game points: <span>{TotalPoints['GameIndex_'+debugger_props.trial_props.GameIndex]}</span></label>
        </div>

        <div className='Q_G-Debugger1'>
          <label>Trial data:</label>
          <div>
            <DItems items={debugger_props.trial_props} />
          </div>
        </div>

        <div className='Q_G-Debugger1'>
          <label>Roads prob:</label>
          <div>
            <DItems items={debugger_props.roads_prob} />
          </div>
        </div>

        <div className='Q_G-Debugger2'>
          <label>Game data:</label>
          <div>
            {
              TrialResults.map(t => ({
                Trial: t.Trial,
                PathChoose: t.PathChoose,
                PathProb: t.PathProb,
                RandomNumber: t.RandomNumber,
                Busted: t.Busted,
                Reward: t.Reward,
                Pay: t.Pay,
                Total: t.Total,
              })).reverse().map(
                (val, index) => (
                  <DItems key={index} items={val} />
                )
              )
            }
          </div>
        </div>

      </div>
    </DebuggerModalView>
  )
}

const DItem = ({item_label, item_data}) => {
  return (
    <label>
      {item_label}:
      <span>{item_data}</span>
    </label>
  )
};

const DItems = ({items}) => {
  return (
    <div>
      {
        Object.keys(items).map(
          (item, item_i) => (
            <DItem
              key={item_i}
              item_label={item}
              item_data={items[item]}
            />
          )
        )
      }
    </div>
  )
}
