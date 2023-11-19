import React from 'react';
import './gameStyles.css';
import PropTypes from "prop-types";
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";

import SearchImage from './images/practice.png';
import FingerImage from './images/real.png';
import GapImage from './images/gap.png';
import { Range } from 'react-range';

import $ from 'jquery';
import {DebuggerModalView, KeyTableID} from "../../screens/gameHandle/game_handle";
const ThisExperiment = 'MetaSampling';


// UI
// General check if ok

let DebugMode = null;
let UserId = 'empty';
let RunningName = '-';
let ActionTime = null;

let START_MIL = 0;
let PRACTICE_SELECTED = {
    low: null,
    high: null,
    mean: null
};
let PRACTICE_UN_SELECTED = {
    low: null,
    high: null,
    mean: null
};
let GameSettings = {};
let PaymentsSettings = null;
let ProblemsBank = null;
let ProblemsBankCopy = null;

let RoundsForBonus = null;

let Condition = null;

// payments:
// bonus_endowment
// exchange_ratio
// show_up_fee
// sign_of_reward
const ResetAll = () => {
    UserId = 'empty';
    RunningName = '-';
    PRACTICE_SELECTED = {
        low: null,
        high: null
    };
    PRACTICE_UN_SELECTED = {
        low: null,
        high: null
    };
    GameSettings = {};
    PaymentsSettings = null;
    RoundsForBonus = null;
    DebugMode = null;
    ProblemsBank = null;
    ProblemsBankCopy = null;
    Condition = null;
}

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

const Header = ({Level, PracticeRound, Trial}) => {
    return (
        <label
            className='meta-game-board-h-r'
        >
            {Level === 'Practice' ? 'Practice ' : 'Challenge '}round{' '}
            <span style={{color: 'red'}}><b>{Level === 'Practice' ? PracticeRound : Trial}</b></span>
            {Level !== 'Practice' && <> out of
                <span style={{color: 'red'}}><b>{' '}{GameSettings[Level.toLowerCase() + '_trials']}</b></span></>
            }:
        </label>
    )
}

