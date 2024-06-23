import React from "react";
import IMG1 from './qg_crown1.png';
import KNIGHT_IMG from '../images/knight.png';

const QueenRoad_Finish = () => {
  return (
    <>
      Great!<br/>
      You’ve taken on the contract with the Queen to run Deliveries.
    </>
  )
}

const Road_Finish = ({GameSet}) => {
  return (
    <>
      You have made it to {GameSet.KingdomLeft_txt} {GameSet.KingdomRight_txt} and hired some additional workers to help with transporting your goods for the Queen.
    </>
  )
}

const Toll_Booth = ({toll_cost}) => {
  return (
    <>
      As you approach the Castle Gates, <br/> you are stopped at Toll Booth and asked to pay the Toll :

      <img
        src={IMG1}
      />
      <br/>
      You have paid {toll_cost} coin{toll_cost !== 1? 's' : ''}.
    </>
  )
}

const Toll_Road_Tutorial = ({GameSet}) => {
  return (
    <>
      Travelling through the Shadewood
      you are stopped by guards.
      <br/><br/>
      “Halt! State your business!”
      <br/><br/>
      You inform the guardsman
      that you are travelling to
      {GameSet.KingdomLeft_txt} {GameSet.KingdomRight_txt} to hire additional workers.
      <br/><br/>
      The guard tells you that he and his fellow guards are patrolling the forest paths for smugglers. He tells you that increased foot traffic means he’ll have to bring more guards tomorrow.
      <br/><br/>
      The guards react to repeated activity in the Shadewood forest. The more a path is used, the more guards patrol it, increasing the likelihood of getting stopped in the future. But their awareness decays over time, so guards will patrol less on pathways that have not been used for a while.


      <img
        src={KNIGHT_IMG}
      />
      <br/>
    </>
  )
}

export default function WagonTravelMsg({
                                         travelMsg, handleClick, GameSettings, GameSet
}){
  // const message_position = 'center';
  // const message_position = 'left';
  let message_position, button_lbl, style = {};
  if (travelMsg.message_type === 'Toll_Booth') {
    message_position = 'right';
    button_lbl = 'Continue';
  }
  else if (travelMsg.message_type === 'QueenRoad_Finish') {
   message_position = 'left';
   button_lbl = 'Next';
 }
  else if (travelMsg.message_type === 'Road_Finish') {
   message_position = 'left';
   button_lbl = 'Next';
 }
  else if (travelMsg.message_type === 'Toll_Road_Tutorial') {
   message_position = 'left';
   button_lbl = 'Next';
 }
  const toll_cost = Number(GameSettings.MileageTravelCost);

  return (
    <div
      className={'qg_tutorial_msg ' + 'msg_pos_'+message_position}
    >
      {travelMsg.message_type === 'Toll_Booth' && <Toll_Booth toll_cost={toll_cost}/> }
      {travelMsg.message_type === 'QueenRoad_Finish' && <QueenRoad_Finish toll_cost={toll_cost}/> }
      {travelMsg.message_type === 'Toll_Road_Tutorial' && <Toll_Road_Tutorial GameSet={GameSet}/> }
      {travelMsg.message_type === 'Road_Finish' && <Road_Finish GameSet={GameSet}/> }
      <button
        onClick={() => handleClick({is_button: true})}
      >
        {button_lbl}
      </button>
    </div>
  )
}
