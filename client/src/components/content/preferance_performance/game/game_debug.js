import React, {useContext, useState} from "react";
import {DebuggerModalView} from "../../../screens/gameHandle/game_handle";
import {QueenGardenContext} from "../context/qg_context";

export const QueenGardenGameDebug = ({debugger_props, current_trial, game_mode, button}) => {
  const {game_settings: {GamesBank, WithPractice}, current_game_index} = useContext(QueenGardenContext);


  if (!debugger_props || !Object.keys(debugger_props).length)
    return <></>;

  return (
    <DebuggerModalView>
      <div className='Q_G-Debugger'>
        <label>Game condition: <span>{debugger_props.condition}</span></label>
        {game_mode && (
          <>
            <label>Game<span>{(WithPractice === 'Yes'? (current_game_index+1) : (current_game_index))}/{(WithPractice === 'Yes'? GamesBank.length : (GamesBank.length-1))}</span></label>
            <label>Trial<span>{current_trial}/{debugger_props?.level_settings?.Trials}</span></label>
          </>
        )}
        {!isNaN(debugger_props.game_points) && <label>Game points: <span>{debugger_props.game_points.toString()}</span></label>}

        <CollapseItem
          item_label={'Trial Results'}
          item_data={debugger_props.trial_results}
        />
        <CollapseItem
          item_data={debugger_props.roads_prob}
          item_label={'Adaptability Function Results'}
        />

        <CollapseItem
          item_label={'Game Settings'}
          item_data={debugger_props.level_settings}
        />

        <CollapseObjectOfKeyObject
          item_data={debugger_props.adaptability_debugger_props}
          item_label={'Adaptability'}
          more_label='Pi = Adaptability*(2*Cti - 1)'
        />

        <CollapseArrayOfKeyObject
          item_data={debugger_props.All_Probabilities}
          item_label={'All Probabilities'}
          info_label={'trial'}
        />

        <CollapseItem
          item_data={debugger_props.trial_data}
          item_label={'Trial Data'}
        />

        <CollapseArrayOfKeyObject
          item_data={debugger_props.game_data}
          item_label={'All Game Data'}
          info_label={'trial'}
        />

        {button && (
          <button
            onClick={button.button_callback}
          >
            {button.button_label}
          </button>
        )}
      </div>
    </DebuggerModalView>
  )
}

const CollapseHead = ({label, toggleInfo, showInfo}) => {
  return (
    <div
      className='Q_G-Debugger_collapseHead'
      onClick={toggleInfo}
    >
      <label>{showInfo? '-' : '+'}</label>
      <label>{label}:</label>
    </div>
  )
}

const CollapseItem = ({item_label, item_data}) => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(state => !state);

  if (!item_data) return <></>;

  return (
    <div
      className='Q_G-Debugger_collapse'
    >
      <CollapseHead
        label={item_label}
        showInfo={showInfo}
        toggleInfo={toggleInfo}
      />

      {showInfo && (
        <DItems items={item_data} />
      )}
    </div>
  )
}

const ItemInfo = ({item, item_data}) => {
  return (
    <div className='Q_G-Debugger_collapseItemInfo'>
      <label>{item}</label>
      <DItems direction={'Horizontal'} items={item_data} />
    </div>
  )
}

const CollapseObjectOfKeyObject = ({item_label, item_data, more_label}) => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(state => !state);

  if (!item_data) return <></>;

  return (
    <div
      className='Q_G-Debugger_collapse'
    >
      <CollapseHead
        label={item_label}
        showInfo={showInfo}
        toggleInfo={toggleInfo}
      />

      {showInfo && (
        <>
          {more_label && (
            <label className='Q_G-Debugger_collapseMoreLbl'>{more_label}</label>
          )}
          {Object.keys(item_data).map(
            i_data => (
              <ItemInfo key={i_data} item={i_data} item_data={item_data[i_data]}/>
            )
          )}
        </>
      )}
    </div>
  )
}

const CollapseArrayOfKeyObject = ({item_label, item_data, info_label}) => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(state => !state);

  if (!item_data) return <></>;

  return (
    <div
      className='Q_G-Debugger_collapse'
    >
      <CollapseHead
        label={item_label}
        showInfo={showInfo}
        toggleInfo={toggleInfo}
      />

      {showInfo && (
        <div className='Q_G-Debugger_collapseArrayList'>
          {[...item_data, ...item_data, ...item_data, ...item_data, ...item_data].map(
            (i_data, i_data_index) => (
              <ItemInfo
                key={i_data_index}
                item={info_label + (i_data_index+1)}
                item_data={i_data}
              />
            )
          )}
        </div>
      )}
    </div>
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

const DItems = ({items, direction = 'Vertical'}) => {
  return (
    <div
      className={'Q_G-Debugger_collapseData Debugger_collapseData' + direction}
    >
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
