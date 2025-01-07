import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { NewLogs } from "../../../actions/logger";
import { getTimeDate } from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";
import './gameStyles.css';
import './messages.css';

import { DebuggerModalView } from "../../screens/gameHandle/game_handle";
import MathQuestion from '../../../common/MathQuestion';
import { CURRENT_URL } from "../../../utils/current_url";

const ThisExperiment = 'DotsMindGame';
let UserId = null;
let RunningName = '-';
let DebugMode = null;
let PaymentsSettings = null;
let GameSet = {};
let NumberOfRoundsTotal = 0;
let GamesErrors = [], GamesPayoff = [];

let GAME_ORDER = [];

const CM_TO_PX = 37.7952755906;
// trial is profit side -> more profit side  || Not profit side -> more not profit side

const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    DebugMode = null;
    PaymentsSettings = null;
    GameSet = {};
    GamesErrors = [];
    GamesPayoff = [];
    GAME_ORDER = [];
    NumberOfRoundsTotal = 0;
};

const DItem = ({ item_label, item_data }) => {
    return (
        <label>
            {item_label}:
            <span>{item_data}</span>
        </label>
    )
};

const DItems = ({ items }) => {
    return (
        Object.keys(items).map(
            (item, item_i) => (
                <DItem
                    key={item_i}
                    item_label={item}
                    item_data={items[item]}
                />
            )
        )
    )
}

const DebuggerItem = ({ debugger_props }) => {
    const { current_game, trial_data, game_errors, game_payoff } = debugger_props;

    return (
        <DebuggerModalView>
            <div className='P_G-Debugger'>
                <label>game_errors: <span>{game_errors}</span></label>
                <label>game_payoff: <span>{game_payoff}</span></label>

                <div>
                    <label>Trial data:</label>
                    <div>
                        <DItems items={trial_data} />
                    </div>
                </div>

                <div>
                    <label>Game settings:</label>
                    <div>
                        <DItems items={current_game} />
                    </div>
                </div>
            </div>
        </DebuggerModalView>
    )
}

const PlusPage = ({ Forward }) => {

    useEffect(() => {
        setTimeout(() => {
            Forward();
        }, GameSet.plus_time);
    }, [Forward]);

    return (
        <div className='pg_pp'>
            <label className='center-screen'>
                +
            </label>
        </div>
    )
};

class DrawPoints extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            allPointsCoor: []
        };

        // Sizes in cm
        this.canvas_width = 10;
        this.canvas_height = 10;
    }

    getRandomInt(max_x, max_y) {
        // -20, +10, For padding in top\down\right\left
        let x = Math.floor(Math.random() * (max_x - 20)) + 10;
        let y = Math.floor(Math.random() * (max_y - 20)) + 10;
        return [x, y];
    }

    pointInPartOf(x, y) {
        const d = (y - x) / Math.sqrt(2);
        const d_abs = Math.abs(d);

        if (x === y || d_abs < 9)
            return 'Line';
        else if (x > y)
            return 'Up';
        else if (x < y)
            return 'Down';
    }

    getPoints = (all_points, IN) => {
        let start_right_time = Date.now();
        let color = 'red';

        let break_ = false;

        do {
            let points = this.getRandomInt((this.canvas_width * CM_TO_PX), (this.canvas_height * CM_TO_PX));
            let in_ = this.pointInPartOf(points[0], points[1]);
            let found = false;

            let do_time = Date.now();
            if (do_time - start_right_time < 5000) {
                for (let t = 0; t < all_points.length; t++) {
                    const [x, y] = all_points[t].points;
                    const [new_x, new_y] = points;
                    const d_x = Math.abs(x - new_x);
                    const d_y = Math.abs(y - new_y);

                    if (d_x < 14 && d_y < 13) {
                        found = true;
                        break;
                    }
                }
            }

            if (in_ === IN && !found) {
                break_ = true;
                all_points.push({ points, color });
            }
        }
        while (break_ === false);
    }

    componentDidMount() {
        let all_points = [];

        for (let i = 0; i < Number(this.props.points_right); i++) {
            this.getPoints(all_points, 'Up')
        }

        for (let i = 0; i < Number(this.props.points_left); i++) {
            this.getPoints(all_points, 'Down')
        }

        this.setState({
            allPointsCoor: all_points
        }
            , () => this.props.callback()
        );


    }

    render() {
        console.log("---> 111 render")
        return (
            <svg
                className='pg-points-canvas center-screen'
                style={{
                    width: `${this.canvas_width}cm`,
                    height: `${this.canvas_height}cm`
                }}
            >
                <line
                    x1="0"
                    y1="0"
                    x2={this.canvas_width * CM_TO_PX}
                    y2={this.canvas_height * CM_TO_PX}
                    stroke="black"
                    strokeWidth="3"
                />

                {
                    this.state.allPointsCoor.map(
                        (point, point_i) => (
                            <circle
                                key={point_i}
                                cx={point.points[0]}
                                cy={point.points[1]}
                                r="6"
                                fill={point.color}
                            />
                        )
                    )
                }

                Sorry, your browser does not support inline SVG.
            </svg>
        )
    }
}

