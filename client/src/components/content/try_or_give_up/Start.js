import React, {useEffect, useRef, useState} from 'react';
import './gameStyles.css';
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";

import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";
import {adjustFont} from "../../../utils/app_utils";

const ThisExperiment = 'TryOrGiveUp';

let UserId = null;
let RunningName = '-';
let DebugMode = null;
let PaymentsSettings = null;

let GameSet = {}, MatrixValues = null;

let RoundsPoints = [], GamePoints = {};

const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    DebugMode = null;
    PaymentsSettings = null;
    GameSet = {};
    MatrixValues = null;
    RoundsPoints = [];
    GamePoints = {};
};

const GameHead = ({game_order, trial, round , showMessage}) => {
    
    //console.log("---> GameHead   game_order="+game_order +" trial="+trial+" round="+round+ " showMessage="+showMessage);
    if(!showMessage){
        return (
            <label></label>
        )
    }
    return (
        <div className='tog-g_b-h'>
            <label>
                You are on trial <span>{trial+1}</span> out of <span>{GameSet.trials}</span> trials in this round<br/>
                Round <span>{round}</span> out of <span>{GameSet.rounds}</span> rounds<br/>
                Game <span>{game_order}</span> out of <span>{GameSet.games_play.length}</span> games
            </label>
        </div>
    )
}

