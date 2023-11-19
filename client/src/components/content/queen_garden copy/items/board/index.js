import React from "react";

const GameBoard = ({GameSettings, GameSet, Forward, trialEndHandle, Part, Condition, TutorialForestPathRoadIndex, TutorialRepeatTravelRoadIndex, TutorialForestPathRoadTxt, TutorialRepeatTravelRoadTxt}) => {
  const handleClick = ({queen, road_index, is_button}) => {
    if (Date.now() - start < 4000) return ;
    if (hideTutorial || (Part !== 'Tutorial' && playerMove !== null)) return ;
    if (Part === 'Tutorial'){
      if (trial === 0) {
        if (is_button) setTrial(2);
        return;
      }
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

  return (

  )
}
