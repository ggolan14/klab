import React, {useContext} from "react";
import {QueenGardenContext} from "../context/qg_context";
import ImgCrownHighwayTol from '../images/toll_highway.png';

export const RiskInstructions1 = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
      You have been tasked with delivering plants for the
      Queen of the realm. The plants are grown in
      a greenhouse on the outskirts of the forest.
      Your job is to pick up the plants from the greenhouse,
      and deliver them to her castle.
      You will be paid {game_settings.RewardValue} coin{Number(game_settings.RewardValue) !== 1? 's' : ''} upon successful delivery.
      <br/><br/>
      She reminds you of the recent attacks on merchants by bears in the
      Shadewood and so emphasizes using the highway that goes around the forest.
      <br/><br/>
      As an experienced merchant, you know that the cost of travel
      along the {game_settings.Labels.CrownHighway} is {game_settings.TollCost}.
      <br/><br/>
    </p>
  )
}

export const DishonestInstructions1 = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
      You have been tasked with delivering plants for the Queen of the realm. The plants are grown in a greenhouse on the outskirts of the forest. Your job is to pick up the plants from the greenhouse, and deliver them to her castle.
      <br/><br/>
      She emphasizes the importance of sunlight for the health
      of the plants, and so as part of the contract tells
      you that all travel through the Shadewood is banned.
      Instead, you are required to travel the {game_settings.Labels.CrownHighway}.
      You will be paid {game_settings.RewardValue} coin{Number(game_settings.RewardValue) !== 1? 's' : ''} upon successful delivery.
      <br/><br/>
      As an experienced merchant, you know that the cost of travel along the {game_settings.Labels.CrownHighway} is {game_settings.TollCost} coin{Number(game_settings.TollCost) !== 1? 's' : ''}.
    </p>
  )
}

const InstructionsScreen1 = () => {
  const {game_settings} = useContext(QueenGardenContext);
  // console.log('game_settings', game_settings)

  return (
    <div
      className=''
      style={{
        display: 'grid',
        rowGap: 10
      }}
    >
      <label
        style={{textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline'}}
      >
        Queen Garden
      </label>
      {
        game_settings.GameCondition === 'Risk'? <RiskInstructions1/> : <DishonestInstructions1/>
      }
    </div>
  )
};

const InstructionsScreen2 = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>

      Before you can begin your contract with the queen,
      first you’ll need to make it to the castle and speak with her about the terms.
      To make it there, you should take the {game_settings.Labels.CrownHighway}.
      <br/><br/>
      To move the wagon, you have to click where you want it to go.
      To use the {game_settings.Labels.CrownHighway}:
      <br/><br/>
      1:Click on the road sign that says {game_settings.Labels.CrownHighway}
      <br/><br/>
      2:Click on {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight}

    </p>
  )
};

const CrownHighwayToll = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (

    <div style={{
      display: 'grid',
      rowGap: 10
    }}>
      <p>
        As you approach the Castle Gates, <br/>you are stopped at Toll Booth and asked to pay the Toll
      </p>
      <img className='qg_cht_img' src={ImgCrownHighwayTol}/>
      <p>
        You have paid {game_settings.TollCost} coin{Number(game_settings.TollCost) !== 1? 's' : ''}.
      </p>
    </div>
  )
};

const InstructionsCrownTollFinish = () => {
  return (
    <p>
      Great!<br/>
      You’ve taken on the contract with the Queen to run Deliveries.
    </p>
  )
};

const InstructionsCrownTollFinishReturn = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
      You have now returned to the outskirts of the Shadewood where you live.
      Before you can begin making deliveries in earnest,
      you need to travel to {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} once more to hire additional hands.
      <br/><br/>
      The {game_settings.Labels.CrownHighway} is shut down today,
      you will have to travel through the Shadewood.
      There are 4 paths to choose from, for today,
      you decide to take the {game_settings.Labels.SignpostRoad1}
      <br/><br/>
      1:Click on the sign that says "{game_settings.Labels.SignpostRoad1}"
      <br/><br/>
      2:Click on {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight}

    </p>
  )
};

