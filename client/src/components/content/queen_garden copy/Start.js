import React from 'react';
import './gameStyles.css';
import {Game} from "./items/board/board";
import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";
import QueenGardenTutorial from "./items/board/tutorial";


const ThisExperiment = 'QueenGarden';

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            message: this.props.Message
        };

        this.Forward = this.props.Forward;
        this.Button = this.props.Button;

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.Message !== prevProps.Message) {
            this.setState({
                message: this.props.Message
            });

        }

    }

    render() {

        return (
          <div
            className='sp-message-mode'
          >
              {this.state.message}
              <button
                style={{margin: 'auto'}}
                onClick={() => this.Forward()}>{this.Button}</button>
          </div>
        )
    }
}

let UserId = 'empty';
let RunningName = '-';
let StartTime = null;
let GAME_POINTS = 0;
let DebugMode = null;
let GameSet = {};
let PaymentsSettings = null;
let START_MIL = 0;
let AllGamesResult = [];
let TrialResults = [];
let TotalPoints = {};

const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    StartTime = null;
    DebugMode = null;
    GameSet = {};
    PaymentsSettings = null;
    GAME_POINTS = 0;
    TrialResults = [];
    AllGamesResult = [];
    TotalPoints = {};
};

// const Forest = ({}) => {
//   // const [winResize, setWinResize] = useWindowSize();
//   // const [fontSize, setFontSize] = useState(10);
//   //
//   // let ForestRef = useRef(null);
//   // let TreeRef = useRef(null);
//   //
//   // useEffect(() => {
//   //     // const resizeObserver = new ResizeObserver((event) => {
//   //     //     // Depending on the layout, you may need to swap inlineSize with blockSize
//   //     //     // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
//   //     //     setWidth(event[0].contentBoxSize[0].inlineSize);
//   //     //     setHeight(event[0].contentBoxSize[0].blockSize);
//   //     // });
//   //     //
//   //     // resizeObserver.observe(document.getElementById("div1"));
//   // });
//   //
//   // useEffect(() => {
//   //     if (!ForestRef || !ForestRef.current) return;
//   //     try {
//   //         const {width: forest_width, height: forest_height} = ForestRef.current.getBoundingClientRect();
//   //         const {width: tree_width, height: tree_height} = TreeRef.current.getBoundingClientRect();
//   //         // const f_size = Math.floor(height / 3);
//   //         // setFontSize(f_size/10)
//   //     }
//   //     catch (e) {
//   //
//   //     }
//   // }, [ForestRef, winResize, TreeRef]);
//
//   const places = [
//     {side: 'right', rotate: '-20', left: -40, bottom: '-23%'},
//     {side: 'right', rotate: '-45', left: -20, bottom: '-26%'},
//     {side: 'left', rotate: '30', left: 80, bottom: '-25%'},
//     {side: 'left', rotate: '60', left: 30, bottom: '-29%'},
//   ];
//
//   return (
//     <div
//       className='forest'
//     >
//       {
//         places.map(
//           (place, r_i) => (
//             <Road
//               key={r_i}
//               zIndex={1}
//               backgroundColor='gray'
//               left={`${r_i*15 + 40}%`}
//               top={`${-r_i*90 + 50}%`}
//               width={160}
//               signpost_bottom={place.bottom}
//               signpost_left={place.left}
//               signpost_rotate={place.rotate}
//               side={place.side}
//             />
//           )
//         )
//       }
//     </div>
//   )
// }

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();
        this.props.SetLimitedTime(false);

        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        PaymentsSettings = props.game_settings.payments;

        GameSet.CrownHighway_txt = props.game_settings.game.ch_txt;
        GameSet.KingdomLeft_txt = props.game_settings.game.c_l_txt;
        GameSet.KingdomRight_txt = props.game_settings.game.c_r_txt;
        GameSet.QueenSignpost_txt = props.game_settings.game.qg_txt;
        GameSet.Road1_txt = props.game_settings.game.r1_txt;
        GameSet.Road2_txt = props.game_settings.game.r2_txt;
        GameSet.Road3_txt = props.game_settings.game.r3_txt;
        GameSet.Road4_txt = props.game_settings.game.r4_txt;
        GameSet.WithTutorial = props.game_settings.game.w_t;
        GameSet.WithPractice = props.game_settings.game.w_p;
        GameSet.PracticeTrials = props.game_settings.game.pt;
        GameSet.TutorialForestPathRoadIndex = props.game_settings.game.tutorial_f_p-1;
        GameSet.TutorialRepeatTravelRoadIndex = props.game_settings.game.tutorial_r_t-1;
        const roads = [GameSet.Road1_txt, GameSet.Road2_txt, GameSet.Road3_txt, GameSet.Road4_txt];
        GameSet.TutorialForestPathRoadTxt = roads[GameSet.TutorialForestPathRoadIndex];
        GameSet.TutorialRepeatTravelRoadTxt = roads[GameSet.TutorialRepeatTravelRoadIndex];

        GameSet.RoadOnHover = props.game_settings.game.r_h;
        if (GameSet.RoadOnHover === 's') GameSet.RoadOnHover = 'Signpost';
        // else if (GameSet.RoadOnHover === 'r') GameSet.RoadOnHover = 'Road';
        else if (GameSet.RoadOnHover === 'a') GameSet.RoadOnHover = 'RoadAndSignpost';
        else GameSet.RoadOnHover = 'None';

        let RunCounter = KeyTableID();

        const game_condition = props.game_settings.game.cond;
        if (game_condition === 'Ra'){
            const rnd = Math.floor(Math.random() * 2);
            GameSet.GameCondition = rnd? 'Risk' : 'Dishonest';
        }
        else if (game_condition === 'U'){
            GameSet.GameCondition = RunCounter%2? 'Risk' : 'Dishonest';
        }
        else {
            GameSet.GameCondition = game_condition;
        }

        const GamesBank = props.game_settings.game.g_b;
        GameSet.GamesBank = [];
        for (let i=0; i<GamesBank.length; i++) {
            const {t, p0, a, r_v, m_t_c, pe, e_c} = GamesBank[i];
            GameSet.GamesBank.push({
                GameIndex: i+1,
                Trials: t,
                P0: p0,
                Adaptability: a,
                RewardValue: r_v,
                MileageTravelCost: m_t_c,
                Penalty: pe,
                EquipmentCost: e_c
            });
        }

        const {t, p0, a, r_v, m_t_c, pe, e_c} = props.game_settings.game.pt_g;

        GameSet.PracticeGame = {
            GameIndex: 0,
            Trials: t,
            P0: p0,
            Adaptability: a,
            RewardValue: r_v,
            MileageTravelCost: m_t_c,
            Penalty: pe,
            EquipmentCost: e_c
        };

        this.Forward = this.Forward.bind(this);
        this.trialEndHandle = this.trialEndHandle.bind(this);

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
            debugger_props: {}
        };

        this.game_template = null;

        this.initializeGame();
    }

    initializeGame() {

        let game_template = [];

        // game_template.push({
        //     Mode: 'Message',
        //     Message: () => GameWelcome(this.props.insertTextInput),
        //     Button: 'Continue'
        // });

        if (GameSet.WithTutorial === 'Yes'){
            game_template.push({
                Mode: 'Tutorial',
                GameSettings: GameSet.PracticeGame
            });
        }

        if (GameSet.WithPractice === 'Yes'){
            game_template.push({
                Mode: 'Message',
                Message: () => PracticeMsg(),
                Button: 'Continue',
            });

            game_template.push({
                Mode: 'Practice',
                GameSettings: GameSet.PracticeGame
            });

            game_template.push({
                Mode: 'Message',
                Message: () => PracticeFinish(),
                Button: 'Continue'
            });

            TotalPoints['GameIndex_0'] = 0;
        }


        for (let i=0; i<GameSet.GamesBank.length; i++){
            const is_last_game = i === (GameSet.GamesBank.length-1);
            game_template.push({
                Mode: 'Game',
                GameSettings: GameSet.GamesBank[i]
            });
            if (!is_last_game)
                game_template.push({
                    Mode: 'Message',
                    Message: () => EndGameMsg(),
                    Button: 'Next'
                });
            TotalPoints['GameIndex_' + (i+1)] = 0;

        }

        this.game_template = game_template;
    }

    componentDidMount(){
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'G.L',
            type: 'LogGameType',
            more_params: {
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => this.setState({isLoading: false}));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa){
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    Forward(){
        let sc = this.state;
        if (sc.tasks_index === (this.game_template.length-1)){
            this.props.SetLimitedTime(false);
            // this.props.insertTextInput('dontPlace', Math.round((dontPlace/q_no_cup) * 10000) / 10000);

            const total_points = AllGamesResult.filter(t => t.Part !== 'Practice').reduce((total, trial_) => total + trial_.Total, 0);
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {
                    game_points: total_points,
                },
            }).then((res) => {});

            const current_time = getTimeDate();

            // let Total_time = Date.now() - StartTime;
            // let full_seconds = Total_time/1000;
            // let minutes = Math.floor(full_seconds/60);
            // let seconds = Math.floor(full_seconds - minutes*60);

            // let Total_milli = `${minutes}:${seconds}`;
            this.props.insertTextInput('Total_point', total_points);
            for (let road in TotalPoints) {
                this.props.insertTextInput(road, TotalPoints[road]);
            }

            this.props.insertPayment({
                game_points: total_points,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                bonus_endowment: PaymentsSettings.bonus_endowment,
                show_up_fee: PaymentsSettings.show_up_fee,
                sign_of_reward: PaymentsSettings.sign_of_reward,
                Time: current_time.time,
                Date: current_time.date
            });

            sc.isLoading = true;

            let debug_args = null;
            if (DebugMode) {
                debug_args = {
                    game_points: total_points,
                    exchange_ratio: PaymentsSettings.exchange_ratio,
                    // Total_milli,
                    // Total_time
                }
            }

            this.setState(sc, () => {
                this.props.sendGameDataToDB().then(
                  res => {
                      NewLogs({
                          user_id: UserId,
                          exp: ThisExperiment,
                          running_name: RunningName,
                          action: 'G.E.S',
                          type: 'LogGameType',
                          more_params: {
                              game_points: total_points,
                              local_t: current_time.time,
                              local_d: current_time.date,
                          },
                      }).then((res) => {});
                      this.props.callbackFunction('FinishGame', {need_summary: true, args: debug_args});
                  }
                );
            });
        }
        else {
            TrialResults = [];
            sc.tasks_index++;
            const current_task = this.game_template[sc.tasks_index];
            if (current_task.Mode === 'Game'){
                START_MIL = Date.now();
            }
            sc.debugger_props = {};
        }
        this.setState(sc);
    }

    trialEndHandle(trial_props, roads_prob){
        let ElapsedTimeFromLastTrialMil;
        if (trial_props.Trial === 1)
            ElapsedTimeFromLastTrialMil = 0;
        else
            ElapsedTimeFromLastTrialMil = Date.now() - TrialResults[TrialResults.length-1].ActionTime;

        let obj = {
            ...trial_props,
            Condition: GameSet.GameCondition,
            Time: getTimeDate().time,
            ElapsedTimeFromLastTrialMil,
            ElapsedTimeFromStartMil: Date.now() - START_MIL
        };
        this.props.insertGameLine(obj);

        AllGamesResult.push(obj);

        TrialResults.push({
            ...obj,
            ActionTime: Date.now()
        });

        TotalPoints['GameIndex_'+trial_props.GameIndex] += trial_props.Total ;

        if (DebugMode)
            this.setState({
                debugger_props: {trial_props, roads_prob}
            });
    }

    render() {
        if (!this.state || this.state.isLoading || !Array.isArray(this.game_template)) {
            return <WaitForAction2/>;
        }

        return (
          <div
            className='sp-start-panel'
          >
              {this.game_template[this.state.tasks_index].Mode === 'Message' && (
                <Messages
                  Message={this.game_template[this.state.tasks_index].Message()}
                  Button={this.game_template[this.state.tasks_index].Button}
                  Forward={this.Forward}
                />
              )}

              {this.game_template[this.state.tasks_index].Mode === 'Tutorial' && (
                <QueenGardenTutorial
                  GameSet={GameSet}
                  GameSettings={this.game_template[this.state.tasks_index].GameSettings}
                  Forward={this.Forward}
                />
              )}

              {this.game_template[this.state.tasks_index].Mode === 'Game' && (
                <Game
                  GameSet={GameSet}
                  GameSettings={this.game_template[this.state.tasks_index].GameSettings}
                  trialEndHandle={this.trialEndHandle}
                  Forward={this.Forward}
                />
              )}

              <DebuggerItem
                debugger_props={this.state.debugger_props}
              />
          </div>
        );
    }
}

