import React from 'react';
import {KeyTableID} from "../../screens/gameHandle/game_handle";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import PropTypes from "prop-types";
import TriviaGame from './TriviaGame';

const ThisExperiment = 'Trivia';

let UserId = 'empty';
let RunningName = '-';
let StartTime = null;
let GAME_POINTS = 0;
let SUM_OF_CUPS = 0;
let DebugMode = null;
let GameSet = {};
let PaymentsSettings = null;
let GameCondition = null;
/*
const GameWelcome = ({Forward}) => {
    console.log("---> Forward 222")
    return (
        <div
            //ref={ref}
            className='cg_welcome'
        >
            <label>Welcome to the Trivia experiment!</label>
			<div className='cg_welcome_container'>
                <div className='cg_welcome_int'>
                    <label>Please read carefully the following instructions:</label>
                    <label class="bold-text">TBD</label>

                </div>

                
            </div>
            {
                // <div
                //     className='cg_welcome_demo_c'
                // >
                //     <div className='cg_welcome_demo'>
                //         {
                //             cupsSelected.map(
                //                 (bc, bc_index) => (
                //                     <BoardColumn
                //                         ball_speed={18}
                //                         numbers={false}
                //                         key={bc_index}
                //                         my_index={bc_index}
                //                         cup_selected={bc}
                //                         gain_msg={gainMsg}
                //                         msg_index={null}
                //                         ball_selected={ballIndex === bc_index}
                //                         msg_selected={null}
                //                         callback={callback}
                //                     />
                //                 )
                //             )
                //         }
                //
                //         {
                //             gainMsg && (
                //                 <GainMsg
                //                     gain_msg={gainMsg}
                //                     btnNext={null}
                //                 />
                //             )
                //         }
                //
                //     </div>
                // </div>
            }
            <button onClick={Forward}>Start the game</button>
        </div>
    )
};
*/
const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    StartTime = null;
    DebugMode = null;
    GameSet = {};
    PaymentsSettings = null;
    GAME_POINTS = 0;
    SUM_OF_CUPS = 0;
    GameCondition = null;
};

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        let RunCounter = KeyTableID();

        /*
            Props:
            SetLimitedTime,
            dmr,
            running_name: DB_RECORDS.KeyTable.RunningName,
            getTable,
            insertGameLine,
            sendGameDataToDB,
            insertTextInput,
            insertTaskGameLine,
            insertPayment,
            insertLineCustomTable,
            setWaitForAction: setWaitForAction,
            game_settings,
            more,
            isa,
            user_id: DB_RECORDS.UserDetails.UserId,
            callbackFunction
         */

        PaymentsSettings = props.game_settings.payments;

        GameSet.trials = Number(props.game_settings.game.trials);
        GameSet.reward = Number(props.game_settings.game.reward);
        GameSet.cups_start = Number(props.game_settings.game.cups_start);
        GameSet.storage_cost = props.game_settings.game.s_c;
        let no_ask = props.game_settings.game.no_ask;
        let cond = props.game_settings.game.cond;

        if (cond === 's')
            GameCondition = 'Specific';
        else if (cond === 'g')
            GameCondition = 'General';
        else if (cond === 'r') {
            // GameCondition = 'Random';
            let rnd = Math.floor(Math.random() * 2);
            if (rnd)
                GameCondition = 'Specific';
            else
                GameCondition = 'General';
        }
        else if (cond === 'u_d') {
            // GameCondition = 'Uniform distribution';
            if (RunCounter % 2)
                GameCondition = 'Specific';
            else
                GameCondition = 'General';
        }
        if (isNaN(no_ask)){
            if (no_ask === 'Random')
                GameSet.no_ask = Math.floor(Math.random() * 10).toString();
        }
        else{
            GameSet.no_ask = (Number(GameSet.no_ask) - 1).toString();
        }


        if (GameSet.cups_start > 10)
            GameSet.cups_start = 10;

        try {
            GameSet.ball_speed = Number(props.game_settings.game.ball_speed) || 1;

        }catch (e) {
            GameSet.ball_speed = 1;
        }

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
        };

        this.props.SetLimitedTime(false);

        this.Forward = this.Forward.bind(this);
        this.initializeGame = this.initializeGame.bind(this);

        this.game_template = null;

        this.initializeGame();

    }

    initializeGame() {

        let game_template = [];
/*
        game_template.push({
            Component: GameWelcome
        });
        */

        game_template.push({
          //  Component: Game
        });

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
        console.log("---> Forward 111")
        let sc = this.state;
        if (sc.tasks_index === (this.game_template.length-1)){
            this.props.SetLimitedTime(false);
            let rec = this.props.getGameRecords();

            let q_cup = 0, q_no_cup = 0, keep = 0, throw_ = 0, place = 0, dontPlace = 0;
            for (let i=0; i<rec.length; i++){
                if (rec[i].cup_decision === 'KeepCup')
                    keep++;
                else if (rec[i].cup_decision === 'ThrowCup')
                    throw_++;

                if (rec[i].no_cup_decision === 'PlaceCup')
                    place++;
                else if (rec[i].no_cup_decision === 'DontPlace')
                    dontPlace++;

                if (rec[i].cup_decision !== '') {
                    q_cup++;
                }
                if (rec[i].no_cup_decision !== '') {
                    q_no_cup++;
                }
            }

            this.props.insertTextInput('q_cup', q_cup);
            this.props.insertTextInput('q_no_cup', q_no_cup);

            this.props.insertTextInput('keepT', keep);
            this.props.insertTextInput('keep', Math.round((keep/q_cup) * 10000) / 10000);

            this.props.insertTextInput('throwT', throw_);
            this.props.insertTextInput('throw', Math.round((throw_/q_cup) * 10000) / 10000);

            this.props.insertTextInput('placeT', place);
            this.props.insertTextInput('place', Math.round((place/q_no_cup) * 10000) / 10000);

            this.props.insertTextInput('dontPlaceT', dontPlace);
            this.props.insertTextInput('dontPlace', Math.round((dontPlace/q_no_cup) * 10000) / 10000);

            let probability = GAME_POINTS / PaymentsSettings.exchange_ratio;
            if (probability > 1) probability = 1;
            else if (probability < 0) probability = 0;

            const current_time = getTimeDate();
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {
                    game_points: GAME_POINTS,
                    prob: probability,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            let Total_time = Date.now() - StartTime;
            let full_seconds = Total_time/1000;
            let minutes = Math.floor(full_seconds/60);
            let seconds = Math.floor(full_seconds - minutes*60);

            let Total_milli = `${minutes}:${seconds}`;
            const Avg_cup_num = Math.round((SUM_OF_CUPS / GameSet.trials)*1000)/1000;
            this.props.insertTextInput('Total_point', GAME_POINTS);
            this.props.insertTextInput('Avg_cup_num', Avg_cup_num);
            this.props.insertTextInput('Total_milli', Total_milli);
            this.props.insertTextInput('Total_time', Total_time);
            this.props.insertTextInput('Condition', GameCondition);

            this.props.insertPayment({
                game_points: GAME_POINTS,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                prob: probability,
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
                    game_points: GAME_POINTS,
                    exchange_ratio: PaymentsSettings.exchange_ratio,
                    q_cup,
                    q_no_cup,
                    keepT: keep,
                    throwT: throw_,
                    placeT: place,
                    dontPlaceT: dontPlace,
                    keep: Math.round((keep/q_cup) * 10000) / 10000,
                    throw_: Math.round((throw_/q_cup) * 10000) / 10000,
                    place: Math.round((place/q_no_cup) * 10000) / 10000,
                    dontPlace: Math.round((dontPlace/q_no_cup) * 10000) / 10000,
                    probability,
                    bonus_endowment: PaymentsSettings.bonus_endowment,
                    show_up_fee: PaymentsSettings.show_up_fee,
                    total_cups: SUM_OF_CUPS,
                    trials: GameSet.trials,
                    Avg_cup_num,
                    Total_milli,
                    Total_time
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
                                game_points: GAME_POINTS,
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
            if (sc.tasks_index === 0)
                this.props.SetLimitedTime(true);

            sc.tasks_index++;
        }
        this.setState(sc);
    }

    render() {
        return (
            <div>
              <TriviaGame></TriviaGame>
            </div>
          );
       
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};


export default Start;