const PointsPage = ({ Forward, dots }) => {
    const callback = () => {
        setTimeout(() => {
            Forward();
        }, GameSet.dots_time);
    }

    return (
        <div className='pg_point-p'>
            <DrawPoints
                points_right={dots.right}
                points_left={dots.left}
                callback={callback}
            />
        </div>
    )
};

const getPointLabel = (points, points_word) => {
    let sign = '';
    if (points > 0) sign = '+';
    if (!points_word) return `${sign}${points}`;
    return `${sign}${points} point${points !== 1 ? 's' : ''}`;
};

let begin_time;
const ButtonPage = ({ Forward, onClickBtn, profit_side, not_profit_side }) => {
    const [selectedSide, setSelectedSide] = useState(null);
    const [showSpaceBarLbl, setShowSpaceBarLbl] = useState(false);
    const [containerProps, setContainerProps] = useState({
        head_label: '-----',
        head_show: false,
        backgroundColor: 'white',
        buttons: {
            [GameSet.profit_side]: profit_side,
            [GameSet.not_profit_side]: not_profit_side,
        }
    });

    useEffect(() => {
        begin_time = Date.now();
    }, []);

    useEffect(() => {
        if (!showSpaceBarLbl) return;

        const onKeyDown = e => {
            if (e.keyCode === 32)
                Forward();
        }
        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        }

    }, [showSpaceBarLbl, Forward]);

    const onClickItem = click_side => {
        if (selectedSide !== null) return;
        let { is_busted, inspection, buttons } = onClickBtn(click_side, Date.now() - begin_time);
        if (inspection) {
            setContainerProps({
                head_label: is_busted ? 'Inspection: wrong answer, you were fined' : 'Inspection: right answer, you were not fined',
                head_show: true,
                buttons,
                backgroundColor: is_busted ? GameSet.enforcement_background : GameSet.enforcement_no_busted_background
            })
        }
        setSelectedSide(click_side);

        setTimeout(() => {
            setShowSpaceBarLbl(true);
        }, GameSet.pay_time);
    }

    // const buttons = {
    //     [GameSet.profit_side]: profit_side,
    //     [GameSet.not_profit_side]: not_profit_side,
    // }

    const step1_msg = btn_side => (<>
        More to the<br />
        {btn_side}<br />
        ({getPointLabel(containerProps.buttons[btn_side], true)})
    </>);

    const step2_msg = btn_side => (<>
        {getPointLabel(containerProps.buttons[btn_side], false)}
    </>);

    const classes = { left: '', right: '' };

    if (selectedSide !== null) {
        classes.left = 'side_not_selected';
        classes.right = 'side_not_selected';
        classes[selectedSide] = 'side_selected';
    }

    return (
        <div
            className='pg_bp center-screen'
            style={{
                backgroundColor: containerProps.backgroundColor
            }}
        >
            <label
                className='pg_bp-inspection'
                style={{ visibility: containerProps.head_show ? 'visible' : 'hidden' }}
            >
                {containerProps.head_label}
            </label>
            <div>
                {
                    ['left', 'right'].map(
                        side_ => (
                            <button
                                key={side_}
                                className={classes[side_]}
                                style={{
                                    pointerEvents: selectedSide === null ? 'all' : 'none'
                                }}
                                onClick={() => onClickItem(side_)}
                            >
                                {selectedSide === null ? step1_msg(side_) : step2_msg(side_)}
                            </button>
                        )
                    )
                }
            </div>

            <label
                className='pg_bp-space_bar'
                style={{ visibility: showSpaceBarLbl ? 'visible' : 'hidden' }}
            >
                {showSpaceBarLbl ? 'To continue press on space-bar' : '------'}
            </label>

        </div>
    )
};

