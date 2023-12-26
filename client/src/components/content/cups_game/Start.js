import React, {useEffect, useRef, useState} from 'react';
import './gameStyles.css';
import PropTypes from "prop-types";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";
import CupImage from './single_coffee_cup.png';
import CUPS_IMG from './cups_game.png';

import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";
import ReactDOM from "react-dom";

const ThisExperiment = 'CupsGame';

let UserId = 'empty';
let RunningName = '-';
let StartTime = null;
let GAME_POINTS = 0;
let SUM_OF_CUPS = 0;
let DebugMode = null;
let GameSet = {};
let PaymentsSettings = null;
let GameCondition = null;


function useOnScreen(ref) {

    const [isIntersecting, setIntersecting] = useState(false)

    const observer = new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
    )

    useEffect(() => {
        observer.observe(ref.current)
        // Remove the observer as soon as the component is unmounted
        return () => { observer.disconnect() }
    });

    return isIntersecting
}

let last_choice = 0;
// const cupsSelected = [false, true, true, false, false, true, false, false, true, false];
// const good = [1, 2, 5, 8], no_good = [0, 3, 4, 5, 6, 9];

const points_msg = (points_number, abs) => ((abs?Math.abs(points_number) : points_number)+' point' + (points_number===1?'':'s'));

const GameWelcome = ({Forward}) => {
    // const [ballIndex, setBallIndex] = useState(null);
    // const [gainMsg, setGainMsg] = useState(null);

    const ref = useRef()
    const isVisible = useOnScreen(ref)

    useEffect(() => {
        if (!isVisible) return;

        // let arr_select;
        if (last_choice === 0){
            last_choice = 1;
            // arr_select = good;
        }
        else {
            last_choice = 0;
            // arr_select = no_good;
        }

        // const rnd_index = Math.floor(Math.random() * arr_select.length);

        // setBallIndex(arr_select[rnd_index]);

    }, [isVisible]);

    // const callback = (option) => {
    //     if (option === 'BallFinish'){
    //         if (good.indexOf(ballIndex) > -1)
    //             setGainMsg(GameSet.reward -4*4);
    //         else
    //             setGainMsg(-4*4);
    //          setTimeout(() => {
    //              setGainMsg(null);
    //          }, 2500);
    //     }
    // }

    return (
        <div
            ref={ref}
            className='cg_welcome'
        >
            <label>Welcome to the Cups Game!</label>
			<div className='cg_welcome_container'>
                <div className='cg_welcome_int'>
                    <label>Please read carefully the following instructions:</label>
                    <label>The cups game consists of 100 trials. In each trial a ball will fall randomly in one of 10 locations.</label>
                    <label>The fall, and your decisions, will determine if you earn or lose points:</label>
                    <label className='indent_label'>
                               If the ball falls into a cup, you will be rewarded with 100 points.<br></br>
						       If there is no cup in the falling location, the ball will continue falling – and you will not get any points. 
						       <br></br>In addition, in each trial you will pay a storage fee (cups tax) – which is the overall number of cups you currently have on your screen, 
						       squared (for example, if you have 3 cups, the storage fee will be 3^2=9).
                    </label>
                    <label>
                        At the end of each trial, one location will be selected randomly by the computer and you will be asked to consider either donating one of your cups and giving it away OR placing a new cup. 
						After your decision, the next trial will begin and a new ball will fall.
                    </label>
                    <label>
                        Your goal is to earn as many points as you can.
                    </label>
                    <label><b>The more game points you earn – the higher your chances to get an extra bonus!</b>.</label>

                </div>

                <img alt='cups' src={CUPS_IMG} />
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
            <button onClick={Forward}>Next</button>
        </div>
    )
};

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

const Ball = ({ x, y, r}) => (<circle cx={x} cy={y} r={r} />);

