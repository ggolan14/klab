import React, { Component } from 'react';
import { KeyTableID } from './screens/gameHandle/game_handle';
import { formatPrice , getGameCondition } from './utils/StringUtils';

class BaseStartComponent extends React.Component {
  constructor(props) {
    super(props);
	this.TotalBonus = [];
	let RunCounter = KeyTableID();
    this.PaymentsSettings = props.game_settings.payments;
	this.SignOfReward = props.game_settings.payments.sign_of_reward;
	let cond = props.game_settings.game.cond;
    let GameCondition = getGameCondition(cond , RunCounter) //get game condition from 
    console.log("++++ in BaseComponent start GameCondition = "+GameCondition+"  cond="+cond +"  RunCounter="+RunCounter)
	this.state = {
      // Please add properties to the state
    };
  }
   insertGameLine = (db_row) => {
    this.props.insertGameLine(db_row);
   }

	calculateBonus = () => {
	}
	
	addGameBonus = () => {
	}
  render() {
    return (
      <div>
        This is base class component
      </div>
    );
  }
}

export default BaseStartComponent;
