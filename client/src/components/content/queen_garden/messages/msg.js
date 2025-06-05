import React, {useContext,useRef } from "react";
import {QueenGardenContext} from "../context/qg_context";
import ImgKnight from '../images/knight.png';
import ImgKnight2 from '../images/knight2.png';
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
      She tells you about recent attacks on merchants by bears in the Shadewood and so emphasizes using the highway that goes around the forest.
      <br/><br/>
      As an experienced merchant, you know that the cost of travel along the {game_settings.Labels.CrownHighway} is {game_settings.GamesBank[0].TollCost} coin{Number(game_settings.GamesBank[0].TollCost) !== 1? 's' : ''}.
      <br/><br/>
    </p>
  )
}

export const DishonestInstructions1 = () => {
  const { game_settings } = useContext(QueenGardenContext);
  console.log("----->   game_settings.game.game_type="+game_settings.GameType)
  if (game_settings.GameType === "sick_child") {
    return (
       <p>
        You have been tasked with delivering plants for the Queen of the Realm to use to heal sick children.  The plants are grown in a greenhouse on the outskirts of the forest.  Your job is to pick up the plants from the greenhouse and deliver them to her castle. These plants are used by the Queen’s healers to craft medicine to heal grainlung, a severe cough in children.
        <br /><br />
        She emphasizes the importance of sunlight for the health of the plants and their ability to heal the children, <b>as prolonged periods of shade eliminate their medicinal properties, rendering the medicine ineffective</b>. As a result, all deliveries through the Shadewood forest are banned and guards are patrolling the forest to enforce the delivery ban.  Instead, you are required to travel the Crown Road.  You will be paid {game_settings.GamesBank[0].RewardValue} coin{Number(game_settings.GamesBank[0].RewardValue) !== 1 ? 's' : ''} upon successful delivery.
        <br /><br />
        As an experienced merchant you know that the cost of travel along {game_settings.Labels.CrownHighway} is {game_settings.GamesBank[0].TollCost} coin{Number(game_settings.GamesBank[0].TollCost) !== 1 ? 's' : ''}.
      </p>
    )
  }
  else {
    return (
      <p>
      You have been tasked with delivering plants for the Queen of the realm. The plants are grown in a greenhouse on the outskirts of the forest. Your job is to pick up the plants from the greenhouse, and deliver them to her castle.
      <br/><br/>
      She emphasizes the importance of sunlight for the health of the plants, and so as part of the contract tells you that all deliveries through the Shadewood forest are banned, and guards are patrolling the forest to enforce the delivery ban. Instead, you are required to travel the {game_settings.Labels.CrownHighway}. You will be paid {game_settings.GamesBank[0].RewardValue} coin{Number(game_settings.GamesBank[0].RewardValue) !== 1? 's' : ''} upon successful delivery.
      <br/><br/>
      As an experienced merchant, you know that the cost of travel along the {game_settings.Labels.CrownHighway} is {game_settings.GamesBank[0].TollCost} coin{Number(game_settings.GamesBank[0].TollCost) !== 1? 's' : ''}.
    </p>
    )
  }
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
      1:Click on the road sign that says {game_settings.Labels.SignpostQueen}
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
  // Static variable to track if the component has been rendered before
  if (InstructionsCrownTollFinishReturn.isFirstTime === undefined) {
    InstructionsCrownTollFinishReturn.isFirstTime = true;
  }

  if (InstructionsCrownTollFinishReturn.isFirstTime) {
    InstructionsCrownTollFinishReturn.isFirstTime = false; // Set to false after the first render
    return (
      <p>
        You have now returned to the outskirts of the Shadewood forest where you live.
        Before you can begin making deliveries in earnest,
        you need to travel to the {game_settings.Labels.KingdomRight} once more to hire additional workers.
        <br/><br/>
        The {game_settings.Labels.CrownHighway} is shut down today, so you will have to travel through the Shadewood forest.
        There are 4 paths to choose from. Right now,
        you decide to take the {game_settings.Labels.SignpostRoad1}
        <br/><br/>
        Click on the sign that says "{game_settings.Labels.SignpostRoad1}"
        <br/><br/>
       
      </p>
    );
  } else {
    return <p>
      Looking at the Shadewood, you notice that it is incredibly overgrown. You spend a great deal of time clearing the path to get your cart through.
      <br/><br/>
      Once you make it through to Zorea and hire some workers, you will be able to pay them to clear the path.
      <br/><br/>
      Click on {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight}
      <br/><br/>
    </p>;
  }
};

export default InstructionsCrownTollFinishReturn;

const InstructionsRoad1TollRisk = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
     
      Travelling through the Shadewood you are stopped by another caravan.
      <br/><br/>
      "Ho there Traveller! Where are you headed?"
      <br/><br/>
      You inform the Merchant that you are travelling to {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} to hire additional workers.
      <br/><br/>
      The Merchant warns you to be careful travelling through the Shadewood, as the bears in the area have become increasingly aggressive, attacking shipments of food and plants to {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight}.
      <br/><br/>
      Bears may react to repeat activity within the Shadewood, possibly increasing the likelihood of attacks in the future.
    
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
      You inform the guardsman that you are travelling to {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} to hire additional workers.
      <br/><br/>
      The guard tells you that he and his fellow guards are patrolling the forest paths for smugglers.
      <br/><br/>
      The guards may react to activity in the Shadewood forest, possibly increasing the likelihood of getting stopped in the future.
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
      Note: Repeat travel along the same route requires
      clicking only on {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight}. The wagon begins by default
      at the entrance to the previously used route.
      <br></br>
      <br></br>
      Please click on {game_settings.Labels.KingdomLeft} {game_settings.Labels.KingdomRight} again
      <br/><br/>
    </p>
  )
};

