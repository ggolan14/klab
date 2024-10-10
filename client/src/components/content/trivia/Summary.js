import React, { useEffect } from 'react';
import { DebuggerModalView } from "../../screens/gameHandle/game_handle";
import { formatPrice } from '../../utils/StringUtils';

const Summary = ({ SummaryArgs }) => {
  
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave this page? Your progress may not be saved."; // This message may not be shown in some browsers, but the default popup will appear.
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <label>
      Thank you for your participation.
      Your bonus is {formatPrice(SummaryArgs.reward_sum, SummaryArgs.sign_of_reward)}, and will be added to your participation payment.<br />
      To receive your payment, please copy the completion code below and click on the <b>Finish Game</b> button.<br/>It is essential to click <b>Finish Game</b> for your data to be recorded!
    </label>
  );
};

export default Summary;
