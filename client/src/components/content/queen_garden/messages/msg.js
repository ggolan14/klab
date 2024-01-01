import React, {useContext} from "react";
import {QueenGardenContext} from "../context/qg_context";
import ImgKnight from '../images/knight.png';
import ImgBear from '../images/bear.png';
import ImgToll from '../images/toll_highway.png';
import ImgGain from '../images/gain.png';
import ImgCaravan from '../images/caravan.png';
import './styles.css';

export const RiskInstructions1 = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
      You have been tasked with delivering plants for the Queen of the realm. The plants are grown in a greenhouse on the outskirts of the forest. Your job is to pick up the plants from the greenhouse, and deliver them to her castle. You will be paid {game_settings.GamesBank[0].RewardValue} coin{Number(game_settings.GamesBank[0].RewardValue) !== 1? 's' : ''} upon successful delivery.
      <br/><br/>
      She reminds you of the recent attacks on merchants by bears in the Shadewood and so emphasizes using the highway that goes around the forest.
      <br/><br/>
      As an experienced merchant, you know that the cost of travel along the {game_settings.Labels.CrownHighway} is {game_settings.GamesBank[0].TollCost}.
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
      She emphasizes the importance of sunlight for the health of the plants, and so as part of the contract tells you that all travel through the Shadewood is banned. Instead, you are required to travel the {game_settings.Labels.CrownHighway}. You will be paid {game_settings.GamesBank[0].RewardValue} coin{Number(game_settings.GamesBank[0].RewardValue) !== 1? 's' : ''} upon successful delivery.
      <br/><br/>
      As an experienced merchant, you know that the cost of travel along the {game_settings.Labels.CrownHighway} is {game_settings.GamesBank[0].TollCost} coin{Number(game_settings.GamesBank[0].TollCost) !== 1? 's' : ''}.
    </p>
  )
}

const InstructionsScreen1 = () => {
  const {game_settings} = useContext(QueenGardenContext);

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
      {/*<img className='qg_cht_img' src={ImgCrownHighwayTol}/>*/}
      <p>
        You have paid {game_settings.GamesBank[0].TollCost} coin{Number(game_settings.GamesBank[0].TollCost) !== 1? 's' : ''}.
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

const InstructionsRoad1TollRisk = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
      Travelling through the Shadewood you are stopped by another caravan.
      <br/><br/>
      "Ho there Traveller! Where are you headed?"
      <br/><br/>
      You inform the Merchant that you are travelling to {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} to hire additional hands.
      <br/><br/>
      The Merchant warns you to be careful travelling through the Shadewood, the bears in the area have become increasingly aggressive, attacking shipments of food and plants to {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight}.
      <br/><br/>
      Bears react to repeat activity in the Shadewood, the more a path is used the more the bears hunt them, increasing the likelihood of getting attacked in the future. Awareness decays over time, as bears prowl more frequently used pathways
    </p>
  )
}

const InstructionsRoad1TollDishonest = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
      Travelling through the Shadewood you are stopped by guards.
      <br/><br/>
      "Halt! State your business!"
      <br/><br/>
      You inform the guardsman that you are travelling to {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} to hire additional hands.
      <br/><br/>
      The guard tells you that he and his fellow guards are patrolling the forest paths for smugglers. He tells you that increased foot traffic means he’ll have to bring more guards tomorrow.
      <br/><br/>
      The guards react to repeat activity in the Shadewood, the more a path is used the larger the forces patrolling it, increasing the likelihood of getting stopped in the future. Awareness decays over time, as guards shift towards more frequently used pathways.
    </p>
  )
}