const CupNotExistMsg = ({onClick, my_index, cups_num}) => {
    if (!GameSet.storage_cost) {
        const msg = GameCondition === 'Specific' ? (
            <>
                <span>Would you like to place a cup</span>
                <span>in this location?</span>
            </>
        ) : (
            <span>Would you like to add a cup (in one of the empty locations)?</span>
        );

        const place_msg = GameCondition === 'Specific' ? (
            <>Place Cup</>
        ) : (
            <>Yes, add</>
        );

        const dont_place_msg = GameCondition === 'Specific' ? (
            <>Don't Place Cup</>
        ) : (
            <>No, do not add</>
        );

        return (
            <>
                <div>
                    {msg}
                </div>
                <div>
                    <button onClick={() => onClick('PlaceCup', my_index, false)}>{place_msg}</button>
                    <button onClick={() => onClick('DontPlace', my_index, false)}>{dont_place_msg}</button>
                    {/*<button onClick={() => onClick('DoNothing', my_index, false, true)}>Do Nothing</button>*/}
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div>
                    <label>Would you like to place a cup in this location?</label>
                </div>
                <div>
                    <div
                        style={{
                            display: 'grid',
                            alignItems: 'center',
                            gridTemplateColumns: 'auto max-content',
                            columnGap: 8,
                            rowGap: 3
                        }}
                    >
                        <label style={{textAlign:'left'}}>If you do not place a cup, the cups tax will be {points_msg(Math.pow(cups_num, 2), true)}</label>
                        <button
                            onClick={() => onClick('DontPlace', my_index, false)}
                            style={{borderRadius: 0, width: '100%'}}
                        >Don't Place</button>

                        <label style={{textAlign:'left'}}>If you place a cup, the cups tax will be {points_msg(Math.pow(cups_num+1, 2), true)}</label>
                        <button
                            onClick={() => onClick('PlaceCup', my_index, false)}
                            style={{borderRadius: 0, width: '100%'}}
                        >Place Cup</button>
                    </div>

                </div>
            </>
        )
    }
};

const CupExistMsg = ({onClick, my_index, cups_num}) => {
    if (!GameSet.storage_cost){
        // General, Specific
        const msg = GameCondition === 'Specific' ? (
            <>
                <span>Would you like to keep the cup</span>
                <span>in this location or to throw it?</span>
            </>
        ) : (
            <span>Would you like to throw one of your cups?</span>
        );

        const keep_msg = GameCondition === 'Specific' ? (
            <>Keep Cup</>
        ) : (
            <>No, do not throw</>
        );

        const throw_msg = GameCondition === 'Specific' ? (
            <>Throw Cup</>
        ) : (
            <>Yes, throw</>
        );


        return (
            <>
                <div>
                    {msg}
                </div>
                <div>
                    <button onClick={() => onClick('KeepCup', my_index, true)}>{keep_msg}</button>
                    <button onClick={() => onClick('ThrowCup', my_index, true)}>{throw_msg}</button>
                    {/*<button onClick={() => onClick('DoNothing', my_index, true, true)}>Do Nothing</button>*/}
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div>
                    <label>Would you like to keep the cup in this location or throw it?</label>
                </div>
                <div>
                    <div
                        style={{
                            display: 'grid',
                            alignItems: 'center',
                            gridTemplateColumns: 'auto max-content',
                            columnGap: 8,
                            rowGap: 3
                        }}
                    >
                        <label style={{textAlign:'left'}}>If you throw the cup, the cups tax will be {points_msg(Math.pow(cups_num-1, 2), true)}</label>
                        <button
                            onClick={() => onClick('ThrowCup', my_index, true)}
                            style={{borderRadius: 0, width: '100%'}}
                        >Throw Cup</button>

                        <label style={{textAlign:'left'}}>If you keep the cup, the cups tax will be {points_msg(Math.pow(cups_num, 2), true)}</label>
                        <button
                            onClick={() => onClick('KeepCup', my_index, true)}
                            style={{borderRadius: 0, width: '100%'}}
                        >Keep Cup</button>
                    </div>

                </div>
            </>
        )
    }
};