const InstructionsRoad1Toll = () => {
  return (
    <p>
      Travelling through the Shadewood
      you are stopped by guards.

      “Halt! State your business!”

      You inform the guardsman
      that you are travelling to
      [Kingdom Left] [Kingdom Right] to hire additional hands.

      The guard tells you that he and his fellow guards are patrolling the forest paths for smugglers. He tells you that increased foot traffic means he’ll have to bring more guards tomorrow.

      The guards react to repeat activity in the Shadewood, the more a path is used the larger the forces patrolling it, increasing the likelihood of getting stopped in the future. Awareness decays over time, as guards shift towards more frequently used pathways.

    </p>
  )
};

const InstructionsRoad1TollFinish = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
      You have made it to {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} and hired
      some additional workers to help with transporting your goods for the Queen.
    </p>
  )
};

const InstructionsRoad1TollFinishReturn = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
      The {game_settings.Labels.CrownHighway}is shut down for one more day.
      Your last objective is to register with the Merchant’s guild
      in {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} before you can begin working for the Queen.
      <br/><br/>
      You will have to travel through the Shadewood again.
      Since you took {game_settings.Labels.SignpostRoad1} yesterday,
      you decide to do so again.
      <br/><br/>
      1: Click on {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} again
      <br/><br/>
      Note: Repeat Travel along the same route requires
      clicking only on {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} the wagon begins by default
      at the entrance to the previously used route
    </p>
  )
};

const InstructionsStep10 = () => {

  return (
    <p>
      As you travel within the woods you notice that there is some sign of your previous activity travelling this route.
      <br/><br/>
      NOTE: Repeat travel along a forest route generates signs of activity, which means Guards are more likely to patrol that path later
    </p>
  )
};

const InstructionsStep15 = () => {

  return (
    <p>
      You have Successfully registered at the Merchants Guild and now can begin making deliveries. To get a feel for things you will be given some time to practice.
    </p>
  )
};

const InstructionsStep17 = () => {
  const GameSet = useContext(QueenGardenContext);

  return (
    <p>
      Before you play for real, all potential paths are open to you, feel free to explore your options. You have {GameSet.PracticeTrials} runs before the game begins. This practice will not affect your score at the end or impact your payment.
    </p>
  )
};

const PracticeMsg = () => {
  const GameSet = useContext(QueenGardenContext);

  return (
    <div
      className=''
      style={{
        display: 'grid',
        rowGap: 10
      }}
    >
      <p>
        Before you play for real, all potential paths are open to you,
        feel free to explore your options. <br/>
        You have {GameSet.PracticeTrials} runs before the game begins.<br/>
        This practice will not affect your score at the end, or impact your payment.<br/>
      </p>
    </div>
  )
};

const PracticeFinish = () => {

  return (
    <div
      className=''
      style={{
        display: 'grid',
        rowGap: 10
      }}
    >
      <p>
        PRACTICE_FINISH_MESSAGE
      </p>
    </div>
  )
};

export const EndGameMsg = () => {

  return (
    <div
      className=''
      style={{
        display: 'grid',
        rowGap: 10
      }}
    >
      <p>
        GAME_FINISH_MESSAGE
      </p>
    </div>
  )
};

export const DeliverySuccess = () => {

  return (
    <div
      className=''
      style={{
        display: 'grid',
        rowGap: 10
      }}
    >
      <p>
        DeliverySuccess
      </p>
    </div>
  )
};

export const DeliveryFailed = () => {

  return (
    <div
      className=''
      style={{
        display: 'grid',
        rowGap: 10
      }}
    >
      <p>
        DeliveryFailed
      </p>
    </div>
  )
};

const MESSAGES = {
  InstructionsScreen1, InstructionsScreen2,
  CrownHighwayToll, InstructionsCrownTollFinish, InstructionsCrownTollFinishReturn,
  InstructionsRoad1Toll, InstructionsRoad1TollFinish, InstructionsRoad1TollFinishReturn,
  InstructionsStep10, InstructionsStep15,
  PracticeMsg,
  DeliveryFailed,  DeliverySuccess
};

export const getMessage = message_id => MESSAGES[message_id];
