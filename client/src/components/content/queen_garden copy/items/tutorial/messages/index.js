import React from "react";
import KNIGHT_IMG from '../../images/knight.png';

const RiskWelcome = ({GameSettings, GameSet}) => {
  return (
    <p>
      You have been tasked with delivering plants for the Queen of the realm.
      The plants are grown in a greenhouse on the outskirts of the forest.
      Your job is to pick up the plants from the greenhouse,
      and deliver them to her castle.
      You will be paid {GameSettings.RewardValue} coins upon successful delivery.
      <br/><br/>
      She reminds you of the recent attacks on merchants by bears in the Shadewood
      and so emphasizes using the highway that goes around the forest.
      As an experienced merchant,
      you know that the cost of travel along the {GameSet.CrownHighway_txt} is {GameSettings.MileageTravelCost} coins.
    </p>
  )
}

const DishonestWelcome = ({GameSettings, GameSet}) => {
  return (
    <p>
      You have been tasked with delivering plants for the Queen of the realm. The plants are grown in a greenhouse on the outskirts of the forest. Your job is to pick up the plants from the greenhouse, and deliver them to her castle.
      <br/><br/>
      She emphasizes the importance of sunlight for the health of the plants, and so as part of the contract tells you that all travel through the Shadewood is banned.
      Instead, you are required to travel the {GameSet.CrownHighway_txt}. You will be paid {GameSettings.RewardValue} coins upon successful delivery.
      <br/><br/>
      As an experienced merchant, you know that the cost of travel along the {GameSet.CrownHighway_txt} is {GameSettings.MileageTravelCost} coins.
    </p>
  )
}

const tutorialStep0 = ({GameSettings, Condition, GameSet}) => {

  return (
    Condition === 'Risk'? (
      <RiskWelcome
        GameSettings={GameSettings}
        GameSet={GameSet}
      />
    ) : (
      <DishonestWelcome
        GameSettings={GameSettings}
        GameSet={GameSet}
      />
    )
  )
}

const tutorialStep1 = ({GameSet}) => {

  return (
    <p>
      Before you can begin your contract with the queen, first you’ll need to make it to the castle and speak with her about the terms. <br/>
      To make it there, you should take the {GameSet.CrownHighway_txt}.
      <br/><br/>
      To move the wagon, you have to click where you want it to go. To use the {GameSet.CrownHighway_txt}:
      <br/><br/>
      1:Click on the road sign that says {GameSet.CrownHighway_txt}
      <br/><br/>
      2:Click on {GameSet.KingdomLeft_txt} {GameSet.KingdomRight_txt}
    </p>
  )
}

