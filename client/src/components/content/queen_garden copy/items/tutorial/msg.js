import React, {useEffect, useState} from "react";
import './msg.css';
import {getTutorialMessage} from "./messages";

export default function TutorialMsg({
                                      tutorial_step, onClick,
                                      GameSettings, GameSet
}){
  const [visible, setVisible] = useState(tutorial_step !== 0);
  // console.log('---> tutorial_step', tutorial_step);

  useEffect(() => {
    if (!visible)
      setTimeout(() => setVisible(true), 1500);
  }, []);

  if (!visible) return <></>;

  // const message_position = 'center';
  const message_position = 'left';

  return (
    <div
      className={'qg_tutorial_msg ' + 'msg_pos_'+message_position+ ' ' + (tutorial_step === 0? ' qg_tutorial_msg_delay' : '')}
    >
      {getTutorialMessage({
        onClick,
        GameSet,
        GameSettings,
        tutorial_step
      })}
    </div>
  )
}
