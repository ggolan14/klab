import React, {useEffect, useState} from "react";
import './board.css';
import {Land} from "../land/land";
import {Roads} from "../roads/roads";
import TutorialMsg from "../tutorial/msg";
import TrialResults from "../results";
import {Wagon} from "../wagon/wagon";

let Probabilities = [];

const AdaptabilityFunction = ({Trial, P0, Adaptability, PathChoose}) => {
  let results = {
    road1: null,
    road2: null,
    road3: null,
    road4: null,
    PathChoose,
    Trial
  };


  for (let road in results){
    if (!road.includes('road')) continue;

    const road_ = road.replace('road', '');

    let Pi,
      Cti = 0,
      last_value = 0;

    try {
      const last_index = Probabilities.length-1;
      const last_prob = Probabilities[last_index];
      last_value = last_prob[road] >= 1 ? 1 : Probabilities[last_index][road] - P0;
      Cti = Number(Number(PathChoose || -1) === Number(road_));
    }
    catch (e) {}

    Pi = Adaptability*(2*Cti - 1);

    const road_total = Math.round((P0 + Pi + last_value)*100)/100;
    results[road] = road_total>=1? 1 : Math.max(road_total, P0);
  }

  Probabilities.push(results);
  return results;

}

// const AdaptabilityFunction2 = ({P0, Adaptability, PathChoose}) => {
//   let Pi,
//       P = trial>0?Probabilities[trial-1] : 0,
//       A = Adaptability,
//       Cti = 0;
//
//   Pi = P + A*(2*Cti - 1);
//
//   return Pi;
// }

// {
//   RewardValue: r_v,
//   MileageTravelCost: m_t_c,
//   Penalty: pe,
//   EquipmentCost: e_c
// }

let trials_results, start;

export const Game = ({GameSettings, GameSet, Forward, trialEndHandle, Part, Condition, TutorialForestPathRoadIndex, TutorialRepeatTravelRoadIndex, TutorialForestPathRoadTxt, TutorialRepeatTravelRoadTxt}) => {
  const [trial, setTrial] = useState(1);
  const [tutorialStep, setTutorialStep] = useState(1);
  const [trialResult, setTrialResult] = useState(null);
  const [playerMove, setPlayerMove] = useState(null);
  const [hideTutorial, setHideTutorial] = useState(false);
  // const [wagonPosition, setWagonPosition] = useState({road: 'queen_road', move_direction: null});
  const [wagonPosition, setWagonPosition] = useState({road: 'reset', move_direction: null});

  useEffect(() => {
    start = Date.now();
    trials_results = [];
  }, []);

  const handleClick = ({to_castle, queen, road_index, is_button}) => {
    // console.log('\n @@@@@@@@@ handleClick \n');
    // console.log('\n')
    // console.log('trial', trial, '  tutorialStep', tutorialStep);
    // console.log('to_castle', to_castle, 'road_index', road_index, '  queen', queen, ' is_button', is_button);
    // console.log('\n')
    if (Date.now() - start < 4000) return ;
    if (hideTutorial || (Part !== 'Tutorial' && playerMove !== null)) return ;
    if (Part === 'Tutorial'){
      //roads = ['queen_road', 'road1', 'road2', 'road3', 'road4'];
      if (trial === 1 && is_button)
        return setTrial(2);
      if (trial === 2 && queen && ['queen_road', 'castle'].indexOf(wagonPosition.road) === -1){
        setWagonPosition(() => ({
          road: 'queen_road',
        }));
        return;
      }
      if (trial === 2 && tutorialStep === 1 && to_castle){
        setWagonPosition(() => ({
          road: 'castle',
          with_tol: true
        }));
      }

    }
  }

  const TrialResultsCallBack = () => {
    if (GameSettings.Trials === trial)
      return Forward();
    setTrialResult(null);
    setPlayerMove(null);
    setTrial(trial+1);
  }

  return (
    <div
      className='qg_game_board unselectable'
    >
      {
        trialResult && (
          <TrialResults
            callback={TrialResultsCallBack}
            GameSettings={GameSettings}
            result={trialResult}
          />
        )
      }
      {
        Part === 'Tutorial' && !hideTutorial && (
          <TutorialMsg
            GameSet={GameSet}
            GameSettings={GameSettings}
            tutorialNumber={trial}
            tutorialStep={tutorialStep}
            Condition={Condition}
            onClick={handleClick}
            TutorialForestPathRoadTxt={TutorialForestPathRoadTxt}
            TutorialRepeatTravelRoadTxt={TutorialRepeatTravelRoadTxt}
          />
        )
      }

      {
        Part !== 'Tutorial' && (
          <label className='qg_game_board_t_display'>Trial {trial} of {GameSettings.Trials}</label>
        )
      }
      <Land
        side='top'
        handleClick={handleClick}
      />

      <Roads
        MileageTravelCost={GameSettings && GameSettings.MileageTravelCost ? GameSettings.MileageTravelCost : null}
        playerMove={playerMove}
        handleClick={handleClick}
      />

      <Land
        side='bottom'
        showFlower={playerMove === null}
      />

      <Wagon
        wagonPosition={wagonPosition}
        GameSet={GameSet}
        GameSettings={GameSettings}
        handleClick={handleClick}
      />
    </div>
  )
}