const FinishGamePage = ({ Forward }) => {

    return (
        <div className='pg_fbp center-screen msg_container'>
            <label>
                Game finish
            </label>

            <button onClick={Forward}>Next</button>
        </div>
    )
};

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            trial: 0,
            step: 0,
            isLoading: false,
            debugger_props: null
        }

        this.GamePart = this.props.Part;

        this.resetGameData = this.resetGameData.bind(this);

        this.nextStep = this.nextStep.bind(this);
        this.sendPartToDb = this.sendPartToDb.bind(this);
        this.getCurrentDots = this.getCurrentDots.bind(this);
        this.onClickBtn = this.onClickBtn.bind(this);

        this.game_order = 0;
        this.game_data = [];
        this.game_errors = 0;
        this.game_payoff = 0;
        this.current_game = null;
        this.current_game_trials = null;

        this.resetGameData();
    }

    resetGameData() {
        this.game_order++;
        this.game_data = [];
        this.game_errors = 0;
        this.game_payoff = 0;
        // let next_game_index = 0;
        // if (GameSet.random_games_order)
        //     next_game_index = Math.floor(Math.random() * GameSet.games_play.length);
        //
        // const current_game_index = GameSet.games_play[next_game_index];
        // GameSet.games_play = GameSet.games_play.filter((a, i) => i !== next_game_index);
        // const game = GameSet.games_bank.find(g => g.g_i === current_game_index);

        const game = JSON.parse(JSON.stringify(GAME_ORDER[0]));
        GAME_ORDER.shift();
        const game_set = game.g_s;
        const general_set = game_set.g;
        const profitable_set = game_set.pr;
        const trials_set = game_set.t;
        const dots_set = game_set.d;

        this.current_game = {
            game_index: +game.g_i + 1,
            label: general_set.l,
            condition: general_set.c === 'e' ? 'enforce' : 'no_enforce',
            enforce_prob: general_set.e_p,
            fine: general_set.f,
            profit_side: profitable_set.p_s,
            not_profit_side: profitable_set.nps,
            amibgous_profit: trials_set.a_p,
            amibgous_not_profit: trials_set.a_n_p,
            clear_profit: trials_set.c_p,
            clear_not_profit: trials_set.c_n_p,
            dots_amibgous_more: dots_set.a_m,
            dots_amibgous_less: dots_set.a_l,
            dots_clear_more: dots_set.c_m,
            dots_clear_less: dots_set.c_l,
        };

        let games = [
            ...((new Array(trials_set.a_p)).fill('amibgous_profit_side')),
            ...((new Array(trials_set.a_n_p)).fill('amibgous_not_profit_side')),
            ...((new Array(trials_set.c_p)).fill('clear_profit_side')),
            ...((new Array(trials_set.c_n_p)).fill('clear_not_profit_side')),
        ];

        this.current_game_trials = [];

        do {
            const rnd = Math.floor(Math.random() * games.length);
            this.current_game_trials.push(games[rnd]);
            games = games.filter((a, i) => i !== rnd);
        }
        while (games.length);

    }

    getCurrentDots() {
        const current_game_type = this.current_game_trials[this.state.trial];

        let sides = { left: null, right: null };

        let more_dots, less_dots;
        if (current_game_type.includes('amibgous')) {
            more_dots = this.current_game.dots_amibgous_more;
            less_dots = this.current_game.dots_amibgous_less;
        }
        else {
            more_dots = this.current_game.dots_clear_more;
            less_dots = this.current_game.dots_clear_less;
        }

        if (current_game_type.includes('not_profit_side')) {
            sides[GameSet.profit_side] = less_dots;
            sides[GameSet.not_profit_side] = more_dots;
        }
        else {
            sides[GameSet.profit_side] = more_dots;
            sides[GameSet.not_profit_side] = less_dots;
        }
        return sides;
    }

    sendPartToDb() {
        let sc = this.state;
        sc.isLoading = true;
        this.props.insertGameArray([...this.game_data]);
        this.setState(sc, () => {
            this.props.sendGameDataToDB().then(
                () => {
                    const { time, date } = getTimeDate();

                    NewLogs({
                        user_id: UserId,
                        exp: ThisExperiment,
                        running_name: RunningName,
                        action: 'F.G', // Finish Game
                        type: 'LogGameType',
                        more_params: {
                            g: this.game_order,
                            local_t: time,
                            local_d: date,
                        },
                    }).then((res) => { });
                    sc = this.state;
                    sc.isLoading = false;
                    sc.step = 3;
                    this.setState(sc);
                }
            );
        });
    }

    nextStep() {
        let sc = this.state;
        if (sc.step === 3) {
            if (!GameSet.games_play.length) {
                return this.props.Forward();
            }
            sc.step = 0;
            sc.trial = 0;
            this.resetGameData();

        }
        else {
            if (sc.step === 2) {
                if (sc.trial === (this.current_game_trials.length - 1)) {
                    if (this.GamePart === 'Practice') {
                        return this.props.Forward();
                    }
                    GamesErrors.push(this.game_errors);
                    GamesPayoff.push(this.game_payoff)
                    return this.sendPartToDb();
                }
                else {
                    sc.trial++;
                    sc.step = 0;
                }
            }
            else
                sc.step++;
        }
        this.setState(sc);

    }

    onClickBtn(choose_side, choice_time) {
        let not_choose_side = choose_side === 'left' ? 'right' : 'left';

        const points = this.getCurrentDots();
        let correct_answer = points.left > points.right ? 'left' : 'right';
        let is_correct_answer = correct_answer === choose_side;

        if (!is_correct_answer)
            this.game_errors++;

        // enforce
        let random_enforce = 0,
            enforce_prob = this.current_game.enforce_prob,
            inspection = false,
            is_busted = false,
            final_fine = 0;

        if (this.current_game.condition === 'enforce') {
            random_enforce = Math.floor(Math.random() * 1000) / 1000;
            inspection = enforce_prob > random_enforce;
            is_busted = inspection && !is_correct_answer;
            final_fine = is_busted ? this.current_game.fine : 0;
        }

        const buttons = {
            [GameSet.profit_side]: this.current_game.profit_side,
            [GameSet.not_profit_side]: this.current_game.not_profit_side,
        }

        if (inspection) {
            if (is_busted) {
                buttons[choose_side] -= final_fine;
            }
            else {
                buttons[not_choose_side] -= final_fine;
            }
        }


        this.game_payoff += buttons[choose_side];

        const trial_data = {
            game_order: this.game_order,
            game_label: this.current_game.label,
            trial: this.state.trial + 1,
            type: this.current_game_trials[this.state.trial],
            profitable_side: GameSet.profit_side,
            choice: choose_side,
            true_side: correct_answer,
            choice_correct: is_correct_answer ? 1 : 0,
            condition: this.current_game.condition,
            random_enforce,
            enforce_prob,
            inspection: inspection ? 1 : 0,
            is_busted: is_busted.toString(),
            fine: this.current_game.fine,
            final_fine,
            payoff: buttons[choose_side],
            alternative_payoff: buttons[not_choose_side],
            profit_side: this.current_game.profit_side,
            not_profit_side: this.current_game.not_profit_side,
            points_right: points.right,
            points_left: points.left,
            choice_time
        };

        this.game_data.push(trial_data);

        if (DebugMode) {
            let sc = this.state;
            sc.debugger_props = {
                current_game: this.current_game,
                trial_data,
                game_errors: this.game_errors,
                game_payoff: this.game_payoff,
            }
            this.setState(sc);
            return { is_busted, inspection, buttons };
        }
        else
            return { is_busted, inspection, buttons };
    }

    render() {
        console.log("---> 222 render")
        if (this.state.isLoading) return <WaitForAction2 />;

        const { step } = this.state;

        return (
            <>
                {step === 0 && (
                    <PlusPage
                        Forward={this.nextStep} />
                )}
                {step === 1 && (
                    <PointsPage
                        Forward={this.nextStep}
                        dots={this.getCurrentDots()}
                    />
                )}
                {step === 2 && (
                    <ButtonPage
                        profit_side={this.current_game.profit_side}
                        not_profit_side={this.current_game.not_profit_side}
                        Forward={this.nextStep}
                        onClickBtn={this.onClickBtn}
                    />
                )}
                {step === 3 && (
                    <FinishGamePage
                        Forward={this.nextStep}
                    />
                )}

                {
                    this.state.debugger_props && (
                        <DebuggerItem
                            debugger_props={this.state.debugger_props}
                        />
                    )
                }
            </>
        );
    }
}

