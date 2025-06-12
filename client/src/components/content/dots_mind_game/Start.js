import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { NewLogs } from "../../../actions/logger";
import { getTimeDate } from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";
import './gameStyles.css';
import './messages.css';

import { DebuggerModalView, KeyTableID } from "../../screens/gameHandle/game_handle";
import MathQuestion from '../../../common/MathQuestion';
import { CURRENT_URL } from "../../../utils/current_url";
import FoodPreference from './FoodPreference';
import { formatPrice } from '../../utils/StringUtils';

const ThisExperiment = 'DotsMindGame';
let UserId = null;
let RunningName = '-';
let DebugMode = null;
let PaymentsSettings = null;
let GameSet = {};
let NumberOfRoundsTotal = 0;
let GamesErrors = [], GamesPayoff = [];
let GameCondition = null;
let GameType = null;
let randNum = -1;
let all_game_data = [];

let GAME_ORDER = [];
let isPractice = true;
let totalBonus = [];


const CM_TO_PX = 37.7952755906;
// trial is profit side -> more profit side  || Not profit side -> more not profit side

const completedDotsMindGame = (
    <span style={{
        fontSize: "36px",
        padding: "20px",
        display: "block",
        width: "80%", // Adjust width if needed
        margin: "20px auto", // Centers the span
        marginTop: "300px",
        textAlign: "left" // Centers the text
    }}>
        <label style={{ textAlign: 'center', marginLeft: 400 }}><b>You completed the dots game</b></label>
        <br />
        You will now be asked to complete a food preference survey. You cannot leave or stop responding until you have completed the entire study and have received your completion code, or else you will not receive compensation.
        <br />
    </span>
);

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

    const step1_msg = btn_side => (<>
        The {btn_side} section<br />
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
            {/* Existing header */}
            <label
                className='pg_bp-inspection'
                style={{ visibility: containerProps.head_show ? 'visible' : 'hidden' }}
            >
                {containerProps.head_label}
            </label>

            {/* Main question label */}

            {isPractice && (
                <div style={{ textAlign: "center", fontSize: "36px", color: "red", fontWeight: "bold", marginBottom: "10px" }}>
                    <label>This is a practice round</label>
                </div>
            )}
            <div style={{ textAlign: "center", fontSize: "36px" }}>
                <label>Which section contained more red dots?</label>
            </div>


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
             <div style={{ textAlign: "center", fontSize: "36px" }}>
                <label>
                    Remember: this game was programmed such that there is a 33% chance 
                    <br></br>that a rectangle will have more dots in the {GameSet.profit_side} section.

                </label>
            </div>
            {/* Space bar instruction */}
            <label
                className='pg_bp-space_bar'
                style={{
                    animation: 'none',
                    visibility: showSpaceBarLbl ? 'visible' : 'hidden'
                }}
            >
                To continue press the space bar
            </label>
        </div>
    );

};