export default Start;

const DebuggerItem = ({debugger_props}) => {
    if (!debugger_props || !Object.keys(debugger_props).length)
        return <></>;

    return (
      <DebuggerModalView>
          <div className='Q_G-Debugger'>
              <div className='Q_G-Debugger1'>
                  <label>Game points: <span>{TotalPoints['GameIndex_'+debugger_props.trial_props.GameIndex]}</span></label>
              </div>

              <div className='Q_G-Debugger1'>
                  <label>Trial data:</label>
                  <div>
                      <DItems items={debugger_props.trial_props} />
                  </div>
              </div>

              <div className='Q_G-Debugger1'>
                  <label>Roads prob:</label>
                  <div>
                      <DItems items={debugger_props.roads_prob} />
                  </div>
              </div>

              <div className='Q_G-Debugger2'>
                  <label>Game data:</label>
                  <div>
                      {
                          TrialResults.map(t => ({
                              Trial: t.Trial,
                              PathChoose: t.PathChoose,
                              PathProb: t.PathProb,
                              RandomNumber: t.RandomNumber,
                              Busted: t.Busted,
                              Reward: t.Reward,
                              Pay: t.Pay,
                              Total: t.Total,
                          })).reverse().map(
                            (val, index) => (
                              <DItems key={index} items={val} />
                            )
                          )
                      }
                  </div>
              </div>

          </div>
      </DebuggerModalView>
    )
}