const convertRgb = rgb_obj => {
    return `rgb(${rgb_obj.r}, ${rgb_obj.g}, ${rgb_obj.b})`;
}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        console.log()
        ResetAll();

        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        PaymentsSettings = props.game_settings.payments;

        // let RunCounter = KeyTableID();
        const game_error = props.game_settings.error;
        GameSet.plus_time = Number(props.game_settings.game.p_t);
        GameSet.dots_time = Number(props.game_settings.game.d_t);
        GameSet.pay_time = Number(props.game_settings.game.pa_t);
        GameSet.points_color = convertRgb(props.game_settings.game.p_c);
        GameSet.enforcement_background = convertRgb(props.game_settings.game.e_c);
        GameSet.enforcement_no_busted_background = convertRgb(props.game_settings.game.enb_c);
        GameSet.games_play = props.game_settings.game.g_p;
        GameSet.games_bank = props.game_settings.game.g_b;
        GameSet.practice = props.game_settings.game.practice;
        GameSet.random_games_order = props.game_settings.game.r_o;
        GameSet.profit_side = ['left', 'right'][Math.floor(Math.random() * 2)];
        GameSet.not_profit_side = GameSet.profit_side === 'left' ? 'right' : 'left';

        this.Forward = this.Forward.bind(this);
        this.initializeGame = this.initializeGame.bind(this);
        this.initGameOrder();

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
            error: game_error,
            mathAnsweredCorrectly: false,
            showError: false,
        };

        this.game_template = null;
        this.props.SetLimitedTime(false);
    }

    initGameOrder() {
        do {
            console.log("====> initGameOrder")
            let next_game_index = 0;
            console.log("====> initGameOrder  GameSet.random_games_order=" + GameSet.random_games_order)
            if (GameSet.random_games_order)
                next_game_index = Math.floor(Math.random() * GameSet.games_play.length);
            const current_game_index = GameSet.games_play[next_game_index];
            console.log("====> initGameOrder current_game_index=" + current_game_index)
            GameSet.games_play = GameSet.games_play.filter((a, i) => i !== next_game_index);
            const game = GameSet.games_bank.find(g => g.g_i === current_game_index);
            console.log("====> initGameOrder game=" + game)
            GAME_ORDER.push(game);
            const { a_p, a_n_p, c_p, c_n_p } = game.g_s.t;
            const total_t = a_p + a_n_p + c_p + c_n_p;
            NumberOfRoundsTotal += total_t;
        }
        while (GameSet.games_play.length);

        if (GameSet.practice) {
            const first_game = JSON.parse(JSON.stringify(GAME_ORDER[0]));

            let practice_game_set = {
                g_i: '-1',
                g_s: {
                    d: first_game.g_s.d,
                    g: {
                        l: 'practice',
                        c: first_game.g_s.g.c,
                        e_p: first_game.g_s.g.e_p,
                        f: first_game.g_s.g.f
                    },
                    pr: first_game.g_s.pr,
                    t: { a_p: 0, a_n_p: 0, c_p: 1, c_n_p: 2 }
                }
            };

            GAME_ORDER = [
                practice_game_set,
                ...GAME_ORDER,
            ];
        }

    }

    componentDidMount() {
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
        }).then((res) => {
            this.initializeGame();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isa !== this.props.isa) {
            let sc = this.state;
            sc.isa = this.props.isa;
            this.setState(sc);
        }
    }

    initializeGame() {
        if (this.state.error) return;

        let game_template = [];

        game_template.push({
            Component: GameMessages,
            Props: {
                insertTextInput: this.props.insertTextInput,
            }
        });

        if (GameSet.practice) {
            game_template.push({
                Component: PracticeGame,
                Props: {
                    page: 'START',
                }
            });
            game_template.push({
                Component: Game,
                Props: {
                    // sendGameDataToDB: this.props.sendGameDataToDB,
                    // insertGameArray: this.props.insertGameArray,
                    Part: 'Practice'
                }

            });
            game_template.push({
                Component: PracticeGame,
                Props: {
                    page: 'END',
                }
            });
        }


        game_template.push({
            Component: Game,
            Props: {
                sendGameDataToDB: this.props.sendGameDataToDB,
                insertGameArray: this.props.insertGameArray,
                Part: 'Real'
            }

        });

        this.game_template = game_template;

        this.setState({
            tasks_index: 0,
            isLoading: false,
        })
    }
    // Method to handle the result from the MathQuestion component
    handleMathQuestionAnswer = (isCorrect) => {
        console.log("-----> in handleMathQuestionAnswer()")
        if (isCorrect) {
            this.setState({ mathAnsweredCorrectly: true, showError: false });
        } else {
            this.setState({ showError: true });
        }
    };
    Forward(option) {
        if (option === 'UserRequestToQuit') {
            return this.props.callbackFunction('UserRequestToQuit');
        }

        let sc = this.state;
        if (sc.tasks_index === (this.game_template.length - 1)) {
            this.props.SetLimitedTime(false);

            let game_points = 0;
            let total_pay = PaymentsSettings.show_up_fee;

            const current_time = getTimeDate();
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {
                    game_points,
                    total_payment: total_pay,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => { });

            this.props.insertTextInput('GamesErrors', GamesErrors.join('|'));
            this.props.insertTextInput('TotalErrors', GamesErrors.reduce((total, num) => total + num, 0));
            this.props.insertTextInput('GamesPayoff', GamesPayoff.join('|'));
            this.props.insertTextInput('TotalPayoff', GamesPayoff.reduce((total, num) => total + num, 0));

            this.props.insertMoreRecords('version_settings', GameSet)
            this.props.insertPayment({
                game_points,
                sign_of_reward: PaymentsSettings.sign_of_reward,
                show_up_fee: PaymentsSettings.show_up_fee,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                bonus_endowment: PaymentsSettings.bonus_endowment,
                total_payment: total_pay,
                Time: current_time.time,
                Date: current_time.date
            });

            sc.isLoading = true;
            this.setState(sc, () => {
                this.props.callbackFunction('FinishGame', { need_summary: option !== 'NewGame', new_game: option === 'NewGame', args: { game_points } });
            });
        }
        else {
            sc.tasks_index++;
        }
        this.setState(sc);
    }

    render() {
        console.log("---> 333 render")
        if (!this.state || this.state.isLoading)
            return <WaitForAction2 />;

        if (this.state.error)
            return (
                <div className='game_error'>Game Error</div>
            )

        const Component = this.game_template[this.state.tasks_index].Component;
        const Props = this.game_template[this.state.tasks_index].Props;

        if (!this.state.mathAnsweredCorrectly) {
            return (
                <div className="trivia-container">
                    <MathQuestion onAnswer={this.handleMathQuestionAnswer} />

                    {/* Display error message if user answers incorrectly */}

                </div>
            );
        }

        return (
            <div
                className='PG_main unselectable'
            >
                <Component
                    Forward={this.Forward}
                    {...Props}
                />
            </div>
        );
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};

