import React, {useEffect, useState} from "react";
import KNIGHT_IMG from '../images/knight.png';
import SUCCESS_IMG from '../images/success.png';
import THIEF_IMG from '../images/thief.png';
import './index.css';

// RewardValue
// MileageTravelCost
// ProbabilityOfApprehension
// Penalty
// EquipmentCost
// ConfirmationQuestion

const SuccessDelivery = (game_settings, allowClick) => {
  return (
    <div
      className='results_sd'
    >
      <p>
        You have successfully delivered the plants to the Queen’s castle.<br/>
        You are paid {game_settings.RewardValue} upon successful delivery.
        <br/><br/>
        Your total mileage cost was {game_settings.MileageTravelCost}
        <br/>
        Your net gain is {game_settings.RewardValue - game_settings.MileageTravelCost}
      </p>
      <img
        src={SUCCESS_IMG}
        height={350}
        width={350}
      />
      <label style={{visibility: allowClick? 'visible' : 'hidden'}}>Click to continue</label>
    </div>
  )
}

const ThievesApprehension = (game_settings, allowClick) => {
  return (
    <div
      className='results_ta'
    >
      <p>
        You have been stopped by thieves in the forest.<br/>
        They steal {game_settings.Penalty}
      </p>

      <img
        src={THIEF_IMG}
        height={318}
        width={182}
      />

      <label style={{visibility: allowClick? 'visible' : 'hidden'}}>Click to continue</label>
    </div>
  )
}

const QueensGuardApprehension = (game_settings, allowClick) => {
  return (
    <div
      className='results_qga'
    >
      <p>
        You have been caught by the Queens Guard Violating the terms of your contract,<br/>
        you have been fined {game_settings.Penalty}
      </p>

      <img
        src={KNIGHT_IMG}
        height={318}
        width={182}
      />
      <label style={{visibility: allowClick? 'visible' : 'hidden'}}>Click to continue</label>
    </div>
  )
}
// 170 500 th
// 495 500 money
// 91 159
export default function TrialResults({result, GameSettings, callback}) {
  const [allowClick, setAllowClick] = useState(false);

  useEffect(() => {
    setTimeout(() => setAllowClick(true), 200);
  }, [])
  const Results_ = {
    QueensGuard: QueensGuardApprehension,
    Thieves: ThievesApprehension,
    Success: SuccessDelivery
  };

  return (
    <div
      className='results_container'
      style={{
        cursor: allowClick? 'pointer' : 'not-allowed'
      }}
      onClick={allowClick? callback : undefined}
    >
      {Results_[result](GameSettings, allowClick)}

    </div>
  )
}
