import React, {useEffect, useState} from "react";
import './msg.css';
import {getTutorialMessage} from "./messages";

export default function TutorialMsg({
                                      tutorialNumber, tutorialStep, Condition,
                                      onClick, TutorialForestPathRoadTxt, TutorialRepeatTravelRoadTxt,
                                      GameSettings, GameSet
}){
  const [visible, setVisible] = useState(!(tutorialNumber === 1 && tutorialStep === 1));

  useEffect(() => {
    if (!visible)
      setTimeout(() => setVisible(true), 1500);
  }, []);

  if (!visible)
    return <></>;

  // const message_position = 'center';
  const message_position = 'left';

  return (
    <div
      className={'qg_tutorial_msg ' + 'msg_pos_'+message_position+ ' ' + ((tutorialNumber === 1 && tutorialStep === 1)? ' qg_tutorial_msg_delay' : '')}
    >
      {getTutorialMessage({
        tutorialNumber,
        tutorialStep,
        Condition,
        onClick,
        TutorialForestPathRoadTxt,
        TutorialRepeatTravelRoadTxt,
        GameSet,
        GameSettings
      })}
    </div>
  )
}
