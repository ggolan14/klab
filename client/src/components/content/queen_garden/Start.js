import React from 'react';
import './gameStyles.css';
import { KeyTableID} from "../../screens/gameHandle/game_handle";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";
import {QueenGardenContext} from "./context/qg_context";
import {EndGameMsg} from "./messages/msg";
import QueenGardenTutorial from "./tutorial";
import QueenGardenGame from "./game";

const ThisExperiment = 'QueenGarden';

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

        GameSet.Labels = {
            CrownHighway: props.game_settings.game.ch_txt,
            KingdomLeft: props.game_settings.game.c_l_txt,
            KingdomRight: props.game_settings.game.c_r_txt,
            SignpostRoad1: props.game_settings.game.r1_txt,
            SignpostRoad2: props.game_settings.game.r2_txt,
            SignpostRoad3: props.game_settings.game.r3_txt,
            SignpostRoad4: props.game_settings.game.r4_txt,
            SignpostQueen: props.game_settings.game.qg_txt,
        };

        GameSet.WithTutorial = props.game_settings.game.w_t;
        GameSet.WithPractice = props.game_settings.game.w_p;
        GameSet.PracticeTrials = props.game_settings.game.pt;
        GameSet.RewardValue = props.game_settings.game.r_v;
        GameSet.TollCost = props.game_settings.game.t_c;
        GameSet.GamesOrder = props.game_settings.game.g_o === 'r'? 'Random' : 'NoRandom'; // n_r -> Ascending

        let RunCounter = KeyTableID();

        let game_condition = props.game_settings.game.cond;
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

        let GamesBank = props.game_settings.game.g_b;
        GameSet.GamesBank = [];
        while (GamesBank.length){
            const next_index = GameSet.GamesOrder === 'NoRandom'? 0 : Math.floor(Math.random() * GamesBank.length);
            const {t, p0, a, r_v, m_t_c, pe, e_c} = GamesBank[next_index];
            GameSet.GamesBank.push({
                Trials: t,
                P0: p0,
                Adaptability: a,
                RewardValue: r_v,
                MileageTravelCost: m_t_c,
                Penalty: pe,
                EquipmentCost: e_c
            });
            GamesBank = GamesBank.filter((_, index) => index !== next_index);
        }
        // for (let i=0; i<GamesBank.length; i++) {
        //     const {t, p0, a, r_v, m_t_c, pe, e_c} = GamesBank[i];
        //     GameSet.GamesBank.push({
        //         GameIndex: i+1,
        //         Trials: t,
        //         P0: p0,
        //         Adaptability: a,
        //         RewardValue: r_v,
        //         MileageTravelCost: m_t_c,
        //         Penalty: pe,
        //         EquipmentCost: e_c
        //     });
        // }

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
            debugger_props: {},
            game_settings: GameSet,
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

        // if (GameSet.WithTutorial === 'Yes'){
        //     game_template.push({
        //         Mode: 'Tutorial',
        //     });
        // }

        if (GameSet.WithPractice === 'Yes'){
            game_template.push({
                Mode: 'Game',
                Part: 'Practice',
                GameSettings: GameSet.PracticeGame
            });

            TotalPoints['GameIndex_0'] = 0;
        }


        for (let i=0; i<GameSet.GamesBank.length; i++){
            const is_last_game = i === (GameSet.GamesBank.length-1);
            game_template.push({
                Mode: 'Game',
                GameIndex: i
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
            sc.isLoading = true;
            sc.debugger_props = {};
            this.setState(sc, () => {
                setTimeout(() => {
                    sc.isLoading = false;
                    sc.tasks_index++;
                    const current_task = this.game_template[sc.tasks_index];
                    if (current_task.Mode === 'Game'){
                        START_MIL = Date.now();
                    }
                    this.setState(sc);
                }, 1);
            });
        }
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
        if (!this.state || this.state.isLoading || !this.state.game_settings || !Array.isArray(this.game_template)) {
            return <WaitForAction2/>;
        }

        return (
          <QueenGardenContext.Provider
            value={{
                game_settings: this.state.game_settings,
                Forward: this.Forward
            }}
          >
              <div
                className='sp-start-panel'
              >
                  {this.game_template[this.state.tasks_index].Mode === 'Tutorial' && (
                    <QueenGardenTutorial />
                  )}

                  {this.game_template[this.state.tasks_index].Mode === 'Game' && (
                    <QueenGardenGame
                      Part={this.game_template[this.state.tasks_index].Part}

                    />
                  )}

                  {/*<DebuggerItem*/}
                  {/*  TotalPoints={TotalPoints}*/}
                  {/*  TrialResults={TrialResults}*/}
                  {/*  debugger_props={this.state.debugger_props}*/}
                  {/*/>*/}
              </div>
          </QueenGardenContext.Provider>

        );
    }
}

export default Start;