const InstructionsRoad1Toll = () => {
  const {game_settings} = useContext(QueenGardenContext);

  const MsgWrapper = game_settings.GameCondition === 'Risk'? InstructionsRoad1TollRisk : InstructionsRoad1TollDishonest;

  return (
    <MsgWrapper/>
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
      The {game_settings.Labels.CrownHighway} is shut down for one more day.
      Your last objective is to register with the Merchant’s guild
      in {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} before you can begin working for the Queen.
      <br/><br/>
      You will have to travel through the Shadewood again. Since you took {game_settings.Labels.SignpostRoad1} yesterday, you decide to do so again.
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
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
      As you travel within the woods you notice that there is some sign of your previous activity travelling this route.
      <br/><br/>
      NOTE: Repeat travel along a forest route generates signs of activity, {game_settings.GameCondition === 'Risk'?'which means Hungry Bears are more likely to be watching that path.':'which means Guards are more likely to patrol that path later.'}
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

const PracticeMsg = () => {
  const {game_settings} = useContext(QueenGardenContext);

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
        You have {game_settings.GamesBank[0].Trials} runs before the game begins.<br/>
        This practice will not affect your score at the end, or impact your payment.<br/>
      </p>
    </div>
  )
};

const BeforeFirstGame = () => {
  const {current_game_index, game_settings} = useContext(QueenGardenContext);

  const games_count = game_settings.GamesBank.reduce((total, game) => game.GameID === 0? 0 : total+1, 0);

  const current_game_settings = game_settings.GamesBank[current_game_index];

  return (
    <p>
      <b>
        You are now about to start playing for real!<br/>
        The points you earn will account for your bonus payment.
      </b>
      <br/>
      This is the first game out of {games_count}.
      <br/><br/>
      The reward for Delivery is {current_game_settings.RewardValue}
      <br/><br/>
      The toll when traveling the {game_settings.Labels.CrownHighway} is {current_game_settings.TollCost}
      <br/><br/>
      Click Start when ready to begin…
    </p>
  )
}

const BeforeXGame = () => {
  const {current_game_index, game_settings} = useContext(QueenGardenContext);
  const current_game_settings = game_settings.GamesBank[current_game_index];

  return (
    <p>
      <b>
        Great! You finished game {current_game_index-1}
      </b>
      <br/>
      You will now play Game {current_game_index}.
      <br/><br/>
      Note! {game_settings.GameCondition === 'Risk'? 'Bears' : 'Guards'} may behave differently than previously
      <br/><br/>
      Reward for Delivery: {current_game_settings.RewardValue}
      <br/><br/>
      Toll: {current_game_settings.TollCost}
      <br/><br/>
      Click Start when ready to begin…
    </p>
  )
}

const GameMsg = () => {
  const {current_game_index} = useContext(QueenGardenContext);
  return (
    <div
      className=''
      style={{
        display: 'grid',
        rowGap: 10
      }}
    >
      {current_game_index === 1?
        <BeforeFirstGame/> : <BeforeXGame/>
      }
    </div>
  )
};

const DeliveryFailedText = ({GameCondition}) => GameCondition === 'Risk'? (
  <p>
    You have been attacked by a bear in the forest, you leave your wares behind and flee.
    <br/><br/>
    You gain nothing for this run
  </p>
) : (
  <p>
    You have been caught by the Queens Guard Violating the terms of your contract,
    they have confiscated your wares.
    <br/><br/>
    You gain nothing for this run
  </p>
)

export const DeliveryFailed = () => {
  const {game_settings} = useContext(QueenGardenContext);
  const {GameCondition} = game_settings;

  return (
    <div
      className='qg_delivery_failed'
    >
      <DeliveryFailedText GameCondition={GameCondition} />
      {/*<DeliveryFailedImg GameCondition={GameCondition} />*/}
    </div>
  )
};

export const DeliveryToll = () => {
  return (
    <div
      className='qg_delivery_toll'
    >
      <p>
        CROWN HIGHWAY TOLL
      </p>
    </div>
  )
};

export const GainMessage = ({message_more_info}) => {
  const {game_settings, current_game_index} = useContext(QueenGardenContext);

  const {TollCost, RewardValue} = game_settings.GamesBank[current_game_index];

  const {from_queen_road} = message_more_info;

  const net_gain = from_queen_road? (RewardValue-TollCost) : RewardValue;
  return (
    <div
      className='qg_delivery_gain'
    >
      <p>
        You have successfully delivered the plants to the Queen’s castle.<br/>
        You are paid {RewardValue.toString()} coin{Number(RewardValue) !== 1?'s':''} upon successful delivery.
        <br/><br/>

        {from_queen_road && (
          `Your total cost was ${TollCost} coins`
        )}

        Your net gain is {net_gain} coins
      </p>
      {/*<img src={ImgGain}/>*/}
    </div>
  )
};

const MESSAGES = {
  InstructionsScreen1, InstructionsScreen2,
  CrownHighwayToll, InstructionsCrownTollFinish, InstructionsCrownTollFinishReturn,
  InstructionsRoad1Toll, InstructionsRoad1TollFinish, InstructionsRoad1TollFinishReturn,
  InstructionsStep10, InstructionsStep15,
  PracticeMsg, GameMsg,
  DeliveryFailed, DeliveryToll,
  GainMessage
};

const MESSAGES_IMAGES = {
  CrownHighwayToll: ImgToll,
  DeliveryToll: ImgToll,
  GainMessage: ImgGain,
  DeliveryFailedRisk: ImgBear,
  DeliveryFailedDishonest: ImgKnight,
  InstructionsRoad1TollRisk: ImgCaravan,
  InstructionsRoad1TollDishonest: ImgKnight,
};

export const getMessage = message_id => MESSAGES[message_id];

export const QueenGardenGameMessageImg = ({message_id, from_road}) => {
  const {game_settings} = useContext(QueenGardenContext);
  const {GameCondition} = game_settings;

  let img_id, img_scale_up = 'qg_game_msg_img_scale_default';
  if (message_id === 'DeliveryFailed') {
    img_id = `DeliveryFailed${GameCondition}`;
    img_scale_up = 'qg_game_msg_img_scale_failed';
  }
  else if (message_id === 'InstructionsRoad1Toll') {
    img_id = `InstructionsRoad1Toll${GameCondition}`;
  }
  else if (message_id === 'GainMessage'){
    img_id = message_id;
    img_scale_up = 'qg_game_msg_img_scale_gain';
  }
  else
    img_id = message_id;

  const image_ = MESSAGES_IMAGES[img_id];
  if (!image_) return <></>;

  return (
    <img className={'qg_game_msg_img ' + img_scale_up + ' ' + (from_road? `qg_game_msg_img_pos_${from_road}` : '')} src={image_}/>
  )
}



/*
https://www.clipartmax.com/middle/m2K9A0b1m2d3i8A0_knight-free-to-use-clip-art-knight-clipart-transparent/
 */