const Comp1 = ({Stage, PracticeRound}) => {
    return (
        <div className='meta-game-board-head'>
            <label>{Stage === 1 ? 'Sampling' : 'Choosing'}</label>
            <img alt={Stage === 1 ? 'Search' : 'Finger'} src={Stage === 1 ? SearchImage : FingerImage}/>

            {
                PracticeRound === 1 && (
                    <div
                        className='meta-game-board-head-practice_round1'
                        style={{
                            left: Stage === 1 ? '0%' : '25%'
                        }}
                    >
                        {
                            Stage === 1 ? (
                                <>
                                    This icon indicates the sampling stage.<br/>
                                    Press the buttons to sample outcomes.<br/>
                                    When you are ready to decide which button has higher average,<br/>
                                        press "ready for final decision"
                                </>
                            ) : (
                                <>
                                    This icon indicates the choosing stage.<br/>
                                    Based on your sampling, <br/>
                                    press the button you believe to have higher average.
                                </>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
};

const Comp2 = ({btnColor, ButtonClick, PracticeRound, EvGap}) => {
    return (
        <div className='meta-game-board-btns'>
            <button
                className={'meta-game-board-btn meta-game-board-btn-left '  +  btnColor}
                value='LEFT'
                onClick={e => ButtonClick(e, 'LEFT')}
            >
            </button>

            {
                Condition === 'g' ? (
                    <div className={'meta-game-board-btns-text ' + (PracticeRound === 1 ? 'hide-me' : '')}>
                        <label>Gap:</label>
                        <label>{EvGap} Points</label>
                        <img alt='gap' src={GapImage}/>
                    </div>
                ) : (
                    <div style={{marginLeft: 30, marginRight: 30}}></div>
                )
            }

            <button
                className={'meta-game-board-btn meta-game-board-btn-right ' +  btnColor}
                value='RIGHT'
                onClick={e => ButtonClick(e, 'RIGHT')}
            >
            </button>
        </div>
    )

};

const Comp3 = ({Values, ChangeValues}) => {
  return (
      <div>
          <div className='meta-game-board-slider-t'>
              <label>A wild guess</label>
              <label>Definitely correct</label>
          </div>

          <div className='meta-game-board-slider-r'>
              <Range
                  step={1}
                  min={50}
                  max={100}
                  values={Values}
                  onChange={(values) => {
                      if ($('.meta-game-board-space').hasClass('disabledElem'))
                          $('.meta-game-board-space').removeClass('disabledElem');

                      if (!$('.not-allowed-value').hasClass('hide-me'))
                          $('.not-allowed-value').addClass('hide-me');
                      ChangeValues(values);
                  }}
                  renderTrack={({ props, children }) => (
                      <div
                          {...props}
                          style={{
                              ...props.style,
                              height: '6px',
                              width: '100%',
                              backgroundColor: '#ccc'
                          }}
                      >
                          {children}
                      </div>
                  )}
                  renderThumb={({ props }) => (
                      <div
                          {...props}
                          style={{
                              ...props.style,
                              height: '42px',
                              width: '42px',
                              backgroundColor: '#999'
                          }}
                      />
                  )}
              />
              <label>{Values[0]}</label>
              <label className='not-allowed-value hide-me'>The middle of the scale is not allowed, please move the marker to either size of the scale.</label>
          </div>
      </div>
  )
}

const Comp4 = ({PracticeRound, EvGap}) => {
    return (
        <div
            className='meta-game-board-practice_round1-msg-w hide-elem'
        >
            {
                PracticeRound === 1 && (
                    <>
                        <label><b>Good job!</b></label>
                        <label>The button you chose had an average value of <span className='p_selected_mean'/>,</label>
                        <label>while the other button had a lower average value of <span className='p_unselected_mean'/>.</label>
                        <label>Thus, your final choice was <b>correct</b>.</label>
                    </>
                )
            }

            {
                PracticeRound === 2 && (
                    <>
                        <label><b>Good job!</b></label>
                        <label>You chose the button with the higher average value.</label>
                        <label>Thus, your final choice was correct.</label>
                        {
                            Condition === 'g' && (
                                <>
                                    <label>Notice that the gap between the average values of the two buttons was exactly {EvGap},</label>
                                    <label>as was indicated on screen.</label>
                                </>
                            )
                        }
                    </>
                )
            }
        </div>
    )
}

const Comp5 = ({PracticeRound, EvGap}) => {

    return (
        <div
            className='meta-game-board-practice_round1-msg-l hide-elem'
        >
            {
                PracticeRound === 1 && (
                    <>
                        <label><b>Oops!</b></label>
                        <label>The button you chose had an average value of <span className='p_selected_mean'/>,</label>
                        <label>while the other button had a higher average value of <span className='p_unselected_mean'/>.</label>
                        <label>Thus, your final choice was <b>incorrect</b>.</label>
                        <label>Remember that your task is to choose the button that has higher value on average!</label>
                    </>
                )
            }

            {
                PracticeRound === 2 && (
                    <>
                        <label><b>Oops!</b></label>
                        <label>The button you chose had a lower average value.</label>
                        <label>Thus, your final choice was incorrect.</label>
                        <label>Remember that your task is to choose the button that has a higher average value!</label>
                        {
                            Condition === 'g' && (
                                <label>Notice that the gap between the average values of the two buttons was exactly {EvGap}, as was indicated on screen</label>
                            )
                        }
                    </>
                )
            }
        </div>
    )
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.Forward = this.props.Forward;
        // this.endGame = this.props.endGame;
        this.Level = this.props.Level;
        this.practice_round = this.props.PracticeRound;

        this.number_of_trials = this.Level === 'Practice' ? 1 : Number(GameSettings[this.Level.toLowerCase() + '_trials']);

        if (this.Level === 'Real') RoundsForBonus = (new Array(this.number_of_trials)).fill(0);
        this.turns = 0;

        this.game = this.game.bind(this);
        this.go_next = this.go_next.bind(this);
        this.nextProblem = this.nextProblem.bind(this);
        this.getBtnValue = this.getBtnValue.bind(this);
        this.button_click = this.button_click.bind(this);
        this.changeRangeValue = this.changeRangeValue.bind(this);

        this.LEFT = null;
        this.RIGHT = null;

        this.LEFT_Tag = null;
        this.RIGHT_Tag = null;

        this.side_selected = null;
        this.side_selected_value = null;

        this.state = {
            trial: 1,
            current_problem: this.nextProblem(),
            stage: 1,
            values: [75],
        };

        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'M.G',
            type: 'LogGameType',
            more_params: {
                l: this.Level.charAt(0),
                p: this.practice_round || '-',
                t_t: this.Level === 'Practice' ? 1 : GameSettings[this.Level.toLowerCase() + '_trials'],
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
    }

    nextProblem() {

        let CurrentLevelIndexes = [];
        for (let i=0; i<ProblemsBank.length; i++) {
            if (ProblemsBank[i].level.includes(this.Level))
                CurrentLevelIndexes.push(i);
        }
        if (CurrentLevelIndexes.length === 0){
            ProblemsBank = [...ProblemsBankCopy];
            for (let i=0; i<ProblemsBank.length; i++) {
                if (ProblemsBank[i].level.includes(this.Level))
                    CurrentLevelIndexes.push(i);
            }
        }

        let next_index, real_index, next_problem;

        if (this.Level === 'Practice') {
            // let gap4, gap2, gap3, gap1;
            //
            // for (let t = 0; t < CurrentLevelIndexes.length; t++) {
            //     let left_mean = (Number(ProblemsBank[CurrentLevelIndexes[t]].values_inferior_option.low) + Number(ProblemsBank[CurrentLevelIndexes[t]].values_inferior_option.high)) / 2;
            //     let right_mean = (Number(ProblemsBank[CurrentLevelIndexes[t]].values_superior_option.low) + Number(ProblemsBank[CurrentLevelIndexes[t]].values_superior_option.high)) / 2;
            //
            //     let EV_gap = Math.abs(left_mean - right_mean);
            //
            //     if (EV_gap == 4)
            //         gap4 = t;
            //     else if (EV_gap == 2)
            //         gap2 = t;
            //     else if (EV_gap == 3)
            //         gap3 = t;
            //     else if (EV_gap == 1)
            //         gap1 = t;
            // }
            //
            // if (this.practice_round === 1)
            //     next_index = gap4;
            // else if (this.practice_round === 2)
            //     next_index = gap2;
            // else if (this.practice_round === 3)
            //     next_index = gap3;
            // else if (this.practice_round === 4)
            //     next_index = gap1;

            // this.practice_round

            let found_practice = null;
            const curr_level = 'Practice' + this.practice_round;
            for (let i=0; i<CurrentLevelIndexes.length; i++){
                if (ProblemsBank[CurrentLevelIndexes[i]].level === curr_level)
                    found_practice = i;
            }
            if (found_practice !== null)
                next_index = found_practice;
            else
                next_index = Math.floor(Math.random() * CurrentLevelIndexes.length);
        }
        else {
            if (GameSettings.random_o === 'Yes')
                next_index = Math.floor(Math.random() * CurrentLevelIndexes.length);
            else
                next_index = 0;
        }
        real_index = CurrentLevelIndexes[next_index];
        next_problem = {...ProblemsBank[real_index]};

        ProblemsBank = ProblemsBank.filter((p, p_index) => p_index !== real_index);

        if (ProblemsBank.length === 0)
            ProblemsBank = [...ProblemsBankCopy];

        let randomSide = Math.floor(Math.random() * 2);
        if (randomSide === 0){
            this.LEFT = next_problem.values_inferior_option;
            this.LEFT_Tag = 'inferior';
            this.RIGHT = next_problem.values_superior_option;
            this.RIGHT_Tag = 'superior';
        }
        else {
            this.RIGHT = next_problem.values_inferior_option;
            this.LEFT = next_problem.values_superior_option;
            this.LEFT_Tag = 'superior';
            this.RIGHT_Tag = 'inferior';
        }

        return next_problem;

    }

    getBtnValue(side) {
        let range = Number(this[side].high) - Number(this[side].low);

        let random_value = Math.floor(Math.random() * (range+1));
        let final_value = Number(this[side].low )+ random_value;
        return final_value;
    }

    addToDb() {
        let index_;
        for (let i=0; i<ProblemsBankCopy.length; i++) {
            if (
                !ProblemsBankCopy[i].difficulty_level.localeCompare(this.state.current_problem.difficulty_level) &&
                ProblemsBankCopy[i].EV_gap === this.state.current_problem.EV_gap &&
                !ProblemsBankCopy[i].level.localeCompare(this.state.current_problem.level) &&
                Number(ProblemsBankCopy[i].values_inferior_option.low) === Number(this.state.current_problem.values_inferior_option.low) &&
                Number(ProblemsBankCopy[i].values_inferior_option.high) === Number(this.state.current_problem.values_inferior_option.high) &&
                Number(ProblemsBankCopy[i].values_superior_option.low) === Number(this.state.current_problem.values_superior_option.low) &&
                Number(ProblemsBankCopy[i].values_superior_option.high) === Number(this.state.current_problem.values_superior_option.high)
            ) {
                index_ = i;
                break;
            }
        }

        let left_mean = (Number(this.LEFT.low) + Number(this.LEFT.high)) / 2;
        let right_mean = (Number(this.RIGHT.low) + Number(this.RIGHT.high)) / 2;

        let side_bigger;
        if (left_mean > right_mean)
            side_bigger = 'LEFT';
        else
            side_bigger = 'RIGHT';

        let date = getTimeDate();

        const IsCorrect = !this.side_selected.localeCompare(side_bigger);

        if (this.Level === 'Real' && this.state.stage === 2) {
            RoundsForBonus[this.state.trial-1] = IsCorrect;
        }

        let Value = this.state.stage === 1 ? this.side_selected_value : (this.side_selected === 'LEFT' ? left_mean : right_mean);

        if (DebugMode){
            $('#meta_d_turns').text(this.turns);
            $('#meta_d_correct').text(IsCorrect);
            $('#meta_d_btn_val').text(this.side_selected_value);
            $('#meta_d_btn_rec').text(Value);
            $('#meta_p_index').text(index_+1);
            $('#meta_s_big').text(side_bigger);
            // $('#meta_d_btn_val').text('');
        }

        let EV_gap = Math.abs(left_mean - right_mean);

        let obj = {
            Level: this.Level,
            Condition,
            Trial: this.Level === 'Practice' ? this.practice_round : this.state.trial,
            ProblemIndex: index_,
            Stage: this.state.stage,
            Samples: this.turns,
            Gap: EV_gap,
            DifficultyLevel: this.state.current_problem.difficulty_level,
            InferiorLow: this.state.current_problem.values_inferior_option.low,
            InferiorHigh: this.state.current_problem.values_inferior_option.high,
            SuperiorLow: this.state.current_problem.values_superior_option.low,
            SuperiorHigh: this.state.current_problem.values_superior_option.high,
            Selected: this.side_selected,
            IsCorrect: IsCorrect ? '1' : '0',
            Confidence: this.state.stage === 1 ? '-1' : this.state.values[0],
            SelectedValue: this.side_selected_value,
            Value,
            Left: this.LEFT_Tag,
            Right: this.RIGHT_Tag,
            Time: date.time,
            ElapsedTimeMil: Date.now() - START_MIL
        };

        this.props.insertGameLine(obj);
    }

    go_next(event) {

        if(this.practice_round !== 1 && this.practice_round !== 2 && this.state.stage === 2){
            if (this.state.values[0] === 75){
                $('.not-allowed-value').removeClass('hide-me');
                return;
            }
            else {
                if (!$('.not-allowed-value').hasClass('hide-me'))
                    $('.not-allowed-value').addClass('hide-me');
            }
        }

        $('.meta-game-board-slider').addClass('hide-me');
        $('.meta-game-board-slider').addClass('disabledElem');
        $('.meta-game-board-space').addClass('hide-me');
        $('.meta-game-board-space').addClass('disabledElem');
        $('.meta-game-board-btn').removeClass('prevent-events');
        $('.meta-game-board-btn').removeClass('btn-choice');
        $('.meta-game-board-btn').text('');

        if (this.state.stage === 2){
            this.addToDb();
        }

        if (this.number_of_trials === this.state.trial && this.state.stage === 2) {
            this.Forward();
        }
        else {
            let sc = this.state;
            if (sc.stage === 2){
                sc.current_problem = this.nextProblem();
                sc.trial++;
                sc.stage = 1;
                sc.values = [75];
                this.turns = 0;
            }
            else
                sc.stage++;

            this.setState(sc);
        }

    }

    game() {

        return (
            <div
                className=''
            >

            </div>
        )
    }

    button_click(e, side) {
        $(e.target).blur();

        let btn_value = this.getBtnValue(side);
        $('.meta-game-board-btn').blur();
        if (this.state.stage !== 2 && this.practice_round !== 1)
            $('.meta-game-board-btn').addClass('prevent-events');
        else {
            $('.meta-game-board-btn').addClass('prevent-events');
            $('.meta-game-board-practice_round1').removeClass('hide-me');
            $('.meta-game-board-btn').removeClass('btn-choice');
            if (this[side + '_Tag'] === 'superior') {
                $('.meta-game-board-practice_round1-msg-w').removeClass('hide-elem');
                if (!$('.meta-game-board-practice_round1-msg-l').hasClass('hide-elem'))
                    $('.meta-game-board-practice_round1-msg-l').addClass('hide-elem');
            }
            else {
                $('.meta-game-board-practice_round1-msg-l').removeClass('hide-elem');
                if (!$('.meta-game-board-practice_round1-msg-w').hasClass('hide-elem'))
                    $('.meta-game-board-practice_round1-msg-w').addClass('hide-elem');
            }

        }

        this.side_selected_value = btn_value;
        this.side_selected = side;
        let other_side = side === 'LEFT' ? 'RIGHT' : 'LEFT';


        PRACTICE_SELECTED.low = Number(this[side].low);
        PRACTICE_SELECTED.high = Number(this[side].high);
        PRACTICE_SELECTED.mean = (Number(this[side].high) + Number(this[side].low))/2;
        PRACTICE_UN_SELECTED.low = Number(this[other_side].low);
        PRACTICE_UN_SELECTED.high = Number(this[other_side].high);
        PRACTICE_UN_SELECTED.mean = (Number(this[other_side].high) + Number(this[other_side].low))/2;


        $('.p_selected_mean').text(PRACTICE_SELECTED.mean);
        $('.p_unselected_mean').text(PRACTICE_UN_SELECTED.mean);

        if (DebugMode){
            $('#meta_d_btn_val').text(this.side_selected_value);
            let left_mean = (Number(this.LEFT.low) + Number(this.LEFT.high)) / 2;
            let right_mean = (Number(this.RIGHT.low) + Number(this.RIGHT.high)) / 2;
            let Value = this.state.stage === 1 ? this.side_selected_value : (this.side_selected === 'LEFT' ? left_mean : right_mean);
            $('#meta_d_btn_rec').text(Value);
        }

        if (this.state.stage === 1){
            $('.meta-game-board-btn-' + side.toLowerCase()).text(btn_value);
            $('.meta-game-board-space').addClass('disabledElem');

            setTimeout(() => {
                $('.meta-game-board-btn-' + side.toLowerCase()).text('');
                $('.meta-game-board-space').removeClass('disabledElem');
                $('.meta-game-board-btn').removeClass('prevent-events');
            }, GameSettings.sampling_delay * 1000);

            this.turns++;
            this.addToDb();
        }
        else {
            // $('.meta-game-board-space').removeClass('disabledElem');
            $('.meta-game-board-space').removeClass('hide-me');
            $('.meta-game-board-slider').removeClass('hide-me');
            if (this.practice_round !== 1 && this.practice_round !== 2)
                $('.meta-game-board-btn-' + side.toLowerCase()).text('Your choice');
            else {
                $('.meta-game-board-btn-' + side.toLowerCase()).text((Number(this[side].high) + Number(this[side].low))/2);
                $('.meta-game-board-btn-' + other_side.toLowerCase()).text((Number(this[other_side].high) + Number(this[other_side].low))/2);
            }
            $('.meta-game-board-btn-' + side.toLowerCase()).addClass('btn-choice');

            // if(this.practice_round === 1 || this.practice_round === 2)
            $('.meta-game-board-space').removeClass('disabledElem');

        }
    }

    changeRangeValue(values){
        let sc = this.state;
        sc.values = values;
        this.setState(sc);
    }

    render() {
        let btnColor = this.state.stage === 1 ? 'meta-sampling-btn' : 'meta-choosing-btn';

        let ev_gap;
        let left_mean, right_mean;

        left_mean = (Number(this.LEFT.low) + Number(this.LEFT.high)) / 2;
        right_mean = (Number(this.RIGHT.low) + Number(this.RIGHT.high)) / 2;

        ev_gap = Math.abs(left_mean - right_mean);

        let i_mean = (Number(this.state.current_problem.values_inferior_option.low) + Number(this.state.current_problem.values_inferior_option.high)) / 2;
        let s_mean = (Number(this.state.current_problem.values_superior_option.low) + Number(this.state.current_problem.values_superior_option.high)) / 2;

        let set_cond;
        const g_c = GameSettings.game_condition;
        if (g_c === 'g')
            set_cond = 'With Gap';
        else if (g_c === 'ng')
            set_cond = 'Without Gap';
        else if (g_c === 'r')
            set_cond = 'Random';
        else if (g_c === 'a')
            set_cond = 'Alternate';

        return (
            <>
                <div
                    className='dfe-game-mode'
                >
                    <div
                        className='meta-game-board'
                    >
                        <Header
                            Level={this.Level}
                            PracticeRound={this.practice_round}
                            Trial={this.state.trial}
                        />

                        <label className='meta-game-board-h-2'>Which button has a higher value on average?</label>

                        <Comp1
                            Stage={this.state.stage}
                            PracticeRound={this.practice_round}
                        />

                        <Comp2
                            btnColor={btnColor}
                            ButtonClick={this.button_click}
                            PracticeRound={this.practice_round}
                            EvGap={ev_gap}
                        />

                        {
                            this.state.stage === 2 && this.practice_round !== 1 && this.practice_round !== 2 && (
                                <div
                                    className={'meta-game-board-slider hide-me'}
                                    style={(this.practice_round === 1 || this.practice_round === 2) ? {visibility: 'hidden'} : {}}
                                >

                                    <label>How confident are you that this key is the better one?</label>
                                    <Comp3
                                        Values={this.state.values}
                                        ChangeValues={this.changeRangeValue}
                                    />
                                </div>
                            )
                        }

                        {
                            (this.state.stage === 2 && (this.practice_round === 1 || this.practice_round === 2)) && (
                                <div
                                    className='meta-game-board-practice_round1 hide-me'
                                >

                                    <Comp4
                                        PracticeRound={this.practice_round}
                                        EvGap={ev_gap}
                                    />

                                    <Comp5
                                        PracticeRound={this.practice_round}
                                        EvGap={ev_gap}
                                    />
                                </div>
                            )
                        }

                        <button
                            className={'meta-game-board-space disabledElem' + (this.state.stage === 1 ? ' meta-game-board-space-1' : ' hide-me meta-game-board-space-2')}
                            onClick={() => this.go_next()}
                        >
                            <label>{this.state.stage === 1 ? 'Ready for final decision' : 'Next'}</label>
                            {this.state.stage === 1 && <img alt='finger' src={FingerImage}/>}
                        </button>
                    </div>

                </div>
                {
                    DebugMode && (
                        <DebuggerModalView>
                            <div className='meta_debug'>
                                <label>Settings Condition:<span>{set_cond}</span></label>
                                <label>Condition:<span>{Condition === 'g' ? 'With gap' : 'Without gap'}</span></label>
                                <label>Samples:<span id='meta_d_turns'>{this.turns}</span></label>
                                <label>ButtonValue: <span id='meta_d_btn_val'></span></label>
                                <label>Value: <span id='meta_d_btn_rec'></span></label>
                                <label>IsCorrect: <span id='meta_d_correct'></span></label>
                                <label>Bigger: <span id='meta_s_big'></span></label>
                                <label>Left mean: <span>{left_mean}</span></label>
                                <label>Right mean: <span>{right_mean}</span></label>
                                <label>Left: <span>{this.LEFT_Tag}</span></label>
                                <label>Right: <span>{this.RIGHT_Tag}</span></label>
                                <div>
                                    <label><span style={{color: 'blue', marginTop: 10}}>Current problem:</span></label>
                                    <label>Index: <span id='meta_p_index'></span></label>
                                    <label>Level: <span>{this.state.current_problem.level}</span></label>
                                    <label>Difficulty level: <span>{this.state.current_problem.difficulty_level}</span></label>
                                    <label>EV_gap: <span>{ev_gap}</span></label>
                                    <label>inferior <span style={{color: '#16ffff'}}>low:</span> <span>{this.state.current_problem.values_inferior_option.low}</span> <span style={{color: '#16ffff'}}>high:</span> <span>{this.state.current_problem.values_inferior_option.high}</span> <span style={{color: '#16ffff'}}>mean:</span> <span>{i_mean}</span> </label>
                                    <label>superior <span style={{color: '#16ffff'}}>low:</span> <span>{this.state.current_problem.values_superior_option.low}</span> <span style={{color: '#16ffff'}}>high:</span> <span>{this.state.current_problem.values_superior_option.high}</span> <span style={{color: '#16ffff'}}>mean:</span> <span>{s_mean}</span> </label>
                                </div>
                            </div>
                        </DebuggerModalView>
                    )
                }
            </>
        )
    }

    // debugger_show() {
    //     try {
    //         let left_mean = (this.LEFT.low + this.LEFT.high) / 2;
    //         let right_mean = (this.RIGHT.low + this.RIGHT.high) / 2;
    //
    //         let side_bigger;
    //         if (left_mean > right_mean)
    //             side_bigger = 'LEFT';
    //         else
    //             side_bigger = 'RIGHT';
    //
    //         let is_correct;
    //         try {
    //             if (this.side_selected.localeCompare(side_bigger) === 0)
    //                 is_correct = 'True';
    //             else
    //                 is_correct = 'False';
    //         }
    //         catch (e){
    //             is_correct = '-';
    //         }
    //
    //
    //     }
    //     catch (e) {
    //         return <></>
    //     }
    // }

}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();
        // window.history.pushState("string", "Title", "newUrlhhgjhv");

        GameSettings.game_condition = props.game_settings.game.con;
        GameSettings.practice_trials = props.game_settings.game.practice_trials;
        GameSettings.real_trials = props.game_settings.game.real_trials;
        GameSettings.sampling_delay = props.game_settings.game.sampling_delay;
        GameSettings.random_o = props.game_settings.game.random_o;

        ProblemsBank = props.game_settings.game.problems_bank;
        ProblemsBankCopy = [...ProblemsBank];
        PaymentsSettings = props.game_settings.payments;

        ActionTime = props.game_settings.general.action_time
        UserId = props.user_id;
        RunningName = props.running_name;
        DebugMode = props.dmr;

        // const conditions = {
        //     g: 'With Gap',
        //     ng: 'Without Gap',
        //     r: 'Random',
        //     a: 'Alternate',
        // }

        const cond = ['g', 'ng'];

        Condition = GameSettings.game_condition;
        if (Condition === 'a'){
            let RunCounter = KeyTableID();
            Condition = cond[RunCounter%2];
        }
        else if (Condition === 'r'){
            let random = Math.floor(Math.random() * cond.length);
            Condition = cond[random];
        }

        this.state = {
            tasks_index: 0,
            isa: props.isa,
            isLoading: true,
        };

        this.tasks = ['Demo', 'Game'];

        this.game_template = null;

        this.initializeGame();

        this.props.SetLimitedTime(false);

        this.Forward = this.Forward.bind(this);

    }

    initializeGame() {

        let game_template = [];

        game_template.push({
            Mode: 'Message',
            Message: () => GameWelcome(this.props.insertTextInput),
            Button: 'Start practice round #1'
        });

        game_template.push({
            Mode: 'Game',
            Level: 'Practice',
            PracticeRound: 1
        });

        game_template.push({
            Mode: 'Message',
            Message: BetweenPractice1,
            Button: 'Start practice round #2'
        });

        game_template.push({
            Mode: 'Game',
            Level: 'Practice',
            PracticeRound: 2
        });

        game_template.push({
            Mode: 'Message',
            Message: BetweenPractice2,
            Button: 'Start practice round #3'
        });

        game_template.push({
            Mode: 'Game',
            Level: 'Practice',
            PracticeRound: 3
        });

        game_template.push({
            Mode: 'Message',
            Message: BetweenPractice3,
            Button: 'Start the last practice round'
        });

        game_template.push({
            Mode: 'Game',
            Level: 'Practice',
            PracticeRound: 4
        });

        game_template.push({
            Mode: 'Message',
            Message: PracticeEnd,
            Button: 'Start the challenge!'
        });

        game_template.push({
            Mode: 'Game',
            Level: 'Real',
            PracticeRound: null
        });

        // game_template.push({
        //     Mode: 'Message',
        //     Message: Finish_Game,
        //     Button: 'Get your completion code'
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

            const random_index = Math.floor(Math.random() * RoundsForBonus.length);

            const isCorrect = RoundsForBonus[random_index];

            this.props.insertTextInput('GC', GameSettings.game_condition);
            this.props.insertTextInput('Condition', Condition);

            let game_points = 0;
            for (let i=0; i<RoundsForBonus.length; i++)
                if(RoundsForBonus[i]) game_points++;

            //
            // let payment_data = {
            //     show_up_fee: Number(SETTINGS.general.show_up_fee),
            //     sign_of_reward: SETTINGS.general.sign_of_reward,
            //     Bonus: 0
            // };
            //
            // let total_pay = SETTINGS.general.show_up_fee + payment_data.Bonus;
            //
            let bonus = isCorrect ? PaymentsSettings.bonus_endowment : 0;

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
                    irc: isCorrect.toString(),
                    r_r: random_index+1,
                    total_payment: total_pay,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            // this.props.insertPayment({
            //     game_points: GAME_POINTS,
            //     sign_of_reward: payments.sign_of_reward,
            //     show_up_fee: payments.show_up_fee,
            //     exchange_ratio: payments.exchange_ratio,
            //     bonus_endowment: payments.bonus_endowment,
            //     bonus: bonus,
            //     total_payment: Math.floor((bonus + payments.show_up_fee)*100)/100,
            //     Time: current_time.time,
            //     Date: current_time.date
            // });
            // Logs({
            //     info:
            //         ('id=' + CONSTANT_DETAILS['Id'] +
            //             ' | action=EndApp | points=' + GAME_POINTS +
            //             ' | bonus=' + bonus + ' | total_pay=' + total_payment
            //         )}, 'ONLY_WP_YUVAL').then(
            //     (res) => {
            //     }
            // );

            // NewLogs({
            //     user_id: UserId,
            //     exp: ThisExperiment,
            //     running_name: RunningName,
            //     action: 'G.E.S',
            //     type: 'LogGameType',
            //     more_params: {
            //         p_type: PUZZLES_TYPES,
            //         game_points: GAME_POINTS,
            //         bonus: bonus,
            //         total_payment: Math.floor((bonus + payments.show_up_fee)*100)/100,
            //         local_t: current_time.time,
            //         local_d: current_time.date,
            //     },
            // }).then((res) => {});

            this.props.insertPayment({
                game_points,
                sign_of_reward: PaymentsSettings.sign_of_reward,
                show_up_fee: PaymentsSettings.show_up_fee,
                exchange_ratio: PaymentsSettings.exchange_ratio,
                bonus_endowment: PaymentsSettings.bonus_endowment,
                bonus: bonus,
                random_round: random_index+1,
                is_round_correct: isCorrect?'True':'False',
                total_payment: total_pay,
                Time: current_time.time,
                Date: current_time.date
            });


            sc.isLoading = true;
            this.setState(sc, () => {
                this.props.sendGameDataToDB().then(
                    () => {
                        NewLogs({
                            user_id: UserId,
                            exp: ThisExperiment,
                            running_name: RunningName,
                            action: 'G.E.S',
                            type: 'LogGameType',
                            more_params: {
                                game_points,
                                bonus,
                                irc: isCorrect.toString(),
                                r_r: random_index+1,
                                total_payment: total_pay,
                                local_t: current_time.time,
                                local_d: current_time.date,
                            },
                        }).then((res) => {});
                        this.props.callbackFunction('FinishGame', {need_summary: true, args: {game_points}});
                    }
                );
            });
        }
        else {
            sc.tasks_index++;
            if (this.game_template[sc.tasks_index].Mode === 'Game' && this.game_template[sc.tasks_index].Level === 'Real')
                this.props.SetLimitedTime(true);
            else
                this.props.SetLimitedTime(false);
        }
        this.setState(sc);
    }

    render() {
        if (!this.state || this.state.isLoading || !Array.isArray(this.game_template)) {
            return <WaitForAction2/>;
        }

        return (
            <div
                className='cm-start-panel dfe-pl-panel'
            >
                {this.game_template[this.state.tasks_index].Mode === 'Message' && (
                    <Messages
                        Message={this.game_template[this.state.tasks_index].Message()}
                        Button={this.game_template[this.state.tasks_index].Button}
                        Forward={this.Forward}
                    />
                )}

                {this.game_template[this.state.tasks_index].Mode === 'Game' && (
                    <Game
                        PracticeRound={this.game_template[this.state.tasks_index].PracticeRound}
                        Level={this.game_template[this.state.tasks_index].Level}
                        Forward={this.Forward}
                        insertGameLine={this.props.insertGameLine}
                    />
                )}
            </div>
        );
    }
}

Start.propTypes = {
    game_settings: PropTypes.object,
};


export default Start;


//////////////////////  Messages  //////////////////////
const btn_sample = ({gap, sample}) => {
    let btnColor = 'meta-' + sample + '-btn';

    let gap_val = Math.abs(PRACTICE_SELECTED.mean - PRACTICE_UN_SELECTED.mean);

    return (
        <div
            className='meta-game-board-btns meta-message-btns'
        >
            <button
                className={'meta-game-board-btn meta-game-board-btn-left ' + btnColor}
            >
            </button>

            <div
                className={'meta-game-board-btns-text meta-message-text'}
            >
                {
                    (Condition === 'g' && gap) ? (
                        <>
                            <label>Gap:</label>
                            <label>{gap_val} Points</label>
                            <img
                                alt='gap'
                                src={GapImage}
                            />
                        </>
                    ) : (
                        <div style={{marginLeft: 30, marginRight: 30}}></div>
                    )
                }
            </div>
            <button
                className={'meta-game-board-btn meta-game-board-btn-right ' + (sample === 'choosing' ? ' btn-choice ' : '') + btnColor}
            >
                {sample === 'choosing' && 'Your choice'}
            </button>
        </div>
    )
};

const GameWelcome = (insertTextInput) => {
    return (
        <div
            className=''
        >
            <label className='cm-messages-content-header'>Welcome to the CHOICE CHALLENGE!</label>
            <br/>
            <label>
                The current task includes {GameSettings.practice_trials} practice rounds and {GameSettings.real_trials} real rounds.
                In each round, you will be presented with two buttons on the screen. Each button, when pressed, will give a value. On average, the values from one button are higher than the values from the other button. In each round, <b>your task is to select the button with the higher average value.</b>
            </label>
            <br/>
            {btn_sample({
                gap: false,
                sample: 'sampling'
            })}
            <br/>
            <label>
                Each round starts with a sampling stage in which you can check the values produced by each of the buttons. After pressing a button, one value will be sampled randomly and presented on that button. You can sample the values on each button again and again, for as long as you wish. When you have made up your mind and do not wish to sample anymore, click "ready for final decision".
            </label>
            <label>
                Notice: There is always one button that has higher value on average than the other. Your task is to find which button it is!
            </label>
            <br/>
            <div className='sp-m-com'>
                <label><u>Comments:</u></label>
                <textarea onChange={e => insertTextInput('TextInput', e.target.value)}/>
            </div>
        </div>
    )
};

const BetweenPractice1 = () => {

    return (
        <div
            className=''
        >
            <label>In the practice round you just went through, the gap between the average values of the two buttons was {Math.abs(PRACTICE_SELECTED.mean - PRACTICE_UN_SELECTED.mean)}. However, this gap may vary from round to round. Thus, some rounds will have large gaps between the average values of the two buttons, while other rounds will have a smaller gap between the buttons.</label>
            <br/>

            {
                Condition === 'g' && (
                    <>
                        <label>Importantly, the exact gap between the average values of the buttons will be presented on the screen, between the two buttons, throughout the round.</label>
                        <br/>
                    </>
                )
            }
            {btn_sample({
                gap: true,
                sample: 'sampling'
            })}
            <br/>
            <label>Now, you will move to the 2nd practice round. It will be accompanied by additional instructions.</label>
        </div>
    )
};

const BetweenPractice2 = () => {

    return (
        <div
            className=''
        >
            <label>From now on you will not get feedback regarding the accuracy of your choices. From now on, immediately after you make a final decision for each round, a confidence scale will appear. You will be asked to assess the likelihood that the button you chose indeed had the higher average value than the other button.</label>
            <br/>
            <label>The confidence scales ranges between 50% and 100%. If your choice was based on a wild guess, then the likelihood of it being correct is 50% and you should mark 50% on the confidence scale. Choosing 100% indicates that you are absolutely sure that you pressed the button with the higher average. Please use the entire scale, with confidence ratings such as 55%, 77%, or 92%, as some of the rounds are easier and others are more challenging.</label>
            <br/>
            <label>When presented, the marker will be located in the middle of the scale. You must move it either to the left, less confident, or to the right, more confident, from its initial location.</label>
            <br/>
            <div
                className='meta-message-head'
            >
                <div className='meta-game-board-head'>
                    <label>Choosing</label>
                    <img alt='finger' src={FingerImage}/>
                </div>
                {btn_sample({
                    gap: true,
                    sample: 'choosing'
                })}
                <div
                    className={'meta-game-board-slider meta-message-choosing'}
                >
                    <label>How confident are you that this key is the better one?</label>

                    <div>
                        <div className='meta-game-board-slider-t'>
                            <label>A wild guess</label>
                            <label>Definitely correct</label>
                        </div>

                        <div className='meta-game-board-slider-r'>
                            <Range
                                step={1}
                                disabled={true}
                                min={50}
                                max={100}
                                values={[75]}
                                onChange={() => {}}
                                renderTrack={({ props, children }) => (
                                    <div
                                        {...props}
                                        style={{
                                            ...props.style,
                                            height: '3px',
                                            width: '100%',
                                            backgroundColor: '#ccc'
                                        }}
                                    >
                                        {children}
                                    </div>
                                )}
                                renderThumb={({ props }) => (
                                    <div
                                        {...props}
                                        style={{
                                            ...props.style,
                                            height: '21px',
                                            width: '21px',
                                            backgroundColor: '#999'
                                        }}
                                    />
                                )}
                            />
                            <label>75</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const BetweenPractice3 = () => {

    return (
        <div
            className=''
        >
            <label>This is the last practice round.</label>
            <label>Notice that each round will include new buttons which might have different values and a different gap between them.</label>
            <br/>
            <label>BONUS SCHEME: After you finish the entire task, with all its rounds, one round will be randomly selected by the computer and your final choice in this round will be checked. If your choice in that round turns out to be correct, you will get a bonus of {`${PaymentsSettings.sign_of_reward} ${PaymentsSettings.bonus_endowment}`}. If your final choice in that round turns out to be incorrect, you will not get a bonus payment. Thus, to maximize the likelihood you will get the bonus, you should aim to choose the button with the higher average in all rounds.</label>
        </div>
    )
};

const PracticeEnd = () => {

    return (
        <div
            className=''
        >
            <label>Great! The instructions and practice are now over. On the next screen you will start the real challenge, with the option to earn a bonus based on your choice. The challenge includes {GameSettings.real_trials} rounds.</label>
            <br/>
            <label>
                There is no time limit on making your choices. You can continue sampling as long as you wish! However, there is a time limit for being idle so you must continue sampling without being idle for more than {ActionTime} second{ActionTime !== 1 ? 's' : ''}. Therefore, once you start the challenge, please complete all the rounds without breaks. Note that if you will be idle for {ActionTime} second{ActionTime !== 1 ? 's' : ''}, the experimental screen will close and you will not be compensated.
            </label>
            <br/>
            <label>Good luck!</label>
        </div>
    )
};

//////////////////////  Messages  //////////////////////