const DItem = ({item_label, item_data}) => {
    return (
      <label>
          {item_label}:
          <span>{item_data}</span>
      </label>
    )
};

const DItems = ({items}) => {
    return (
      <div>
          {
              Object.keys(items).map(
                (item, item_i) => (
                  <DItem
                    key={item_i}
                    item_label={item}
                    item_data={items[item]}
                  />
                )
              )
          }
      </div>
    )
}

export const getGameSet = () => GameSet;

const RiskWelcome = () => {
    return (
      <p>
          You have been tasked with delivering plants for the Queen of the realm.
          The plants are grown in a greenhouse on the outskirts of the forest.
          Your job is to pick up the plants from the greenhouse, and deliver them to her castle.
          <br/><br/>
          She reminds you of the recent attacks on merchants by forest bandits and
          so emphasizes using the highway that goes around the forest, as this roadway
          is guarded by her personal knight regiment.
          <br/><br/>
          She makes no guarantees for safety should you choose to take the
          paths through the Shadewood.
          <br/><br/>
          You will be paid {GameSet.RewardValue} upon successful delivery.
      </p>
    )
}

const DishonestWelcome = () => {
    return (
      <p>
          You have been tasked with delivering plants for the Queen of the realm. The plants are grown in a greenhouse on the outskirts of the forest. Your job is to pick up the plants from the greenhouse, and deliver them to her castle.
          <br/><br/>
          She emphasizes the importance of sunlight for the health of the plants,
          and so as part of the contract tells you that all travel through the Shadewood is banned.
          Instead, you are required to travel the Crown Highway.
          You will be paid {GameSet.RewardValue} upon successful delivery.
          <br/><br/>
          As an experienced merchant,
          you know that the cost of travel along the Crown Highway is [mileage/Toll].
      </p>
    )
}

const GameWelcome = (insertTextInput) => {

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
              GameSet.GameCondition === 'Risk'? <RiskWelcome/> : <DishonestWelcome/>
          }
      </div>
    )
};

const PracticeMsg = () => {

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
              You have {GameSet.PracticeTrials} runs before the game begins.<br/>
              This practice will not affect your score at the end, or impact your payment.<br/>
          </p>
      </div>
    )
};

const PracticeFinish = () => {

    return (
      <div
        className=''
        style={{
            display: 'grid',
            rowGap: 10
        }}
      >
          <p>
              PRACTICE_FINISH_MESSAGE
          </p>
      </div>
    )
};

const EndGameMsg = () => {

    return (
      <div
        className=''
        style={{
            display: 'grid',
            rowGap: 10
        }}
      >
          <p>
              GAME_FINISH_MESSAGE
          </p>
      </div>
    )
};