const tutorialStep2 = ({GameSet}) => {
  return (
    <div
      style={{display: 'grid'}}
    >
      <p>
        You have now returned to the outskirts of the Shadewood where you live.
        Before you can begin making deliveries in earnest,
        you need to travel to {GameSet.KingdomLeft_txt} {GameSet.KingdomRight_txt} once more to hire additional hands.
        <br/><br/>

        The {GameSet.CrownHighway_txt} is shut down today, so you will have to travel through the Shadewood forest. 
        There are 4 paths to choose from, for today, you decide to take the [Road #1]

        1:Click on the sign that says "{GameSet.Road1_txt}"

        2:Click on {GameSet.KingdomLeft_txt} {GameSet.KingdomRight_txt}

      </p>

    </div>
  )
}

const tutorialStep3 = ({GameSet}) => {
  return (
    <div
      style={{display: 'grid'}}
    >
      <p>
        The {GameSet.CrownHighway_txt} is shut down for one more day. Your last objective is to register with the Merchant’s guild in [Kingdom Left] [Kingdom Right] before you can begin working for the Queen.
        <br/><br/>
        You will have to travel through the Shadewood again. Since you took {GameSet.Road1_txt} yesterday, you decide to do so again.
        <br/><br/>
        1: Click on {GameSet.KingdomLeft_txt} {GameSet.KingdomRight_txt} again
        <br/><br/>
        "Note: Traveling again along the same route requires clicking only on {GameSet.KingdomLeft_txt} {GameSet.KingdomRight_txt}. The wagon begins by default at the entrance to the previously used route.”
      </p>

    </div>
  )
}

// const tutorial2step1 = (condition, TutorialForestPathRoadTxt, TutorialRepeatTravelRoadTxt) => {
const tutorial2step1 = ({TutorialForestPathRoadTxt}) => {
  return (
    <p>
      You’ve taken on the contract with the Queen to run Deliveries, and returned to the outskirts of the Shadewood where you live.<br/>
      Before you can begin making deliveries in earnest, you need to travel to the city of Zorea once more to hire additional hands.
      <br/><br/>
      The Crown Highway is shut down today,  you will have to travel through the Shadewood forest.<br/>
      There are 4 paths to choose from, for today, you decide to take the Red Oak Road.
      <br/><br/>
      Click on the sign that says "{TutorialForestPathRoadTxt}"
    </p>
  )
}

const tutorial2step2_Dishonesty = () => {
  return (
    <p>
      Travelling through the Shadewood you are stopped by guards.
      <br/><br/>
      "Halt! State your business!"
      <br/><br/>
      You inform the guardsman that you are travelling to Zorea to hire additional hands.
      <br/><br/>
      The guard tells you that he and his fellow guards are patrolling the forest paths for smugglers.<br/>
      He tells you that increased foot traffic means he’ll have to bring more guards tomorrow
    </p>
  )
}

const tutorial2step2_Risk = () => {
  return (
    <p>
      Travelling through the Shadewood you are stopped by guards.
      <br/><br/>
      "Halt! State your business!"
      <br/><br/>
      You inform the guardsman that you are travelling to Zorea to hire additional hands.
      <br/><br/>
      The guard tells you that he and his fellow guards are patrolling the forest paths for bandits and thieves.<br/>
      He warns you to be careful travelling through the Shadewood, that criminal activity has been reported in the area.
    </p>
  )
}

const tutorial2step2 = ({Condition}) => {
  return (
    <
      // style={{display: 'grid'}}
    >
      {Condition === 'Risk'? tutorial2step2_Risk() : tutorial2step2_Dishonesty()}
      {/*<img*/}
      {/*  alt='knight'*/}
      {/*  src={KNIGHT_IMG}*/}
      {/*  width={90}*/}
      {/*  height={160}*/}
      {/*  style={{margin: 'auto'}}*/}
      {/*/>*/}
    </>
  )
}

// const tutorial3step1 = (condition, TutorialForestPathRoadTxt, TutorialRepeatTravelRoadTxt) => {
const tutorial3step1 = ({TutorialRepeatTravelRoadTxt}) => {
  return (
    <p>
      The Crown Highway is shut down for one more day.<br/>
      Your last objective is to register with the Merchant’s guild in Zorea before you can begin working for the Queen.
      <br/><br/>
      You will have to travel through the Shadewood again.<br/>
      Since you took the Red Oak Road yesterday, you decide to do so again.
      <br/><br/>
      Click the {TutorialRepeatTravelRoadTxt} sign
    </p>
  )
}

const tutorial3step2 = ({Condition}) => {
  return (
    <p>
      You note that there is some sign of your previous activity travelling this route.
      <br/><br/>
      You also notice that travelling through it again, there is less obstruction as you cleared some obstacles the previous day.
      <br/><br/>
      NOTE: Repeat travel along a forest route generates signs of activity, which means {Condition === 'Risk'?'Bandits':'Guards'} are more likely to be watching that path.
      <br/><br/>
      However repeated travel also reduces the time needed to travel the path.
    </p>
  )
}


export const getTutorialMessage = ({
                                     onClick,
                                     GameSet,
                                     GameSettings,
                                     tutorial_step
                                   }) => {
  let msg = [
    tutorialStep0,
    tutorialStep1,
    tutorialStep2,
    tutorialStep3,
  ];

  const button_indexes = [0];

  console.log('tutorial_step', tutorial_step);
  // console.log('GameSet', GameSet);
  return (
    <>
      {msg[tutorial_step]({GameSet, GameSettings})}
      {
        (button_indexes.indexOf(tutorial_step) > -1) && (
          <button
            onClick={() => onClick({is_button: true})}
          >
            Continue
          </button>
        )
      }
    </>
  )
}