const GameMatrix = ({disableClicks, game_play, MatrixType, MatrixElement, MatrixValues, ContainerRef, callback}) => {
    const [cellDim, setCellDim] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState({
        index: null, value: null
    });
    const Ref = useRef();

    const handleClick = (index) => {

        let random_prob = null;

        let final_value, value, exploration = false, selected_val;

        let exploration_cost = 0, punish_reward = 0;
        if (MatrixValues[index] === null){
            exploration = true;
            random_prob = Math.random();

            if (random_prob > MatrixElement.PH){
                value = MatrixElement.L;
                selected_val = 'L';
            }
            else {
                value = MatrixElement.H;
                selected_val = 'H';
            }
            MatrixValues[index] = value;
        }
        else {
            value = MatrixValues[index];
            selected_val = value === MatrixElement.H ? 'H' : 'L';
        }

        final_value = value;

        if (exploration){
            exploration_cost = -1 * GameSet.exploration_cost;
            final_value -= GameSet.exploration_cost;
        }

        if (game_play === 2){
            if (MatrixType === 'GiveUpMatrix'){
                punish_reward = -1 * GameSet.punish_reward;
                final_value -= GameSet.punish_reward;
            }
        }
        else if (game_play === 3){
            if (MatrixType === 'TryMatrix' && selected_val === 'L' && !exploration){
                punish_reward = -1 * GameSet.punish_reward;
                final_value -= GameSet.punish_reward;
            }
        }
        else if (game_play === 4){
            if (MatrixType === 'GiveUpMatrix'){
                punish_reward = -1 * GameSet.punish_reward;
                final_value -= GameSet.punish_reward;
            }

            if (MatrixType === 'TryMatrix' && selected_val === 'L' && !exploration){
                punish_reward = -1 * GameSet.punish_reward;
                final_value -= GameSet.punish_reward;
            }
        }
        else if (game_play === 5){
            if (MatrixType === 'TryMatrix' && exploration){
                punish_reward = GameSet.punish_reward;
                final_value += GameSet.punish_reward;
            }
        }
        else if (game_play === 6){
            if (MatrixType === 'TryMatrix'){
                punish_reward = GameSet.punish_reward;
                final_value += GameSet.punish_reward;
            }
        }

        setSelectedIndex({index, value: final_value});
        callback({
            MatrixType, index, value, final_value,
            random_prob, exploration, selected_val,
            exploration_cost, punish_reward
        });
    }

    useEffect(() => {
        if (!disableClicks)
            setSelectedIndex({index: null, value: null});
    }, [disableClicks]);

    useEffect(() => {
        const handleResize = () => {
            let clientWidth, clientHeight;
            try {
                clientWidth = ContainerRef.current.clientWidth;
                clientHeight = ContainerRef.current.clientHeight;

                let w = 0.9*((clientWidth/2) / GameSet.matrix_cols);
                let h = 0.9*(clientHeight / GameSet.matrix_rows);

                setCellDim(Math.min(Math.min(w, h), 200));
            }
            catch (e){
            }
        };

        if(ContainerRef){
            window.addEventListener('resize', handleResize);
            setTimeout(() => {
                handleResize();
            }, 20);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [ContainerRef]);

    if (!cellDim) return <></>;

    const cursor = disableClicks ? 'not-allowed' : 'pointer';

    return (
        <div
            className='tog-g_b-m_i unselectable'
            ref={Ref}
            style={{
                gridTemplateColumns: `repeat( ${GameSet.matrix_cols}, auto)`,
                cursor
            }}
        >
            {
                MatrixValues.map(
                    (mat_item, index) => {

                        return (
                            <label
                                onClick={disableClicks? undefined : () => handleClick(index)}
                                className={'unselectable ' }
                                key={'mat_item'+index}
                                style={{
                                    backgroundColor: `rgba(${MatrixElement.color.r}, ${MatrixElement.color.g}, ${MatrixElement.color.b}, ${MatrixElement.color.a})`,
                                    height: cellDim,
                                    width: cellDim,
                                    fontSize: 0.7*cellDim,
                                    cursor,
                                    pointerEvents: disableClicks ? 'none' : '',
                                }}
                            >
                                {
                                    selectedIndex.index === index && selectedIndex.value
                                }
                            </label>
                        )
                    }
                )
            }
        </div>
    )
}

const GameBoard = ({state, ContainerRef, handleClick}) => {
    return (
        <div
            className='tog-g_b'
        >
            <GameHead
                game_order={state.game_order+1}
                trial={state.trial}
                round={state.round}
                showMessage={!state.disableClicks}
                
                
            />

            <div
                className='tog-g_b-m'
                ref={ContainerRef}
            >

                <GameMatrix
                    callback={handleClick}
                    ContainerRef={ContainerRef}
                    MatrixType={GameSet.Sides.Left}
                    MatrixElement={GameSet[GameSet.Sides.Left]}
                    MatrixValues={MatrixValues[GameSet.Sides.Left]}
                    game_play={Number(GameSet.games_play[state.game_order])}
                    disableClicks={state.disableClicks}
                />
                <GameMatrix
                    callback={handleClick}
                    ContainerRef={ContainerRef}
                    MatrixType={GameSet.Sides.Right}
                    MatrixElement={GameSet[GameSet.Sides.Right]}
                    MatrixValues={MatrixValues[GameSet.Sides.Right]}
                    game_play={Number(GameSet.games_play[state.game_order])}
                    disableClicks={state.disableClicks}
                />
            </div>
        </div>
    );
};

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            game_order: 0,
            trial: 0,
            round: 0,
            showMessage: true,
            isLoading: false,
            disableClicks: false,
            mode: 'Game',
            debug_args: {}
        }

        this.round_points = 0;

        // Practice
        // Forward
        // insertGameLine

        // this.sendPartToDb = this.sendPartToDb.bind(this);
        this.ContainerRef = React.createRef();
    }

    // sendPartToDb(){
    //     let sc = this.state;
    //     sc.isLoading = true;
    //     // this.props.insertGameArray(CurrentPart);
    //     this.setState(sc, () => {
    //         this.props.sendGameDataToDB().then(
    //             () => {
    //                 NewLogs({
    //                     user_id: UserId,
    //                     exp: ThisExperiment,
    //                     running_name: RunningName,
    //                     action: 'F.S',
    //                     type: 'LogGameType',
    //                     more_params: {
    //
    //                     },
    //                 }).then((res) => {});
    //
    //                 sc = this.state;
    //                 sc.isLoading = false;
    //                 this.setState(sc);
    //             }
    //         );
    //     });
    // }

    newRound = () => {
        MatrixValues = {
            TryMatrix: (new Array(GameSet.matrix_cols * GameSet.matrix_rows)).fill(null),
            GiveUpMatrix: (new Array(GameSet.matrix_cols * GameSet.matrix_rows)).fill(null)
        };
        let sc = this.state;
        sc.round++;
        sc.mode = 'Game';
        sc.trial = 0;
        this.round_points = 0;
        this.setState(sc);
    }

    newGame = () => {
        let sc = this.state;
        sc.isLoading = true;
        this.setState(sc, () => {
            this.props.sendGameDataToDB().then(
                () => {
                    NewLogs({
                        user_id: UserId,
                        exp: ThisExperiment,
                        running_name: RunningName,
                        action: 'G.S', // game saved
                        type: 'LogGameType',
                        more_params: {
                            game: this.state.game_order,
                            local_t: getTimeDate().time,
                            local_d: getTimeDate().date,
                        },
                    }).then((res) => {});

                    sc.round = 0;
                    sc.game_order++;
                    sc.trial = 0;
                    sc.isLoading = false;
                    this.setState(sc, () => this.newRound());
                }
            );
        })
    }

    componentDidMount() {
        this.props.SetLimitedTime(true);
        this.newRound();
    }

    finishMode = finish_of => {
        let sc = this.state;
        sc.mode = finish_of;
        this.setState(sc);
    }

    handleClick = ({
                       MatrixType, index, value, final_value,
                       random_prob, exploration, selected_val,
                       exploration_cost, punish_reward
    }) => {
        // TryMatrix H PH L
        // GiveUpMatrix MH PMH ML

        let sc = this.state;
        const {game_order} = sc;

        const GiveUpMat = MatrixType === 'GiveUpMatrix';
        let KeyValue;
        if (selected_val === 'H'){
            KeyValue = GiveUpMat? 'MH' : 'H';
        }
        else {
            KeyValue = GiveUpMat? 'ML' : 'L';
        }

        this.round_points += final_value;

        sc.trial++;

        let obj = {
            Order: game_order+1,
            Game: GameSet.games_play[game_order],
            Round: sc.round,
            Trial: sc.trial,
            GiveUp: GiveUpMat ? 1 : 0,
            Explore: exploration? 1 : 0,
            KeyType: selected_val === 'H' ? 1 : 0,
            ExploreL: (!GiveUpMat && exploration && selected_val === 'L') ? 1 : 0,
            ExploitL: (!GiveUpMat && !exploration && selected_val === 'L') ? 1 : 0,
            KeyNumber: index,
            KeyValue: KeyValue,
            Cost: exploration? 1 : 0,
            Feedback: final_value - value,
            PayNoFeedback: value,
            ExplorationCost: exploration_cost,
            PunishReward: punish_reward,
            FinalPay: final_value,
        };

        if (DebugMode)
            sc.debug_args = {
                MatrixType,
                RoundPoints: this.round_points,
                GGG:222,
            ...obj
        };

        this.props.insertGameLine(obj);

        GamePoints[game_order][sc.round-1].push({
            Game: Number(game_order)+1,
            Round: sc.round,
            Trial: sc.trial,
            FinalPay: final_value,
        });

        sc.disableClicks = true;

        this.setState(sc, () => {
            setTimeout(() => {
                sc.disableClicks = false;
                let finish_of = null;
                if (sc.trial === GameSet.trials){
                    RoundsPoints.push({
                        game_order: sc.game_order+1,
                        game: GameSet.games_play[sc.game_order],
                        round: sc.round,
                        points: this.round_points
                    });
                    if (sc.round === GameSet.rounds){
                        if (sc.game_order === (GameSet.games_play.length - 1)){
                            // finish game
                            sc.isLoading = true;
                            return this.setState(sc, () => {

                                this.props.sendGameDataToDB().then(
                                    () => {
                                        NewLogs({
                                            user_id: UserId,
                                            exp: ThisExperiment,
                                            running_name: RunningName,
                                            action: 'G.E', // game end
                                            type: 'LogGameType',
                                            more_params: {
                                                game: this.state.game_order,
                                                local_t: getTimeDate().time,
                                                local_d: getTimeDate().date,
                                            },
                                        }).then((res) => {});

                                        return this.props.Forward();
                                    }
                                );
                            })
                        }
                        else {
                            // finish round
                            // sc.game_order++;
                            finish_of = 'FinishGame';
                        }
                    }
                    else {
                        finish_of = 'FinishRound';
                    }
                }
                this.setState(sc, finish_of ? () => this.finishMode(finish_of) : undefined);

            }, GameSet.display_pay_for * 1000);
        })
    }

    render() {
        if (this.state.isLoading) return <WaitForAction2 />;
        if (!this.state.round) return <></>;

        const {mode} = this.state;

        return (
            <>
                {
                    mode === 'Game' && (
                        <GameBoard
                            state={this.state}
                            ContainerRef={this.ContainerRef}
                            handleClick={this.handleClick}
                            disableClicks={this.disableClicks}
                        />
                    )
                }
                {
                    mode === 'FinishRound' && (
                        <FinishRound
                            round={this.state.round}
                            game={this.state.game_order}
                            Forward={this.newRound}
                        />
                    )
                }
                {
                    mode === 'FinishGame' && (
                        <FinishGame
                            game_order={this.state.game_order + 2}
                            Forward={this.newGame}
                        />
                    )
                }
                {
                    DebugMode && (
                        <DebuggerModalView>
                            <div className='tog_debug'>
                                {
                                    Object.keys(this.state.debug_args).map(
                                        debug_arg => (
                                            <label
                                                key={'l'+debug_arg}
                                            >
                                                {debug_arg}:
                                                <span
                                                    key={'s'+debug_arg}
                                                >{this.state.debug_args[debug_arg]}</span>
                                            </label>
                                        )
                                    )
                                }

                            </div>
                        </DebuggerModalView>
                    )
                }
            </>
        )
    }
}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        PaymentsSettings = props.game_settings.payments;

        // GameSet.rounds = [10, 20, 10];
        GameSet.rounds = Number(props.game_settings.game.r);
        GameSet.trials = Number(props.game_settings.game.t);
        GameSet.exploration_cost = Number(props.game_settings.game.e_c);
        GameSet.punish_reward = Number(props.game_settings.game.f);
        GameSet.display_pay_for = Number(props.game_settings.game.d_p);
        GameSet.background_color = props.game_settings.game.b_c;
        GameSet.matrix_cols = Number(props.game_settings.game.mc);
        GameSet.matrix_rows = Number(props.game_settings.game.mr);

        GameSet.matrix1_color = props.game_settings.game.m1c;
        GameSet.matrix2_color = props.game_settings.game.m2c;

        let try_color = Math.floor(Math.random() * 2) + 1;

        const sides = ['left', 'right'];

        let try_side = Math.floor(Math.random() * 2);

        GameSet.TryMatrix = {
            H: Number(props.game_settings.game.H),
            PH: Number(props.game_settings.game.PH),
            L: Number(props.game_settings.game.L),
            color: GameSet[`matrix${try_color}_color`],
            side: sides[try_side],
        }

        GameSet.GiveUpMatrix = {
            H: Number(props.game_settings.game.MH),
            PH: Number(props.game_settings.game.PMH),
            L: Number(props.game_settings.game.ML),
            color: GameSet[`matrix${try_color === 1 ? 2 : 1}_color`],
            side: sides[try_side === 0 ? 1 : 0],
        }

        GameSet.Sides = {
            Left: try_side === 0 ? 'TryMatrix' : 'GiveUpMatrix',
            Right: try_side === 0 ? 'GiveUpMatrix' : 'TryMatrix',
        }

        GameSet.games_play = props.game_settings.game.g_p;

        for (let i=0; i<GameSet.games_play.length; i++) {
            GamePoints[i] = {};
            for (let j=0; j<GameSet.rounds; j++)
                GamePoints[i][j] = [];
        }

        for (let i=0; i<GameSet.games_play.length; i++){
            if (GameSet.games_play[i] === 'random'){
                const random_from = props.game_settings.game.r_f || ['1', '2', '3', '4', '5', '6'];
                const random_condition = props.game_settings.game.r_c || 'r';

                let rnd_index;
                if (random_condition === 'u_d') {
                    let RunCounter = KeyTableID();
                    rnd_index = RunCounter % random_from.length;
                }
                else
                    rnd_index = Math.floor(Math.random() * random_from.length);

                const rnd_game = random_from[rnd_index];
                GameSet.games_play[i] = rnd_game;
            }
        }

        this.Forward = this.Forward.bind(this);
        this.initializeGame = this.initializeGame.bind(this);

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
        };

        this.game_template = null;
        this.props.SetLimitedTime(false);

        this.initializeGame();
    }

    initNewGame = () => {
        let sc = this.state;
        sc.tasks_index = 0;
        sc.isLoading = false;
        this.setState(sc);
    }

    initializeGame() {
        let game_template = [];

        game_template.push({
            Mode: 'Message',
            Message: GameMsg,
            Props: {
                Forward: this.Forward,
                insertTextInput: this.props.insertTextInput,
                msg_attr: 'welcome',
                Button: 'Start'
            },
        });

        game_template.push({
            Mode: 'Message',
            Message: GameMsg,
            Props: {
                Forward: this.Forward,
                msg_attr: 'instructions',
                Button: 'Start Game 1'
            },
        });

        game_template.push({
            Mode: 'Game',
            Practice: true
        });

        // game_template.push({
        //     // Component: Game,
        //     Part: 'Practice'
        // });
        //
        // game_template.push({
        //     Component: 'AfterPractice'
        // });

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
                cond: GameSet.game_condition,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => this.initNewGame());
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa){
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    Forward(option){
        let sc = this.state;

        if (sc.tasks_index === (this.game_template.length-1)){
            this.props.SetLimitedTime(false);

            this.props.insertTextInput('condition', GameSet.game_condition);
            this.props.insertTextInput('FinalOption', option === 'NewGame');

            let game_points = RoundsPoints.reduce((total, round_) => total + round_.points, 0);


            let selected_trials = [], random_index = '';
            for (let game_key in GamePoints){
                let rnd_index = Math.floor(Math.random() * Object.keys(GamePoints[game_key]).length);

                selected_trials.push(...GamePoints[game_key][rnd_index]);

                random_index += `${Number(game_key)+1}-${rnd_index+1}`;
                if (game_key !== (Object.keys(GamePoints)[Object.keys(GamePoints).length-1]))
                    random_index += ' | ';
            }

            let bonus_points = 0, bonus_info = '';
            let bonus = PaymentsSettings.bonus_endowment;

            for (let i=0; i<selected_trials.length; i++){
                bonus_points += (selected_trials[i].FinalPay);
                bonus_info += `${selected_trials[i].Game}-${selected_trials[i].Round}-${selected_trials[i].Trial}-(${selected_trials[i].FinalPay})`;
                if (i !== (selected_trials.length - 1))
                    bonus_info += ' | ';
            }

            let average_bonus_points = bonus_points/selected_trials.length;

            const p_er = average_bonus_points/PaymentsSettings.exchange_ratio;
            bonus += (p_er>0 ? p_er : 0);
            bonus = Math.floor(bonus*100)/100;

            let total_pay = Math.floor((bonus + PaymentsSettings.show_up_fee)*100)/100;

            const current_time = getTimeDate();

            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {
                    game_points,
                    bonus,
                    total_payment: total_pay,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            this.props.insertPayment({
                game_points,
                sign_of_reward: PaymentsSettings.sign_of_reward,
                show_up_fee: PaymentsSettings.show_up_fee,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                bonus_endowment: PaymentsSettings.bonus_endowment,
                bonus,
                points_ratio: p_er,
                random_index,
                total_bonus_points: bonus_points,
                average_bonus_points,
                bonus_info,
                total_payment: total_pay,
                Time: current_time.time,
                Date: current_time.date
            });

            const debug_args = {};
            if (DebugMode){
                debug_args.game_points = game_points;
                debug_args.bonus = bonus;
                debug_args.total_bonus_points = bonus_points;
                debug_args.bonus_info = bonus_info;
                debug_args.rnd_index = random_index;
                debug_args.points_ratio = p_er;
                debug_args.selected_trials = selected_trials;
            }

            sc.isLoading = true;
            return this.setState(sc, () => {
                 this.props.callbackFunction('FinishGame', {
                    need_summary: option !== 'NewGame',
                    new_game: option === 'NewGame',
                    args: {
                        // show_up_fee: PaymentsSettings.show_up_fee,
                        // sign_of_reward: PaymentsSettings.sign_of_reward,
                        game_points,
                        bonus_points,
                        payment_text: `${PaymentsSettings.sign_of_reward} ${bonus}`,
                        debug_args
                    }
                });
            });
        }
        else {
            if (option === 'Back')
                sc.tasks_index--;
            else
                sc.tasks_index++;
        }
        this.setState(sc);
    }

    render() {
        if (!this.state || this.state.isLoading || !Array.isArray(this.game_template)) {
            return <WaitForAction2/>;
        }

        return (
            <div
                className='TOG_main unselectable'
                style={{
                    backgroundColor: `rgba(${GameSet.background_color.r}, ${GameSet.background_color.g}, ${GameSet.background_color.b}, ${GameSet.background_color.a})`
                }}
            >
                {this.game_template[this.state.tasks_index].Mode === 'Message' && (
                    <Messages
                        Message={this.game_template[this.state.tasks_index].Message}
                        Props={this.game_template[this.state.tasks_index].Props}
                    />
                )}

                {/*<Messages*/}
                {/*    Message={this.game_template[this.state.tasks_index].Message()}*/}
                {/*    Button={this.game_template[this.state.tasks_index].Button}*/}
                {/*    Forward={this.Forward}*/}
                {/*/>*/}

                {this.game_template[this.state.tasks_index].Mode === 'Game' && (
                    <Game
                        Practice={this.game_template[this.state.tasks_index].Practice}
                        Forward={this.Forward}
                        insertGameLine={this.props.insertGameLine}
                        sendGameDataToDB={this.props.sendGameDataToDB}
                        SetLimitedTime={this.props.SetLimitedTime}
                    />
                )}
            </div>
        );
    }
}

export default Start;

const FinishRound = ({Forward, round, game}) => {
    return (
        <div className='tog_finish tog_f-r'>
            <label>
                You just finished round {round} game {game+1}.<br/>
                In the next screen you will play this game again.<br/>
                The payoff structure is the same, but all keys have been reset and rearranged within each set of keys
            </label>
            <button onClick={Forward}>Continue</button>
        </div>
    );
};

const FinishGame = ({Forward, game_order}) => {
    return (
        <div className='tog_finish tog_f-g'>
            <label>
                This <span className='text-bolding'>game</span> is now over<br/>
                (i.e., you have encountered all rounds and trials associated with it). <br/>
                You will now play the next game.<br/>
                Notice that the payoff structure of the next game can be different from the
                previous game, even though they may look similar (a display of two sets of multiple keys).
            </label>
            <button onClick={Forward}>Start game {game_order}</button>
        </div>
    );
};

const welcome = () => (
    <>
        <><span style={{fontSize: 'larger'}}><b>Welcome aboard!</b></span></><br/>
        {/*<b>Please read carefully the following instructions:</b><br/>*/}
        This study consists {GameSet.games_play.length} games,<br/>
        Each game will be played for many rounds which will consist of several trials.
        The current study includes a bonus payment which will depend on your performance in the games.
        After finishing playing the games, the bonus payment will be calculated by randomly choosing a
        single round from each of the three games and taking the average of the payoffs you obtained in those
        randomly selected rounds.<br/>

        The result will be converted into pounds with a conversion ratio of {PaymentsSettings.exchange_ratio} points earned = 1 {PaymentsSettings.sign_of_reward}.
        Accordingly, you should try to maximize your payoffs in every round in every game you
        play to increase your earnings. This bonus will be added to a show-up fee of {PaymentsSettings.show_up_fee}{PaymentsSettings.sign_of_reward}.”
    </>
);

const instructions = () => (
    <>
        On the next screen, you will see two sets of unmarked keys. In each trial, you will be asked to press a key, and your payoff for that trial will be displayed on the key you selected.
        Each round of will consist of 12 trials in which the two sets of keys remain unchanged. You will be informed when a new round begins and the keys change.
        You will play this game for a total of {GameSet.rounds} rounds.<br/>
        There are {GameSet.games_play.length} games.
        Each game has a unique payoff structure and you will be informed when the current game is finished and a new game is about to begin. Remember – your task is to obtain the highest amount of payoffs in every round to increase your earnings.
        Press – Start First Game – to begin.
        {/*{GameSet.games_play.length * GameSet.rounds}*/}
        {/*{GameSet.trials}*/}
    </>
);

const msg_comp = {welcome, instructions};

const GameMsg = ({insertTextInput, Forward, msg_attr, Button}) => {
    const [fontSize, setFontSize] = useState('20');
    const [msgAttr, setMsgAttr] = useState(null);

    let textRef = useRef(null);

    useEffect(() => {
        setMsgAttr(msg_attr);

    }, [msg_attr]);

    useEffect(() => {
        const handleResize = () => {
            let f_s = adjustFont(textRef);
            setFontSize(f_s);
        };

        window.addEventListener('resize', handleResize);

        setTimeout(() => {
            handleResize();
        }, 20);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [textRef, msg_attr]);

    if (!msgAttr) return <></>;

    return (
        <div
            className='msg_win_body tog_wel'
        >
            <p
                ref={textRef}
                style={{
                    fontSize,
                    padding: '1rem'
                }}
            >
                {
                    msg_comp[msgAttr]()
                }
            </p>

            {
                msgAttr === 'welcome' && (
                    <div
                        className='sp-m-com'
                    >
                        <label style={{
                            fontSize,
                        }}><u>Comments:</u></label>
                        <textarea onChange={e => insertTextInput('TextInput', e.target.value)}/>
                    </div>
                )
            }

            <button
                style={{fontSize, margin: '10px auto 0 auto'}}
                onClick={Forward}
            >
                {Button}
            </button>
        </div>
    )
};

const Messages = ({Message, Props}) => {
    return (
        <div
            className='sp-message-mode'
        >
            <Message {...Props}/>
        </div>
        // <div
        //     className='msg_win'
        // >
        //     <div
        //         className='STE_GW'
        //         style={{padding: 0}}
        //     >
        //         <Message {...Props}/>
        //     </div>
        // </div>
    )
}


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