export default Start;

const PracticeGame = ({ page, Forward }) => {

    return (
        <div
            className='pg_-gw center-screen msg_container'
        >
            <label>{page === 'START' ? 'Practice game' : 'End practice'}</label>
            <button onClick={Forward} className=''>Next</button>
        </div>
    )
};

class GameMessages extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.Page0 = this.Page0.bind(this);
        this.Page1 = this.Page1.bind(this);
        this.Page2 = this.Page2.bind(this);
        this.Page3 = this.Page3.bind(this);
        this.Page4 = this.Page4.bind(this);
        this.Page5 = this.Page5.bind(this);
        this.Page6 = this.Page6.bind(this);
        this.buttonCallback = this.buttonCallback.bind(this);

        this.fine = false;

        this.pages = [this.Page0, this.Page1, this.Page2, this.Page3, this.Page4, this.Page5, this.Page6];

        this.state = {
            page_index: 0,
            showNext: false,  // Controls visibility of Next button in Page4
            showBack: false,
            feedbackMessage: "", // Stores feedback message for Page4
        };
    }

    Page0 = () => {
        return (
            <div>
                <b>Welcome to the study!</b><br />
                The study includes two independent parts.<br /><br />
                In the first part, you will play the dots game and can win a bonus based<br />
                on your performance. In the second part, you will fill out a food preference survey with no bonus.
                <br /><br />
                Note that you should not leave or stop responding until you have completed the entire study.
            </div>
        );
    };

    Page1 = () => {
        return (
            <div
                className='pg-gw-page2'
            >
                <div
                    className='pg-gw-p2-r1'
                >
                    <img
                        className='pg-gw-p2-img'
                        src={`${CURRENT_URL()}/images/pg/plus.png`}
                        alt='plus'
                    />
                    <div
                        className='pg-gw-p2-txt'
                    >
                        You will soon play the dots game.<br />
                        On each round, a cross will appear at the center of the screen. Please keep your gaze focused on the cross.


                    </div>
                </div>

                <div
                    className='pg-gw-p2-r2'
                >
                    <img
                        style={{ border: 'none' }}
                        alt='dots'
                        className='pg-gw-p2-img'
                        src={`${CURRENT_URL()}/images/pg/dots.png`}
                    />
                    <div
                        className='pg-gw-p2-txt'
                    >
                        Immediately after the cross, a rectangle split into two sections will appear for less than a second. Each section will display a certain number of red dots.

                    </div>
                </div>

                <div
                    className='pg-gw-p2-r3'
                >
                    <img
                        alt='buttons'
                        className='pg-gw-p2-img'
                        src={`${CURRENT_URL()}/images/pg/b1.png`}
                    />
                    <div
                        className='pg-gw-p2-txt'
                    >
                        Once the rectangle disappears, you'll be prompted to identify which of the two sections—left or right—contained more red dots. You can make your selection by clicking the appropriate button (left or right) displayed on the screen.

                    </div>
                </div>

                <div
                    className='pg-gw-p2-r1'
                >
                    <img
                        alt='image1'
                        className='pg-gw-p2-img'
                        src={`${CURRENT_URL()}/images/pg/b2.png`}
                    />
                    <div
                        className='pg-gw-p2-txt'
                    >
                        After making your selection, the number of points you earned for that choice will be displayed on the button you clicked. On the other button, you will see how many points you would have earned if you had chosen it instead. Once this feedback disappears, you will move on to the next screen.

                    </div>
                </div>

                {
                    this.fine && (
                        <div
                            className='pg-gw-p2-r2'
                        >
                            <img
                                alt='image1'
                                className='pg-gw-p2-img'
                                src={undefined}
                            />
                            <div
                                className='pg-gw-p2-txt'
                            >
                                In addition, in some of the rounds, the computer may randomly decide to check whether your answer was correct or not. When this happens, a red screen means that your answer was wrong and you will be fined, while a green screen means your answer was correct and you will not be fined (If the screen does not change color then your answer was not checked, and no fine will be given even if you made a mistake).
                            </div>
                        </div>
                    )
                }

            </div>
        )
    };

    Page2 = () => {
        let points1_msg = '', points2_msg = '';

        return (
            <div>
                <span><h1>Earning points</h1></span>
                Many people find it easier to identify when the {GameSet.profit_side} section of the rectangle contains more dots. Therefore, selecting "There are more dots on the {GameSet.profit_side} section of the rectangle" will earn you {points1_msg}, whereas choosing "There are more dots on the {GameSet.not_profit_side} section of the rectangle" will earn you {points2_msg}.
                These rewards are independent of whether your answer is correct or not. Your task is to be as accurate as possible while also trying to earn points. At the end of the study, the computer will randomly select one round of the dots game. The points you earn in that round will be converted into a bonus payment, with a conversion rate of 10 points = 1 £. To confirm that you’ve read these instructions, type the word NEXT (in all capital letters) in the comment box below. If you type anything else, we will know that you did not fully read the instructions.
                In addition to your potential bonus, you will receive 1 £ for participating in this study.
                <br />
                <br />
                <u>Comments:</u><br />
                <textarea
                    onChange={e => this.props.insertTextInput('TextInput', e.target.value)}
                    style={{
                        border: '1px solid lightgray',  // Light gray thin border
                        padding: '8px',  // Add padding for better appearance
                        width: '50%',   // Optional: make it full width
                        fontSize: '16px', // Optional: improve readability
                        borderRadius: '4px' // Optional: Slightly rounded corners for a soft look
                    }}
                />
            </div>
        );
    };

    Page3 = () => {
        return (
            <div>
                <label>
                    We encourage you to strive for accuracy in your answers. However, due to the challenging nature of this task, your participation will not be rejected even if you make many mistakes. Keep in mind that your bonus payment will be determined by the points you earn in the dots game.
                </label>
            </div>
        );
    };
    Page4 = () => {
        return (
            <div>
                <h2>The month after February is March.</h2>
                
                {/* True and False buttons */}
                <div>
                    <button onClick={() => this.handleAnswer(true)} style={{ marginRight: '10px' }}>True</button>
                    <button onClick={() => this.handleAnswer(false)}>False</button>
                </div>

                {/* Feedback message */}
                <p>{this.state.feedbackMessage}</p>

                {/* Conditional rendering of Next button */}
                {this.state.showNext && (
                    <button className='pg-game-btn' onClick={() => this.buttonCallback('NEXT')}>
                        NEXT
                    </button>
                )}
            </div>
        );
    };

    Page5 = () => {
        return (
            <div>
                <h2>In winter it is cold while in summer it is hot.</h2>
                
                {/* True and False buttons */}
                <div>
                    <button onClick={() => this.handleAnswer(true)} style={{ marginRight: '10px' }}>True</button>
                    <button onClick={() => this.handleAnswer(false)}>False</button>
                </div>

                {/* Feedback message */}
                <p>{this.state.feedbackMessage}</p>

                {/* Conditional rendering of Next button */}
                {this.state.showNext && (
                    <button className='pg-game-btn' onClick={() => this.buttonCallback('NEXT')}>
                        NEXT
                    </button>
                )}
            </div>
        );
    };
    Page6 = () => {
        return (
            <div>
                <h2>7 is bigger than 9.</h2>
                
                {/* True and False buttons */}
                <div>
                    <button onClick={() => this.handleAnswer(false)} style={{ marginRight: '10px' }}>True</button>
                    <button onClick={() => this.handleAnswer(true)}>False</button>
                </div>

                {/* Feedback message */}
                <p>{this.state.feedbackMessage}</p>

                {/* Conditional rendering of Next button */}
                {this.state.showNext && (
                    <button className='pg-game-btn' onClick={() => this.buttonCallback('NEXT')}>
                        Start Game
                    </button>
                )}
            </div>
        );
    };

    handleAnswer = (isCorrect) => {
        if (isCorrect) {
            this.setState({ feedbackMessage: "You are right", showNext: true });
        } else {
            this.setState({ feedbackMessage: "You are wrong", showNext: false });
        }
    };

    buttonCallback(option) {
        let sc = { ...this.state };
        if (option === 'NEXT') {
            sc.page_index++;
            sc.showNext = false;  // Reset for next navigation
            sc.feedbackMessage = ""; // Reset feedback message
            if (sc.page_index === this.pages.length)
                return this.props.Forward();
        } else {
            if (sc.page_index > 0)
                sc.page_index--;
        }
        this.setState(sc);
    }

    render() {
        console.log("---> this.state.page_index="+this.state.page_index+"  this.pages.length="+this.pages.length)
        return (
            <div className='pg-game-intro'>
                <div className="pg-gi-message-box">
                    {this.pages[this.state.page_index]()}
                </div>

                {/* Navigation buttons */}
                <div className="pg-gi-btn">
                    {(this.state.page_index > 1 && this.state.page_index<4) && (
                        <button
                            className='pg-game-btn'
                            style={{ marginRight: 10, marginLeft: 10 }}
                            onClick={() => this.buttonCallback('BACK')}
                        >
                            Go Back
                        </button>
                    )}
                    
                    {/* Hide Next button in Page4 until correct answer is clicked */}
                    {this.state.page_index !== 4 &&  this.state.page_index !== 5 &&  this.state.page_index !== 6 && (
                        <button
                            className='pg-game-btn'
                            onClick={() => this.buttonCallback('NEXT')}
                        >
                            {this.state.page_index === this.pages.length - 1 ? 'Start Game' : 'NEXT2'}
                        </button>
                    )}
                </div>
            </div>
        );
    }
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
