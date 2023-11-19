import React, {useEffect, useState} from "react";
import './board.css';
import {AllTrees} from "../tree/trees";
import {Land} from "../land/land";
import {Roads} from "../roads/roads";
import TutorialMsg from "../tutorial/msg";
import TrialResults from "../results";

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
  const [tutorialStep, setTutorialStep] = useState(0);
  const [trialResult, setTrialResult] = useState(null);
  const [playerMove, setPlayerMove] = useState(null);
  const [hideTutorial, setHideTutorial] = useState(false);
  const [wagonPosition, setWagonPosition] = useState('queen');

  useEffect(() => {
    start = Date.now();
    trials_results = [];
  }, []);

  const handleClick = ({queen, road_index}) => {
    if (Date.now() - start < 4000) return ;
    if (hideTutorial || (Part !== 'Tutorial' && playerMove !== null)) return ;
    if (Part === 'Tutorial'){
      if (tutorialStep === 0) return;
      if (tutorialStep === 2 && (queen !== undefined || road_index !== undefined)) return;
      if (trial === 2 && tutorialStep === 1 && road_index !== TutorialForestPathRoadIndex) return;
      if (trial === 3 && tutorialStep === 1 && road_index !== TutorialRepeatTravelRoadIndex) return;
      if (trial === 1 && tutorialStep === 1 && !queen) return;
      if (tutorialStep === 2){
        setPlayerMove(null);
        if (trial === 3){
          return Forward();
        }
        setTutorialStep(1);
        setTrial(trial+1);
      }
      else {
        if (trial === 1 && tutorialStep === 1) {
          setPlayerMove({
            road: queen ? 'queen' : road_index, busted: false
          });
          setTutorialStep(tutorialStep+1);
        }
        else if (trial === 2 && tutorialStep === 1) {
          setPlayerMove({
            road: TutorialForestPathRoadIndex, busted: true
          });
          setHideTutorial(true);
          setTutorialStep(tutorialStep+1);
          setTimeout(() => {
            setHideTutorial(false);
          }, 800);
        }
        else if (trial === 3 && tutorialStep === 1) {
          setPlayerMove({
            road: TutorialRepeatTravelRoadIndex, busted: false
          });
          setHideTutorial(true);
          setTutorialStep(tutorialStep+1);
          setTimeout(() => {
            setHideTutorial(false);
          }, 800);
        }
        else {
          setTutorialStep(tutorialStep+1);
        }

        setTutorialStep(tutorialStep+1);
      }
    }
    else {
      let busted = false;
      const roads_prob = AdaptabilityFunction({
        Trial: trial,
        P0: GameSettings.P0,
        Adaptability: GameSettings.Adaptability,
        PathChoose: road_index+1,
      });

      let random_number = '';
      let road_p = '';
      if (!queen){
        random_number = Math.round(Math.random() * 1000)/1000;
        road_p = roads_prob['road' +(road_index+1)];
        busted = random_number <= road_p;
      }

      const Reward = queen?GameSettings.RewardValue: busted? 0 : GameSettings.RewardValue;
      const Pay = queen? GameSettings.MileageTravelCost : busted? GameSettings.Penalty : 0;
      const Total = Reward - Pay;

      let trial_result = {
        Part,
        GameIndex: GameSettings.GameIndex,
        Trial: trial,
        Trials: GameSettings.Trials,
        P0: GameSettings.P0,
        Adaptability: GameSettings.Adaptability,
        PathChoose: queen? 'queen' : `road_${road_index+1}`,
        PathProb: road_p,
        RandomNumber: random_number,
        Busted: Number(busted),
        Reward,
        Pay,
        Total
      };

      const roads_prob_ = {
        road1: roads_prob.road1,
        road2: roads_prob.road2,
        road3: roads_prob.road3,
        road4: roads_prob.road4,
      };

      trials_results.push(trial_result);
      trialEndHandle(trial_result, roads_prob_);

      setPlayerMove({
        road: queen? 'queen' : road_index,
        busted
      });
      setTimeout(() => {
        if (busted){
          if (Condition === 'Risk')
            setTrialResult('Thieves');
          else
            setTrialResult('QueensGuard');
        }
        else
          setTrialResult('Success');
      }, 500);
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
      <Land side='top'/>

      <Roads
        MileageTravelCost={GameSettings && GameSettings.MileageTravelCost ? GameSettings.MileageTravelCost : null}
        playerMove={playerMove}
        handleClick={handleClick}
      />

      <Land
        side='bottom'
        showFlower={playerMove === null}
        wagonPosition={wagonPosition}
      />
    </div>
  )
}