const InstructionsStep10 = () => {
  const {game_settings} = useContext(QueenGardenContext);

  return (
    <p>
      As you travel within the woods you note that the route remains clear.

      <br/><br/>
      NOTE: Travelling along a forest route for the first time requires clearing the brush, which you pay your hired workers to accomplish.
      <br/><br/>
      The plants in the Shadewood grow quickly, so if you take another route and return later the path will need to be cleared again.
      <br/><br/>
    </p>
  )
};

const InstructionsStep15 = () => {

  return (
    <p>
      You have successfully registered at the Merchants Guild and now can begin making deliveries. To get a feel for things you will be given some time to practice.
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
      The cost of clearing a road in the Shadewood is {current_game_settings.ClearingCost}
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
      Clearing cost: {current_game_settings.ClearingCost}
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

const DeliveryFailedText = ({ GameCondition }) => {
  console.log("---> GameCondition:", GameCondition); // Log the GameCondition to the console

  return (GameCondition === 'Risk')? (
    <p>
      You have been attacked by a bear in the forest, you leave your flowers behind and flee.
      <br/><br/>
      You gain nothing for this run.
    </p>
  ) : (
    <p>
      You have been caught by the Queen's Guard. Since you violated the terms of your contract,
      by delivering plants through the Shadewood, they have confiscated your wares.
      <br/><br/>
      You gain nothing for this run.
    </p>
  );
};

export const DeliveryFailed = () => {
  const {game_settings} = useContext(QueenGardenContext);
  const {GameCondition} = game_settings;
  console.log("---> GameCondition="+GameCondition)
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
  
  const {current_game_index, game_settings} = useContext(QueenGardenContext);

  const games_count = game_settings.GamesBank.reduce((total, game) => game.GameID === 0? 0 : total+1, 0);

  const current_game_settings = game_settings.GamesBank[current_game_index];
  return (
    <div
      className='qg_delivery_toll'
    >
      <p>
        CROWN HIGHWAY TOLL = {current_game_settings.TollCost}
      </p>
    </div>
  )
};

export const GainMessage = ({message_more_info}) => {
  const {game_settings, current_game_index,finalReward, needToPayClearing} = useContext(QueenGardenContext);
  console.log("---> in Gain message Reward = "+finalReward+"   needToPayClearing="+needToPayClearing)

  const {TollCost, RewardValue,ClearingCost} = game_settings.GamesBank[current_game_index];

  const {from_queen_road} = message_more_info;

  const net_gain = from_queen_road? (RewardValue-TollCost) : finalReward;
  let coinsStrToll= TollCost !== 1 ? 'coins. ' : 'coin. ';
  let coinsStrCleaning= ClearingCost !== 1 ? 'coins. ' : 'coin. ';
  
    
  
  return (
    <div
      className='qg_delivery_gain'
    >
      <p>
        You have successfully delivered the plants to the Queen’s castle.<br/>
		If they stayed healthy and did not travel through the forest, her healers will use it to treat the sick children.<br/>
        You are paid {RewardValue.toString()} coin{Number(RewardValue) !== 1?'s':''} upon successful delivery. 
        <br/><br/>
        {from_queen_road && (
          `your cost was ${TollCost} `+coinsStrToll
        )}
        

        {needToPayClearing && (
         `Your total cost to clear the path was ${ClearingCost} `+coinsStrCleaning 

        )}
      <br></br>
      <br></br>
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
  console.log("----> in getMessage()  GameCondition="+GameCondition)

  let img_id, img_scale_up = 'qg_game_msg_img_scale_default';
  
  if (message_id === 'DeliveryFailed') {
    img_id = GameCondition=="Dishonest" ? "DeliveryFailedDishonest" : "DeliveryFailedRisk"
    img_scale_up = 'qg_game_msg_img_scale_failed';
  }
  else if (message_id === 'InstructionsRoad1Toll') {
    //img_id = `InstructionsRoad1Toll${GameCondition}`;
    img_id = GameCondition=="Dishonest" ? "InstructionsRoad1TollDishonest" : "InstructionsRoad1TollRisk"
  }
  //InstructionsRoad1Toll
  else if (message_id === 'GainMessage'){
    img_id = message_id;
    img_scale_up = 'qg_game_msg_img_scale_gain';
  }
  else
    img_id = message_id;

    
  const image_ = MESSAGES_IMAGES[img_id];
  console.log("---> img_id="+img_id +"   message_id="+message_id+"   image_="+image_)
  if (!image_) return <></>;

  return (
    <img className={'qg_game_msg_img ' + img_scale_up + ' ' + (from_road? `qg_game_msg_img_pos_${from_road}` : '')} src={image_}/>
  )
}



/*
https://www.clipartmax.com/middle/m2K9A0b1m2d3i8A0_knight-free-to-use-clip-art-knight-clipart-transparent/
 */
