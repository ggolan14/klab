import React, {useEffect, useState} from "react";
import './wagon.css';
import {Wheel} from "./wheel";
import {Flower} from "../flowers/flower";
import WagonTravelMsg from "./travel_msg";

const positions = {
  road1: {
    bottom: '8%',
    left: '25%',
  },
  castle_road_tol_road1: {
    bottom: '30%',
    left: '25%',
  },
  road2: {
    bottom: '8%',
    left: '40%',
  },
  road3: {
    bottom: '8%',
    left: '50%',
  },
  road4: {
    bottom: '8%',
    left: '60%',

  },
  queen_road: {
    bottom: '4%',
    left: '65%',
    // transform: 'rotate(90deg)'
  },
  castle1: {
    bottom: '8%',
    left: '90%',
    // transform: 'rotate(90deg)'
  },
  castle2: {
    bottom: '8%',
    left: '90%',
    transform: 'rotate(90deg)'
  },
  castle3: {
    top: '8%',
    left: '90%',
    transform: 'rotate(90deg)'
  },
  castle4: {
    top: '8%',
    left: '90%',
  },
  castle_queen_tol: {
    top: '8%',
    left: '80%',
  },
  castle_end_queen: {
    top: '8%',
    left: '50%',
  },
  end_castle_road_tol_road1: {
    top: '8%',
    left: '35%',
  },
  end_castle_road_tol_road2: {
    top: '8%',
    left: '35%',
  },
  reset: {
    bottom: '8%',
    left: '45%',
  }
};
let st;
export const Wagon = ({wagonPosition, finishAction, handleClick, GameSet, GameSettings}) => {
  const [wagonState, setWagonState] = useState(null);
  const [travelMsg, setTravelMsg] = useState({});

  const handleMsgCB = () => {
    if (travelMsg.message_type === 'Toll_Booth'){
      setTravelMsg({});
      const move_direction ='forward';
      setWagonState({
        road: 'castle_end_queen',
        move_direction
      });

      setTimeout(() => {
        setWagonState(state => ({
          ...state,
          move_direction: null
        }));
        setTravelMsg({
          message_type: 'QueenRoad_Finish'
        });
        finishAction({action: 'finish_to_castle'})
      });
    }
    else if (travelMsg.message_type === 'QueenRoad_Finish'){
      setTravelMsg({});
      handleClick({is_button: true})
    }
    else if (travelMsg.message_type === 'Road_Finish'){
      setTravelMsg({});
      handleClick({is_button: true});
    }
    else if (travelMsg.message_type === 'Toll_Road_Tutorial'){
      setTravelMsg({});
      const move_direction ='forward';
      setWagonState({
        road: 'end_' + wagonState.road,
        move_direction
      });

      setTimeout(() => {
        setWagonState(state => ({
          ...state,
          move_direction: null
        }));
        setTravelMsg({
          message_type: 'Road_Finish'
        });
        finishAction({action: 'finish_to_castle'})
      });
    }
  }

  const ForwardToCastleFromQueenRoad = () => {
    const move_direction ='forward';
    setWagonState({
      road: 'castle1',
      move_direction
    });
    st = setTimeout(() => {

      setWagonState({
        road: 'castle2',
        move_direction
      });

      st = setTimeout(() => {
        setWagonState({
          road: 'castle3',
          move_direction
        });

        st = setTimeout(() => {
          setWagonState({
            road: 'castle4',
            move_direction
          });

          st = setTimeout(() => {
            if (wagonPosition.with_tol){
              setWagonState({
                road: 'castle_queen_tol',
                move_direction
              });
              setTravelMsg({
                message_type: 'Toll_Booth'
              });
            }
            else {
              setWagonState({
                road: 'castle5',
                move_direction
              });
              finishAction({action: 'finish_to_castle'})
            }

            st = setTimeout(() => {
              setWagonState(state => ({
                ...state,
                move_direction: null
              }))
            }, 1000);

          }, 1000);

        }, 1000);

      }, 1000);

    }, 1000);
  }

  const ForwardToCastleFromRoad = (road, is_tutorial) => {
    const move_direction ='forward';

    if (wagonPosition.with_tol){
      setWagonState({
        road: 'castle_road_tol_' + road,
        move_direction
      });
      setTravelMsg({
        message_type: is_tutorial? 'Toll_Road_Tutorial' : 'Toll_Booth'
      });
    }
    else {
      setWagonState({
        road: 'castle_' + road,
        move_direction
      });
      finishAction({action: 'finish_to_castle'});
    }

    // st = setTimeout(() => {
    //   if (wagonPosition.with_tol){
    //     setWagonState({
    //       road: 'castle_queen_tol',
    //       move_direction
    //     });
    //     setTravelMsg({
    //       message_type: 'Toll_Booth'
    //     });
    //   }
    //   else {
    //     setWagonState({
    //       road: 'castle5',
    //       move_direction
    //     });
    //   }
    //
    //   st = setTimeout(() => {
    //     finishAction({action: 'finish_to_castle'})
    //     setWagonState(state => ({
    //       ...state,
    //       move_direction: null
    //     }))
    //   }, 1000);
    //
    // }, 1000);
    // setWagonState({
    //   road: 'castle1_' + road,
    //   move_direction
    // });
    // st = setTimeout(() => {
    //
    //
    // }, 1000);
  }

  const ResetFromCastleToRoad = (road, is_tutorial) => {
    const move_direction ='forward';

    setWagonState({
      road: 'castle_road_tol_' + road,
      move_direction
    });

    st = setTimeout(() => {
      setWagonState({
        road: road,
        move_direction
      });

      st = setTimeout(() => {
        finishAction({action: 'finish_to_reset'})
        setWagonState(state => ({
          ...state,
          move_direction: null
        }))
      }, 1000);

    }, 1000);
  }

  const ResetFromCastleToQueenRoad = () => {
    const move_direction ='back';

    setWagonState({
      road: 'castle4',
      move_direction
    });

    st = setTimeout(() => {


      st = setTimeout(() => {
        setWagonState({
          road: 'castle3',
          move_direction
        });

        st = setTimeout(() => {
          setWagonState({
            road: 'castle2',
            move_direction
          });
          st = setTimeout(() => {
            setWagonState({
              road: 'castle1',
              move_direction
            });

            st = setTimeout(() => {
              setWagonState({
                road: 'queen_road',
                move_direction
              });

              st = setTimeout(() => {
                finishAction({action: 'finish_to_reset'})
                setWagonState(state => ({
                  ...state,
                  move_direction: null
                }))
              }, 1000);
            }, 1000);

          }, 1000);
        }, 1000);

      }, 1000);

    }, 1000);
  }

  useEffect(() => {
    if (!wagonPosition) return;
    let st;
    if (wagonPosition.road === 'castle'){
      if (wagonPosition.from_road === 'queen_road'){
        ForwardToCastleFromQueenRoad();
      }
      else if (wagonPosition.from_road.includes('road')){
        ForwardToCastleFromRoad(wagonPosition.from_road, wagonPosition.is_tutorial);
      }
    }
    else if (wagonPosition.road === 'queen_road' && wagonPosition.from_castle){
      ResetFromCastleToQueenRoad();
      // else
      //   ForwardToCastleFromQueenRoad();
    }
    else if (wagonPosition.from_castle && wagonPosition.move_direction === 'back'){
      ResetFromCastleToRoad(wagonPosition.road);
      // else
      //   ForwardToCastleFromQueenRoad();
    }
    else if (wagonPosition.road === 'reset'){
      if (wagonPosition.from_castle){
        ResetFromCastleToQueenRoad();
      }
      else {
        setWagonState({
          road: wagonPosition.road,
        });
      }

      st = setTimeout(() => {
        setWagonState(state => ({
          ...state,
          move_direction: null
        }))
      }, 1000);
    }
    else {

      const move_direction ='forward';
      setWagonState({
        road: wagonPosition.road,
        move_direction: wagonPosition?.move_direction || move_direction
      });

      st = setTimeout(() => {
        setWagonState(state => ({
          ...state,
          move_direction: null
        }))
      }, 1000);
    }

    return () => clearTimeout(st);
  }, [wagonPosition]);

  // const [kkk, setKkk] = useState({road: 'reset', move_direction: null});
  // const [kkk, setKkk] = useState({road: 'road1', move_direction: null});
  // useEffect(() => {
  //   let timeout = setTimeout(() => {
  //     const roads = ['queen_road', 'road1', 'road2', 'road3', 'road4'];
  //
  //     let new_road = kkk.road;
  //     let tries = 0;
  //     while (new_road === kkk.road || tries > 6){
  //       const index_ = Math.floor(Math.random() * roads.length);
  //       new_road = roads[index_];
  //       tries++;
  //     }
  //
  //     const move_direction ='forward';
  //     setKkk(state => ({
  //       ...state,
  //       road: new_road,
  //       move_direction
  //     }));
  //
  //   }, 1000);
  //   return () => clearTimeout(timeout);
  // }, [kkk]);
  // const move_direction ='back';


  // const road_ = wagonPosition;

  const wp = positions[wagonState?.road];

  return (
    <>
      <div
        className={"qg_wagon"}
        style={wp}
      >
        <Flower
          className='flower_absolute'
          style={{
            top: -50,
            left: '40%',
            transform: 'translateX(-50%)'
          }}
        />

        <div
          className='qg_wagon_base'
        />

        <div
          style={{
            display: 'flex',
            columnGap: 30,
            width: "max-content",
          }}
        >
          <Wheel move_direction={wagonState?.move_direction} side='left'/>
          <Wheel move_direction={wagonState?.move_direction} side='right'/>
        </div>
      </div>
      {Object.keys(travelMsg).length && (
        <WagonTravelMsg
          GameSet={GameSet}
          GameSettings={GameSettings}
          travelMsg={travelMsg}
          handleClick={handleMsgCB}
        />
      )}
    </>
  )
}