const BoardColumn = ({ball_speed, cups_num, numbers, stop_ball, my_index, cup_selected, ball_selected, msg_selected, callback, gain_msg, msg_index}) => {

    const [posY, setPostY] = useState(-20);
    const [ballRadius, setBallRadius] = useState(null);
    let ColRef = useRef(null);

    useEffect(() => {
        if (!ColRef) return ;
        const handleResize = () => {
            let el = ReactDOM.findDOMNode(ColRef.current);
            let ball_r = (el.clientWidth / 6);
            if (!ball_r)
                ball_r = (0.95*window.innerWidth*0.7 / 60);
            // const ball_r = (window.innerWidth / 10) / 7;
            setBallRadius(ball_r);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [ColRef]);

    useEffect(() => {

        if (!ball_selected && posY !== -20) return setPostY(-20);
        if (stop_ball) return ;
        // if (gain_msg !== null || msg_index !== null) return ;
        // const {height, width} = ColRef.current.getBoundingClientRect();
        // const computed = window.getComputedStyle(el);

        let el = ReactDOM.findDOMNode(ColRef.current);

        let clientHeight = el.clientHeight;

        let interval = setInterval(() => {

            let max_height = cup_selected ? (clientHeight-5-ballRadius*2) : (clientHeight + ballRadius + 30);
            if (posY > (max_height)) {
                callback('BallFinish', my_index, cup_selected, false);
                clearInterval(interval);
                setPostY(max_height);
            }
            else
                setPostY(posY + 10);
        }, ball_speed? ball_speed : GameSet.ball_speed);

        return () => clearInterval(interval);

    }, [posY, ball_selected, gain_msg, msg_index, ballRadius, stop_ball, callback, ball_speed, my_index, cup_selected]);

    return (
        <div
            className='cg-board_col'
            style={{
                borderBottomColor: GameCondition === 'Specific' && msg_selected? 'yellowgreen' : 'blue',
                backgroundColor: GameCondition === 'Specific' && msg_selected? 'rgba(187,187,187,0.4)' : '',
                zIndex: msg_selected?2:1,
            }}
            ref={ColRef}
        >
            {
                numbers && DebugMode && (
                    <label className='cg-board_col_ld'>{my_index+1}</label>
                )
            }
            <div
                className='cg-board_ball'
            >
                <div
                    className={'balloon index' + my_index + ((GameSet.storage_cost || GameCondition === 'General') ? ' cg-balloon-g' : ' cg-balloon-s')}
                    style={{
                        display: msg_selected ? 'grid' : 'none'
                    }}
                >
                    {
                        cup_selected ? (
                            <CupExistMsg
                                cups_num={cups_num}
                                my_index={my_index}
                                onClick={callback}
                            />
                        ) : (
                            <CupNotExistMsg
                                cups_num={cups_num}
                                my_index={my_index}
                                onClick={callback}
                            />
                        )
                    }
                </div>
                {/*<div></div>*/}
                <svg width="100%" height="100%">
                    {
                        ball_selected && ballRadius && (
                            <Ball x='50%' y={posY} r={ballRadius}/>
                        )
                    }
                </svg>
            </div>
            {
                cup_selected && (
                    // <div className="cup-body"/>

                    <img alt='cups' src={CupImage} />
                    // <div className="cup-body_wrapper"></div>
                )
            }
        </div>
    )
}

const GainMsg = ({gain_msg, btnNext}) => {
    let reward_msg;
    const {reward, cups_tax, base_reward} = gain_msg;

    if (!GameSet.storage_cost) {

        reward_msg = (
            <label>
                You {reward < 0 ? 'lost' : 'gained'}{' ' + points_msg(reward, false)}
            </label>
        );
    }
    else {
        if (reward<=0){ // lost
            reward_msg = (
                <label>
                    In this trial you won nothing (as you did not catch the ball),
                    <br/>
                    and paid a {points_msg(cups_tax, true)} cups tax.
                    <br/><br/>
                    Your net payoff is a loss of {points_msg(cups_tax, true)}
                </label>
            )
        }
        else { // gain
            reward_msg = (
                <label>
                    In this trial you won {points_msg(base_reward, true)} for catching the ball,
                    <br/>
                    and paid a {points_msg(cups_tax, true)} cups tax.
                    <br/><br/>
                    Your net payoff is a gain of {points_msg(reward, true)}
                </label>
            )
        }
    }
    return (
        <div
            className='cg-gain_msg'
            // style={{animationDuration: `${GameSet.reward_dis}s`}}
        >
            {reward_msg}

            {
                btnNext && (
                    <button onClick={btnNext}>Next</button>
                )
            }
        </div>
    )
}

class Game extends React.Component{

    constructor(props){
        super(props);

        this.props = props;

        let cups_selected = (new Array(10)).fill(false);

        let indexes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].filter(val => val !== GameSet.no_ask);

        for (let i=0; i<GameSet.cups_start; i++){
            const rnd_index = Math.floor(Math.random() * indexes.length);
            const r_index = indexes[rnd_index];

            indexes = indexes.filter((v, v_index) => v_index !== rnd_index);
            cups_selected[r_index] = true;
        }

        this.state = {
            trial: 1,
            loading: true,
            cups_selected,
            gain_msg: null,
            ball_index: null,
            msg_index: null,
            stop_ball: true,
            debug_row: null,
            debug_btn: false,
        };

        this.setGainMsg = this.setGainMsg.bind(this);
        this.nextBallIndex = this.nextBallIndex.bind(this);
        this.nextMsgIndex = this.nextMsgIndex.bind(this);
        this.callback = this.callback.bind(this);

        this.current_trial = {
            ball_index: '',
            // ball_win_random: '',
            ques_index: '',
            ques_option: '',
            reward: '',
            cup_selected: '',
            random: '',
            win: '',
        };

        this.StartTrialTime = null;
    }

    componentDidMount() {
        StartTime = Date.now();
        this.setState({loading: false}, () => this.nextBallIndex())
    }

    btnNext = () => {
        this.nextMsgIndex();
    }

    setGainMsg({cups_tax, base_reward}){
        let sc = this.state;
        sc.gain_msg =  {
            reward: this.current_trial.reward,
            cups_tax,
            base_reward
        };
        sc.stop_ball = true;

        const cups_num = sc.cups_selected.reduce((total, num) => total + (num?1:0), 0);
        SUM_OF_CUPS += cups_num;
        let db_row = {
            trial: sc.trial,
            ball_location: this.current_trial.ball_index+1,
            cups_num: cups_num || '0',
            points: this.current_trial.reward.toString(),
            same_place: '',
            win: this.current_trial.win,
            // win: sc.cups_selected[sc.ball_index].toString().toUpperCase(),
            // ball_win_random: this.current_trial.ball_win_random,
            cup_decision: '',
            no_cup_decision: '',
            loc_1: sc.cups_selected[0]?1:0,
            loc_2: sc.cups_selected[1]?1:0,
            loc_3: sc.cups_selected[2]?1:0,
            loc_4: sc.cups_selected[3]?1:0,
            loc_5: sc.cups_selected[4]?1:0,
            loc_6: sc.cups_selected[5]?1:0,
            loc_7: sc.cups_selected[6]?1:0,
            loc_8: sc.cups_selected[7]?1:0,
            loc_9: sc.cups_selected[8]?1:0,
            loc_10: sc.cups_selected[9]?1:0
        }
        if (DebugMode)
            sc.debug_row = db_row;

        this.setState(sc)
    }

    nextBallIndex(){
        this.current_trial = {
            ball_index: '',
            // ball_win_random: '', Need to remove all instance of this var
            ques_index: '',
            ques_option: '',
            reward: '',
            cup_selected: '',
            random: ''
        };

        let sc = this.state;
        sc.gain_msg = null;
        sc.msg_index = null;
        sc.stop_ball = false;
        sc.debug_btn = false;

        // let with_cup = [], without_cup = [];
        // for (let i=0; i<sc.cups_selected.length; i++){
        //     if (sc.cups_selected[i])
        //         with_cup.push(i);
        //     else
        //         without_cup.push(i);
        // }
        //
        // let with_cup_percent = with_cup.length;
        //
        // let rnd_with_or_not = Math.floor(Math.random() * 100) + 1;
        // let with_win = with_cup_percent >= rnd_with_or_not;
        //
        // if (with_win){
        //
        //     let rnd = Math.floor(Math.random() * with_cup.length);
        //     sc.ball_index = with_cup[rnd];
        //
        // }
        // else {
        //     let rnd = Math.floor(Math.random() * without_cup.length);
        //     sc.ball_index = without_cup[rnd];
        // }

        // 100% ball random
        sc.ball_index = Math.floor(Math.random() * 10);

        this.current_trial.ball_index = sc.ball_index;

        const cups_num = sc.cups_selected.reduce((total, num) => total + (num?1:0), 0);
        let db_row = {
            // with_cup_percent,
            // rnd_with_or_not,
            // with_win,

            trial: sc.trial,
            ball_location: this.current_trial.ball_index+1,
            cups_num: cups_num || '0',
            points: '',
            same_place: '',
            random: '',
            question_loc: '',
            cup_decision: '',
            no_cup_decision: '',
            elapsedTime: '',
            loc_1: sc.cups_selected[0]?1:0,
            loc_2: sc.cups_selected[1]?1:0,
            loc_3: sc.cups_selected[2]?1:0,
            loc_4: sc.cups_selected[3]?1:0,
            loc_5: sc.cups_selected[4]?1:0,
            loc_6: sc.cups_selected[5]?1:0,
            loc_7: sc.cups_selected[6]?1:0,
            loc_8: sc.cups_selected[7]?1:0,
            loc_9: sc.cups_selected[8]?1:0,
            loc_10: sc.cups_selected[9]?1:0,
        }

        if (DebugMode)
            sc.debug_row = db_row;

        this.setState(sc, () => {
            this.StartTrialTime = Date.now();
        });
    }

    nextMsgIndex(){
        let sc = this.state;
        // sc.msg_index = Math.floor(Math.random() * 10);
        let with_cup = [], without_cup = [], select_1, select_2;
        for (let i=0; i<sc.cups_selected.length; i++){
            if (i !== Number(GameSet.no_ask)){
                if (sc.cups_selected[i])
                    with_cup.push(i);
                else
                    without_cup.push(i);
            }
        }
        let random_1 = Math.floor(Math.random() * 2);
        if (random_1) {
            select_1 = with_cup;
            select_2 = without_cup;
        }
        else {
            select_1 = without_cup;
            select_2 = with_cup;
        }

        if (select_1.length === 0)
            select_1 = select_2;

        let random_index = Math.floor(Math.random() * select_1.length);
        sc.msg_index = select_1[random_index];

        sc.gain_msg = null;
        this.current_trial.random = random_1? 'With cup' : 'Without cup';
        this.current_trial.ques_index = sc.msg_index;

        const cups_num = sc.cups_selected.reduce((total, num) => total + (num?1:0), 0);
        let db_row = {
            trial: sc.trial,
            ball_location: this.current_trial.ball_index+1,
            cups_num: cups_num || '0',
            points: '',
            same_place: '',
            win: this.current_trial.win,
            // win: sc.cups_selected[sc.ball_index].toString().toUpperCase(),
            random: this.current_trial.random,
            question_loc: sc.msg_index+1,
            cup_decision: '',
            no_cup_decision: '',
            elapsedTime: '',
            loc_1: sc.cups_selected[0]?1:0,
            loc_2: sc.cups_selected[1]?1:0,
            loc_3: sc.cups_selected[2]?1:0,
            loc_4: sc.cups_selected[3]?1:0,
            loc_5: sc.cups_selected[4]?1:0,
            loc_6: sc.cups_selected[5]?1:0,
            loc_7: sc.cups_selected[6]?1:0,
            loc_8: sc.cups_selected[7]?1:0,
            loc_9: sc.cups_selected[8]?1:0,
            loc_10: sc.cups_selected[9]?1:0,
        }
        if (DebugMode)
            sc.debug_row = db_row;

        this.setState(sc);
    }

    continueNext = () => {
        if (DebugMode){
            let sc = this.state;
            sc.debug_btn = false;
            this.setState(sc, () => {
                setTimeout(() => this.nextBallIndex(), 500);
            });
        }
        else
            setTimeout(() => this.nextBallIndex(), 500);

    }

    callback(option, index, cup_selected) {
        let sc = this.state;
        const cups_num = sc.cups_selected.reduce((total, num) => total + (num?1:0), 0);

        if (option === 'BallFinish') {
            let reward_points, base_reward = '';
            if (cup_selected) {
                let points_reward = -cups_num*cups_num;
                // let rnd_win = Math.floor(Math.random() * 100);
                // this.current_trial.ball_win_random = rnd_win;
                // if (rnd_win <= 10)
                //     points_reward = GameSet.reward + points_reward;
                points_reward = GameSet.reward + points_reward;
                reward_points = points_reward;
                base_reward = GameSet.reward;
            }
            else
                reward_points = -cups_num*cups_num;

            this.current_trial.reward = reward_points;
            this.current_trial.win = cup_selected.toString().toUpperCase();

            GAME_POINTS += reward_points;
            return this.setGainMsg({
                cups_tax: -cups_num*cups_num,
                base_reward
            });
        }

        this.current_trial.ques_option = option;

        let general_index;
        if (option === 'PlaceCup'){
            if (GameCondition === 'Specific')
                sc.cups_selected[index] = true;
            else {
                let without_cup = [];
                for (let i=0; i<sc.cups_selected.length; i++){
                    if (i !== Number(GameSet.no_ask)){
                        if (!sc.cups_selected[i])
                            without_cup.push(i);
                    }
                }
                let rnd = Math.floor(Math.random() * without_cup.length);
                general_index = without_cup[rnd];
                sc.cups_selected[general_index] = true;
            }
        }
        else if (option === 'ThrowCup'){
            if (GameCondition === 'Specific')
                sc.cups_selected[index] = false;
            else {
                let with_cup = [];
                for (let i=0; i<sc.cups_selected.length; i++){
                    if (i !== Number(GameSet.no_ask)){
                        if (sc.cups_selected[i])
                            with_cup.push(i);
                    }
                }
                let rnd = Math.floor(Math.random() * with_cup.length);
                general_index = with_cup[rnd];
                sc.cups_selected[general_index] = false;

            }
        }

        let same_place;
        if ( GameCondition === 'Specific'){
            same_place = this.current_trial.ques_index === this.current_trial.ball_index ? 'True' : 'False';
        }
        else {
           same_place = general_index === this.current_trial.ball_index ? 'True' : 'False'
        }

        let db_row = {
            trial: sc.trial,
            ball_location: this.current_trial.ball_index+1,
            cups_num: cups_num || '0',
            points: this.current_trial.reward.toString(),
            same_place,
            random: this.current_trial.random,
            question_loc: GameCondition === 'Specific' ? this.current_trial.ques_index+1 : general_index,
            win: this.current_trial.win,
            // win: sc.cups_selected[this.current_trial.ball_index].toString().toUpperCase(),
            // ball_win_random: this.current_trial.ball_win_random,
            cup_decision: cup_selected? option : '',
            no_cup_decision: !cup_selected? option : '',
            elapsedTime: Date.now() - this.StartTrialTime,
            loc_1: sc.cups_selected[0]?1:0,
            loc_2: sc.cups_selected[1]?1:0,
            loc_3: sc.cups_selected[2]?1:0,
            loc_4: sc.cups_selected[3]?1:0,
            loc_5: sc.cups_selected[4]?1:0,
            loc_6: sc.cups_selected[5]?1:0,
            loc_7: sc.cups_selected[6]?1:0,
            loc_8: sc.cups_selected[7]?1:0,
            loc_9: sc.cups_selected[8]?1:0,
            loc_10: sc.cups_selected[9]?1:0,
        }

        this.props.insertGameLine(db_row);

        if (DebugMode) {
            sc.debug_row = db_row;
            sc.debug_btn = true;
        }

        sc.ball_index = null;
        sc.trial++;
        sc.msg_index = null;

        this.setState(sc, () => {
            if (GameSet.trials < sc.trial)
                this.props.Forward();
            else {
                if (!DebugMode)
                    this.continueNext();
            }
        });
    }

    render() {
        if (this.state.loading)
            return <></>;


        return (
            <div
                className='cg-game_board'
            >
                <label
                    className='cg-game_board_h'
                >
                    {this.state.trial}/{GameSet.trials}
                </label>
                {
                    this.state.cups_selected.map(
                        (bc, bc_index) => (
                            <BoardColumn
                                cups_num={this.state.cups_selected.reduce((total, num) => total + (num?1:0), 0)}
                                ball_speed={null}
                                numbers={true}
                                key={bc_index}
                                my_index={bc_index}
                                cup_selected={bc}
                                gain_msg={this.state.gain_msg}
                                msg_index={this.state.msg_index}
                                ball_selected={this.state.ball_index === bc_index}
                                msg_selected={this.state.msg_index === bc_index}
                                stop_ball={this.state.stop_ball}
                                callback={this.callback}
                            />
                        )
                    )
                }
                {
                    this.state.gain_msg !== null && (
                        <GainMsg
                            gain_msg={this.state.gain_msg}
                            btnNext={this.btnNext}
                        />
                    )
                }

                {DebugMode && this.state.debug_row && (
                    <DebuggerModalView>
                        <div className='rm_debug cg_debug'>
                            <div>
                                <label>GAME POINTS:<span>{GAME_POINTS}</span></label>
                                <label>no_ask:<span>{GameSet.no_ask}</span></label>
                                <label>trial:<span>{this.state.debug_row.trial}</span></label>
                                <label>ball_location:<span>{this.state.debug_row.ball_location}</span></label>
                                {/*<label>with_cup_percent:<span>{this.state.debug_row.with_cup_percent}</span></label>*/}
                                {/*<label>rnd_with_or_not:<span>{this.state.debug_row.rnd_with_or_not}</span></label>*/}
                                {/*<label>with_win:<span>{this.state.debug_row.with_win}</span></label>*/}
                                <label>random<span>{this.state.debug_row.random}</span></label>
                                <label>question_loc:<span>{this.state.debug_row.question_loc}</span></label>
                                <label>cups_num:<span>{this.state.debug_row.cups_num}</span></label>
                                <label>points:<span>{this.state.debug_row.points}</span></label>
                                <label>same_place:<span>{this.state.debug_row.same_place}</span></label>
                                <label>win:<span>{this.state.debug_row.win}</span></label>
                                {/*<label>location_win_rnd:<span>{this.state.debug_row.ball_win_random}</span></label>*/}
                                <label>cup_decision:<span>{this.state.debug_row.cup_decision}</span></label>
                                <label>no_cup_decision:<span>{this.state.debug_row.no_cup_decision}</span></label>
                                <label>elapsedTime:<span>{this.state.debug_row.elapsedTime}</span></label>
                                <label>loc_1:<span>{this.state.debug_row.loc_1}</span></label>
                                <label>loc_2:<span>{this.state.debug_row.loc_2}</span></label>
                                <label>loc_3:<span>{this.state.debug_row.loc_3}</span></label>
                                <label>loc_4:<span>{this.state.debug_row.loc_4}</span></label>
                                <label>loc_5:<span>{this.state.debug_row.loc_5}</span></label>
                                <label>loc_6:<span>{this.state.debug_row.loc_6}</span></label>
                                <label>loc_7:<span>{this.state.debug_row.loc_7}</span></label>
                                <label>loc_8:<span>{this.state.debug_row.loc_8}</span></label>
                                <label>loc_9:<span>{this.state.debug_row.loc_9}</span></label>
                                <label>loc_10:<span>{this.state.debug_row.loc_10}</span></label>
                            </div>
                            <button
                                onClick={this.state.debug_btn? this.continueNext : undefined}
                                className={this.state.debug_btn? '' : 'disabledElem'}
                                style={{
                                    pointerEvents: this.state.debug_btn?'all':'none'
                                }}
                            >Next</button>
                        </div>
                    </DebuggerModalView>
                )}

            </div>
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

        game_template.push({
            Component: GameWelcome
        });

        game_template.push({
            Component: Game
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
        if (!this.state || this.state.isLoading) {
            return <WaitForAction2/>;
        }

        const Component = this.game_template[this.state.tasks_index].Component;
        return (
            <div
                className='cg_main unselectable'
            >
                <Component insertGameLine={this.props.insertGameLine} Forward={this.Forward}/>
            </div>
        );
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};


export default Start;
