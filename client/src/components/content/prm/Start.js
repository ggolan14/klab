import React, { Component } from 'react';
//import './gameStyles.css';
//import trivia_questions from './trivia_questions.json';
import { getTimeDate } from "../../../utils/app_utils";
import { NewLogs } from "../../../actions/logger";
import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
//import TriviaIntroduction from './TriviaIntroduction';
import FoodPreference from '../../../common/FoodPreference';
import ResourceAllocation from '../mind_game/ResourceAllocation';
import { formatPrice } from '../../utils/StringUtils';
import MathQuestion from '../../../common/MathQuestion';

import ImgIntro1 from './images/introduction1.png';
import ImgIntro2 from './images/introduction2.png';
const ThisExperiment = 'Prm';


let trivia_questions=[]
let UserId = 'empty';
let RunningName = '-';
let SignOfReward = "$";
let GameCondition = null;
let NUM_OF_PRACTICE_QUESTIONS = 4;
let lastIndex;
let startShowQuestionTimer = 0;
let endShowQuestionTimer = 0;
let startShowConfirmationTimer = 0;
let endShowConfirmationTimer = 0;
let totalShowQuestionTime = 0;
let totalShowConfirmationTime = 0;
//let extended_name;
const yesButtonInRight = Math.random() < 0.5;


class Start extends Component {
  constructor(props) {
    super(props);

    
  }

    

  componentDidMount(){
    
}

  

  
 






 

 





  render() {
  return <div>
    <div style={{ flex: '0 0 auto', textAlign: 'center', paddingTop: '70px' }}>
              <label>Example: a step in the game</label>
              <br />
              <img src={ImgIntro1} alt="Game Introduction" style={{ width: '300px', height: '200px', borderRadius: '8px' }} /> 
            </div>
  </div>
  }


}

export default Start;