const FinishGamePage = ({ Forward }) => {

    return (
        <div className='pg-game-intro'>
            <b>You completed the dots game</b><br />
            You will now be asked to complete a food preference survey.
            You cannot leave or stop responding until you have completed the entire study and have received your completion code, or else you will not receive compensation.
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
        this.insertGameLine = this.insertGameLine.bind(this)
        this.sendGameDataToDB = this.sendGameDataToDB.bind(this)

        this.game_order = 0;
        this.game_errors = 0;
        this.game_payoff = 0;
        this.current_game = null;
        this.current_game_trials = null;

        this.resetGameData();
    }
    insertGameLine = (db_row) => {
        this.props.insertGameLine(db_row);
    }

    sendGameDataToDB = (db_row) => {
        this.props.sendGameDataToDB(db_row);
    }


    calculateProbability = (game_set) => {
        const total = game_set.t.c_p + game_set.t.c_n_p;
        let prob = game_set.t.c_p / total;
        console.log("---> prob= " + prob)
        return prob; // Probability of selecting clear_profit
    };

    resetGameData() {
        this.game_order++;
        this.game_data = [];
        this.game_errors = 0;
        this.game_payoff = 0;

        const game = JSON.parse(JSON.stringify(GAME_ORDER[0]));
        GAME_ORDER.shift();
        const game_set = game.g_s;
        const general_set = game_set.g;
        const profitable_set = game_set.pr;
        randNum = Math.random();
        const clear_profit = randNum < this.calculateProbability(game_set) ? true : false;
        console.log("------> randNum=" + randNum + "  clear_profit=" + clear_profit + "  GameCondition=" + GameCondition)
        const one_shot_set = clear_profit ? { a_p: 0, a_n_p: 0, c_p: 1, c_n_p: 0 } : { a_p: 0, a_n_p: 0, c_p: 0, c_n_p: 1 }
        const practice_set = { a_p: 0, a_n_p: 0, c_p: game_set.t.p_p, c_n_p: game_set.t.p_n_p }
        let trials_set = null;
        if (this.GamePart == "Real") {
            trials_set = (GameCondition == "OneShot") ? one_shot_set : game_set.t;
        } else {
            trials_set = practice_set;
        }
        console.log("==========>  trials_set = ", trials_set)
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
            dots_practice_more: dots_set.p_m,
            dots_practice_less: dots_set.p_l
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
        if (this.GamePart == "Practice") {
            more_dots = this.current_game.dots_practice_more;
            less_dots = this.current_game.dots_practice_less;
        } else {
            if (current_game_type.includes('amibgous')) {
                more_dots = this.current_game.dots_amibgous_more;
                less_dots = this.current_game.dots_amibgous_less;
            }
            else {
                more_dots = this.current_game.dots_clear_more;
                less_dots = this.current_game.dots_clear_less;
            }
        }


        if (current_game_type.includes('not_profit_side')) {
            sides[GameSet.profit_side] = less_dots;
            sides[GameSet.not_profit_side] = more_dots;
        }
        else {
            sides[GameSet.profit_side] = more_dots;
            sides[GameSet.not_profit_side] = less_dots;
        }
        console.log("----> sides=", sides)
        return sides;
    }

    sendPartToDb() {
        let sc = this.state;
        sc.isLoading = true;
        this.props.insertGameArray([...all_game_data]);
        console.log("====>  all_game_data = ", all_game_data)
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
        if (sc.step === 4) {
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
                        this.props.insertGameArray([...this.game_data]);;
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
        // console.log("++++++++ points = ",points)
        let correct_answer = points.left > points.right ? 'left' : 'right';
        let is_correct_answer = correct_answer === choose_side;



        if (this.GamePart === "Real") {
            console.log("---->   choose_side = " + choose_side + "  GameSet.profit_side = " + GameSet.profit_side)
            /* 
            If the choosen side matches the profit side,
             add 10 to the total bonus for this trial ==> this trail is candidate for the bonus; otherwise, 
             add 0 
             */
            choose_side == GameSet.profit_side ? totalBonus.push(10) : totalBonus.push(0)
            console.log("----> totalBonus = ", totalBonus)

        }
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
            randNum: GameCondition == "Repeated" ? "N/A" : randNum,
            GameCondition,
            choice_time,
        };
        console.log("*********** trial_data = ", trial_data)
        this.game_data.push(trial_data);
        all_game_data.push(trial_data);

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
        if (this.state.isLoading) return <WaitForAction2 />;

        const { step } = this.state;
        return (
            <>

                {step === 0 && (
                    <PlusPage Forward={this.nextStep} />
                )}
                {step === 1 && (
                    <PointsPage Forward={this.nextStep} dots={this.getCurrentDots()} />
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
                    (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <p style={{ marginBottom: "20px" }}>
                                {completedDotsMindGame}
                            </p>
                            <button className='pg-game-btn' onClick={this.nextStep}>Next</button>
                        </div>
                    )
                )}
                {step === 4 && (
                    <FoodPreference
                        GameCondition={GameCondition}
                        insertGameLine={this.insertGameLine}
                        sendGameDataToDB={this.sendGameDataToDB}
                        Forward={this.nextStep}
                    />
                )}
                {step === 5 && (
                    <FinishGamePage Forward={this.nextStep} />
                )}

                {this.state.debugger_props && (
                    <DebuggerItem debugger_props={this.state.debugger_props} />
                )}
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
        let RunCounter = KeyTableID();
        console.log()
        ResetAll();
        let cond = props.game_settings.game.cond;
        if (cond === 'o') {
            GameCondition = 'OneShot';
        } else if (cond === 'r') {
            GameCondition = 'Repeated';
        } else if (cond === 'rand') {
            // Randomly decide between OneShot and Repeated
            let rnd = Math.floor(Math.random() * 2);
            GameCondition = rnd ? 'OneShot' : 'Repeated';
        } else if (cond === 'u_d') {
            // Use uniform distribution for deciding condition
            GameCondition = RunCounter % 2 ? 'OneShot' : 'Repeated';
        }
        console.log("---> GameCondition=" + GameCondition)

        GameType = props.game_settings.general.game_type;

        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        PaymentsSettings = props.game_settings.payments;

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
            let next_game_index = 0;
            if (GameSet.random_games_order)
                next_game_index = Math.floor(Math.random() * GameSet.games_play.length);
            const current_game_index = GameSet.games_play[next_game_index];
            GameSet.games_play = GameSet.games_play.filter((a, i) => i !== next_game_index);
            const game = GameSet.games_bank.find(g => g.g_i === current_game_index);
            GAME_ORDER.push(game);
            const { a_p, a_n_p, c_p, c_n_p } = game.g_s.t;
            const total_t = a_p + a_n_p + c_p + c_n_p;
            NumberOfRoundsTotal += total_t;
        }
        while (GameSet.games_play.length);

        if (GameSet.practice) {
            const first_game = JSON.parse(JSON.stringify(GAME_ORDER[0]));
            const practice_clear_profit = 1, practice_clear_not_profit = 2;
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
                    t: { a_p: 0, a_n_p: 0, c_p: practice_clear_profit, c_n_p: practice_clear_not_profit, p_p: first_game.g_s.t.p_p, p_n_p: first_game.g_s.t.p_n_p }
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

        // Add initial game messages
        game_template.push({
            Component: GameMessages,
            Props: {
                insertTextInput: this.props.insertTextInput,
            }
        });

        if (GameSet.practice) {
            // Start Practice Game
            game_template.push({
                Component: PracticeGame,
                Props: {
                    page: 'START',
                }
            });

            // Add Practice Game session
            game_template.push({
                Component: Game,
                Props: {
                    sendGameDataToDB: this.props.sendGameDataToDB,
                    insertGameArray: this.props.insertGameArray,
                    Part: 'Practice',
                    insertGameLine: this.props.insertGameLine,
                    sendDataToDB: this.props.sendGameDataToDB
                }
            });

            // End Practice Game
            game_template.push({
                Component: PracticeGame,
                Props: {
                    page: 'END',
                }
            });

            // Add the question component (decision point)
            game_template.push({
                Component: UserQuestion,
                Props: {
                    onAnswerCorrect: () => this.proceedToRealGame(),
                    onAnswerIncorrect: () => this.returnToPracticeEnd(),
                }
            });
        }

        this.game_template = game_template;

        this.setState({
            tasks_index: 0,
            isLoading: false,
        });
    }

    // Function to proceed to the real game if the answer is correct
    proceedToRealGame() {
        this.game_template.push({
            Component: Game,
            Props: {
                sendGameDataToDB: this.props.sendGameDataToDB,
                insertGameArray: this.props.insertGameArray,
                insertGameLine: this.props.insertGameLine,
                sendDataToDB: this.props.sendGameDataToDB,
                Part: 'Real'
            }
        });

        this.setState({
            tasks_index: this.state.tasks_index + 1, // Move to next step
        });
    }

    // Function to go back to practice end screen if answer is incorrect
    returnToPracticeEnd() {
        this.setState({
            tasks_index: this.state.tasks_index - 1, // Go back to the last PracticeGame
        });
    }

    insertGameLine = (db_row) => {
        this.props.insertGameLine(db_row);
    }

    // Method to handle the result from the MathQuestion component
    handleMathQuestionAnswer = (isCorrect) => {
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
        this.PaymentsSettings = PaymentsSettings;
        let sc = this.state;
        const current_time = getTimeDate();
        var reward_sum = 0;
        let debug_args = {
            reward_sum,
        }

        if (sc.tasks_index === (this.game_template.length - 1)) {


            var result = this.addGameBonus();
            console.log("---> result= ", result)
            var total_bonus = result.randomSelectedRoundValue / this.PaymentsSettings.exchange_ratio;
            totalBonus = formatPrice(total_bonus, this.PaymentsSettings.sign_of_reward)
            var randomSelectedRound = result.randomSelectedRound;
            console.log("---> in sendDataToDB total_bonus=" + total_bonus);

            this.PaymentsSettings.total_bonus = total_bonus;
            this.PaymentsSettings.randomSelectedRound = randomSelectedRound;


            this.props.insertPayment({
                exchange_ratio: this.PaymentsSettings.exchange_ratio,
                bonus_endowment: this.PaymentsSettings.bonus_endowment,
                show_up_fee: this.PaymentsSettings.show_up_fee,
                sign_of_reward: this.PaymentsSettings.sign_of_reward,
                random_round_Index: this.PaymentsSettings.randomSelectedRound,
                bonus_payment: this.PaymentsSettings.total_bonus,
                Time: current_time.time,
                Date: current_time.date
            });

            debug_args.reward_sum = total_bonus;


            this.setState(sc, () => {
                this.props.callbackFunction('FinishGame', { need_summary: option !== 'NewGame', new_game: option === 'NewGame', args: debug_args });
            });
        }
        else {
            sc.tasks_index++;
        }
        this.setState(sc);
    }
    addGameBonus = () => {
        const randomIndex = GameCondition === "OneShot" ? 0 : Math.floor(Math.random() * totalBonus.length);
        const randomSelectedRoundValue = totalBonus[randomIndex]
        const TotalBonus = [];
        TotalBonus.push(randomSelectedRoundValue);
        return {
            randomSelectedRoundValue: randomSelectedRoundValue,
            randomSelectedRound: randomIndex
        };
    };

    render() {
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

                    {/* Display Error message if user answers incorrectly */}

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



const UserQuestion = ({ onAnswerCorrect, onAnswerIncorrect }) => {
    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");

    // Handle Back button click immediately
    const handleBack = () => {
        setMessage("Incorrect! Please read the instructions in the previous screen");
        onAnswerIncorrect();
    };

    // Handle Next button click immediately
    const handleNext = () => {
        setMessage("Correct! You will now play one round of the dots game.");
        onAnswerCorrect();
    };

    // Handle text input change with number validation
    const handleInputChange = (e) => {
        const value = e.target.value.trim();
        setAnswer(value);

        // Check if the input is a valid number
        if (value === "" || !/^\d+$/.test(value)) {
            setMessage("Type in numbers only");
            return;
        }
        if (GameCondition == "Repeated") {
            // Check if the answer is correct or not
            if (value === "42") {
                setMessage("Correct! You will now play 42 rounds of the dots game.\nOne randomly selected round will determine your bonus.");
            } else {
                setMessage("Incorrect! Please read the instructions in the previous screen");
            }
        }
        else {
            if (value === "1") {
                setMessage("Correct! You will now play one round of the dots game.\nThis round will determine your bonus");
            } else {
                setMessage("Incorrect! Please read the instructions in the previous screen");
            }
        }

    };

    return (
        <div className='pg_-gw center-screen msg_container'>
            <p>How many rounds are you going to play now, for real money?</p>

            <input
                type="text"
                value={answer}
                onChange={handleInputChange}
                placeholder="Enter a number"
            />

            <div>
                <button
                    onClick={handleBack}
                    disabled={GameCondition == "Repeated" ? (answer == "40") : (answer == "1")}
                    style={{ marginRight: '10px' }}
                >
                    Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={GameCondition == "Repeated" ? (answer !== "42") : (answer !== "1")}
                >
                    Next
                </button>
            </div>

            {message && (
                <p>
                    {message.split('\n').map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>
            )}
        </div>
    );
};






const PracticeGame = ({ page, Forward }) => {
    isPractice = page === 'START' ? true : false
    let num_of_real_rounds = GAME_ORDER[0].g_s.t.c_p + GAME_ORDER[0].g_s.t.c_n_p;
    return (
        <div
            className='pg_-gw center-screen msg_container'
        >
            <label
                dangerouslySetInnerHTML={{
                    __html: page === 'START'
                        ? 'Start practice'
                        : `Practice is over.<br/>
               You will now play ${GameCondition === "OneShot" ? "<b>one round</b>" : `<b>42 rounds</b>`} 
               of the dots game for real bonus.<br/>
               <u>Remember: ${GameCondition === "OneShot" ? "Your bonus depends on the points you earn in this round" : "Your bonus will depend on the points you earn in one round, which will be randomly selected by the computer"}. 
               </u>`
                }}
            ></label>
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
        this.Page7 = this.Page7.bind(this);
        this.buttonCallback = this.buttonCallback.bind(this);

        this.fine = false;

        this.pages = [this.Page0, this.Page1, this.Page2, this.Page3, this.Page4, this.Page5, this.Page6, this.Page7];

        this.state = {
            page_index: 0,
            showNext: false,
            showBack: false,
            feedbackMessage: "",
        };
    }

    Page0 = () => {
        const isRepeated = GameCondition === "Repeated";
        let oneShotNumOfRounds = "one round";
        let repeatedNumOfRounds = "42 rounds";

        return (
            <div>
                <b>Welcome to the study!</b><br />
                The study includes two independent parts.<br /><br />
                In the first part, you will practice and then play {isRepeated ? repeatedNumOfRounds : oneShotNumOfRounds} of the dots game and can win a bonus <br />
                based on your performance. In the second part, you will fill out a food preference survey with no bonus.
                <br /><br />
                Note that you should not leave or stop responding until you have completed the entire study and have received your completion code. If you leave or stop responding before completing the two parts, you will not receive compensation.
            </div>
        );
    };

    Page1 = () => {
        return (
            <div>
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
        let profit_side_score = GAME_ORDER[0].g_s.pr.p_s;
        let none_profit_side_score = GAME_ORDER[0].g_s.pr.nps;
        const isRepeated = GameCondition == "Repeated";

        // Define the instructional text based on GameCondition
        let instructionText = isRepeated ? (
            <span>
                Many people find it easier to identify when the {GameSet.profit_side} section of the rectangle contains more dots. Therefore, selecting "There are more dots on the {GameSet.profit_side} section of the rectangle" will earn you {profit_side_score} points, whereas choosing "There are more dots on the {GameSet.not_profit_side} section of the rectangle" will earn you {none_profit_side_score} points.
                <br></br>
                <br></br>
                These rewards are independent of whether your answer is correct or not. 
                <br></br>
                Note that this game was programmed such that there is a 33% chance that a rectangle will have more dots in the {GameSet.profit_side} section.
                <br></br>
                Your task is to be as accurate as possible while also trying to earn points. At the end of the study, the computer will randomly select one round of the dots game. The points you earn in that round will be converted into a bonus payment, with a conversion rate of 10 points = 1 {PaymentsSettings.sign_of_reward}. To confirm that you’ve read these instructions, type the word NEXT (in all capital letters) in the comment box below. If you type anything else, we will know that you did not fully read the instructions.
                <br></br>
                <br></br>
                In addition to your potential bonus, you will receive 1 {PaymentsSettings.sign_of_reward} for participating in this study.

            </span>
        ) : (
            <span>
                Many people find it easier to identify when the {GameSet.profit_side} section of the rectangle contains more dots. Therefore, selecting "There are more dots on the {GameSet.profit_side} section of the rectangle" will earn you {profit_side_score} points, whereas choosing "There are more dots on the {GameSet.not_profit_side} section of the rectangle" will earn you {none_profit_side_score} points.
                <br></br>
                <br></br>
                These rewards are independent of whether your answer is correct or not.
                <br></br> 
                Note that this game was programmed such that there is a 33% chance that a rectangle will have more dots in the {GameSet.profit_side} section.
                <br></br>
                Your task is to be as accurate as possible while also trying to earn points. The points you earn will be converted into a bonus payment at the end of the experiment, with a conversion rate of 10 points = 1 {PaymentsSettings.sign_of_reward}. To confirm that you’ve read these instructions, type the word NEXT (in all capital letters) in the comment box below. If you type anything else, we will know that you did not fully read the instructions.
                <br></br>
                <br></br>
                In addition to your potential bonus, you will receive 1 {PaymentsSettings.sign_of_reward} for participating in this study.

                <br></br>
                <br></br>
            </span>
        );

        return (
            <div>
                <span><h1>Earning points</h1></span>
                <span>{instructionText}</span>
                <br></br>
                <br></br>
                <u>Comments:</u><br />
                <br></br>
                <textarea
                    onChange={e => this.props.insertTextInput('TextInput', e.target.value)}
                    style={{
                        border: '1px solid lightgray',
                        padding: '8px',
                        width: '50%',
                        fontSize: '16px',
                        borderRadius: '4px'
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
                <h2>To ensure you understood the instructions, please answer the following questions:</h2>
                <br />
                <br />
                <h2><b>There is a 33% chance that a rectangle will have more dots in the {GameSet.profit_side} section
                </b></h2>
                <br />

                {/* True and False buttons */}
                <div>
                    <button
                        onClick={() => this.handleAnswer(true, "Correct!")}
                        className="true-false-button"
                    >
                        True
                    </button>
                    <button
                        onClick={() => this.handleAnswer(false, "Wrong! There is a 33% chance that a rectangle will have more dots in the " + GameSet.profit_side + " section")}
                        className="true-false-button"
                    >
                        False
                    </button>
                </div>

                {/* Feedback message */}
                <br />
                <p
                    style={{
                        color: this.state.feedbackMessage.startsWith("Wrong") ? "red" :
                            this.state.feedbackMessage.startsWith("Correct") ? "green" : "black"
                    }}
                >
                    {this.state.feedbackMessage}
                </p>

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
                <h2><b>Incorrect answers in the dots game can lead to rejection of your submission.</b></h2>
                <br />

                {/* True and False buttons */}
                <div>
                    <button
                        onClick={() => this.handleAnswer(true, "Wrong! Your submission will be rejected only if you do not complete the study. Incorrect answers in the dots game do not affect the status of your submission and will not lead to rejection.")}
                        className="true-false-button"
                    >
                        True
                    </button>
                    <button
                        onClick={() => this.handleAnswer(false, "Correct! Your submission will be rejected only if you do not complete the study. Incorrect answers in the dots game do not affect the status of your submission and will not lead to rejection.")}
                        className="true-false-button"
                    >
                        False
                    </button>
                </div>

                {/* Feedback message */}
                <br />
                <p
                    style={{
                        color: this.state.feedbackMessage.startsWith("Wrong") ? "red" :
                            this.state.feedbackMessage.startsWith("Correct") ? "green" : "black"
                    }}
                >
                    {this.state.feedbackMessage}
                </p>

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
        let page6Message = GameCondition == "OneShot" ? "If you earn 10 points in the game, you will receive a 1£ bonus." : "If the computer randomly selects a round where you earned 10 points, you will receive a 1£ bonus.";

        return (
            <div>
                <h2><b>{page6Message}</b></h2>
                <br />

                {/* True and False buttons */}
                <div>
                    <button
                        onClick={() => this.handleAnswer(true, "Correct! The conversion rate is 10 points=1£, so if you earn 10 points, you will receive a 1£ bonus.")}
                        className="true-false-button"
                    >
                        True
                    </button>
                    <button
                        onClick={() => this.handleAnswer(false, "Wrong! Recall that the conversion rate is 10 points=1£. Thus if you earn 10 points, you will receive a 1£ bonus.")}
                        className="true-false-button"
                    >
                        False
                    </button>
                </div>

                {/* Feedback message */}
                <br />
                <p
                    style={{
                        color: this.state.feedbackMessage.startsWith("Wrong") ? "red" :
                            this.state.feedbackMessage.startsWith("Correct") ? "green" : "black"
                    }}
                >
                    {this.state.feedbackMessage}
                </p>

                {/* Conditional rendering of Next button */}
                {this.state.showNext && (
                    <button className='pg-game-btn' onClick={() => this.buttonCallback('NEXT')}>
                        Start Game
                    </button>
                )}
            </div>
        );
    };
    Page7 = () => {
        let num_of_practice_rounds = GAME_ORDER[0].g_s.t.p_p + GAME_ORDER[0].g_s.t.p_n_p;
        return (
            <div>
                Let’s try it out!<br />
                You will now go through {num_of_practice_rounds} practice rounds of the dots game.The goal of the practice rounds is to help you understand the game.You will not earn any bonus in these rounds, and your answers will not be recorded.You will be notified when the practice is over and the real game begins.
            </div>
        );
    };

    handleAnswer = (isCorrect, feedback) => {
        if (isCorrect) {
            this.setState({ feedbackMessage: feedback, showNext: true });
        } else {
            this.setState({ feedbackMessage: feedback, showNext: true });
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
        return (
            <div className='pg-game-intro'>
                <div className="pg-gi-message-box">
                    {this.pages[this.state.page_index]()}
                </div>

                {/* Navigation buttons */}
                <div className="pg-gi-btn">
                    {(this.state.page_index > 1 && this.state.page_index < 4) && (
                        <button
                            className='pg-game-btn'
                            style={{ marginRight: 10, marginLeft: 10 }}
                            onClick={() => this.buttonCallback('BACK')}
                        >
                            Go Back
                        </button>
                    )}


                    {this.state.page_index !== 4 && this.state.page_index !== 5 && this.state.page_index !== 6 && (
                        <button
                            className='pg-game-btn'
                            onClick={() => this.buttonCallback('NEXT')}
                        >
                            {this.state.page_index === this.pages.length ? 'Start Game' : 'NEXT'}
                        </button>
                    )}
                </div>
            </div>
        );
    }
}


