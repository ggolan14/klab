import React, {Fragment} from 'react';
import './gameStyles.css';
import './ctStyles.css';
import $ from 'jquery';
import {NewLogs} from "../../../actions/logger";
import {getTimeDate} from "../../../utils/app_utils";
import WaitForAction2 from "../../screens/waitForAction/wait_for_action2";

let UserId = 'empty';
let RunningName = '-';
const ThisExperiment = 'RepeatedChoice';

let START_MIL = 0;

let PL_RND_COMMON_BTN = null;
let PL_LEFT_SIDE_PROB = null, PL_RIGHT_SIDE_PROB = null;

let TaskAnalysisParameter = 0;

let TrialResponseTime = null;
let TaskScore = 0, TotalScore = 0;
let GAME_RECORDS = {};

let RD_SAFE_BUTTON = null, RT_SAFE_BUTTON = null;

let PL_PATTERN_RND_COMMON_BTN = null;

let DFE_PATTERN_RND_NUMBER = null;
let DFE_PATTERN_SIDE = null;

let PL_PATTERN_RARE = null;
let PL_PATTERN_FREQUENT = null;
let PL_PATTERN_SIDES = {};
let PL_PATTERN_FR_SIDES = {};

let CHECKS_TASK_SCORE = 0;
let TasksOrder = null;
let GameTasks = null;
let GameRealTasks = null;
let FIRST_TASK;
let GameSetting;

const upperLowerText = key => {
    let keys = {
        lower: {
            English: 'lower',
            German: 'untere',
        },
        upper: {
            English: 'upper',
            German: 'obere',
        }
    }
    return keys[key][GameSetting.language];
}

const ErrorWarning = ({children}) => {
    return (
        <div className='rm_text_input_error_c'>
            <div className='rm_text_input_error'>
                {children}
            </div>
        </div>
    )
}

// const clearData = () => {
//     // Bonus_Rounds = [];
//     // DEBUGGER_MODE = null;
//     // START_MIL = 0;
//     // FINAL_RESULT = [];
//     // FINISH_GAME = false;
//     //
//     // PatternConditionIndex = null;
//     // TasksOrder = null;
//     // RX_ORDER_INDEX = null;
//     PL_RND_COMMON_BTN = null;
//     PL_LEFT_SIDE_PROB = null;
//     PL_RIGHT_SIDE_PROB = null;
//     TaskAnalysisParameter = 0;
//     TaskScore = 0;
//     TotalScore = 0;
//     RD_SAFE_BUTTON = null;
//     RT_SAFE_BUTTON = null;
//
//     PL_PATTERN_RND_COMMON_BTN = null;
//     DFE_PATTERN_RND_NUMBER = null;
//
//     DFE_PATTERN_SIDE = null;
//
//     PL_PATTERN_FR_SIDES = {};
//     PL_PATTERN_RARE = null;
//     PL_PATTERN_FREQUENT = null;
//     PL_PATTERN_SIDES = {};
//
//     CHECKS_TASK_SCORE = 0;
// };

const spaceBarText = () => GameSetting.language === 'German'? 'Drücken Sie die Leertaste um fortzufahren' : 'Press space bar to continue';

const sidesText = side => {
    const sides = {
        left: {
            English: 'left',
            German: 'linke',
        },
        right: {
            English: 'right',
            German: 'rechte',
        }
    };
    return sides[side.toLowerCase()][GameSetting.language];
};

const Vertical_Template = ({header, mode, left_class, right_class, msg, left_value, right_value, total_points, button_click, button_prevent, show_space_bar}) => {

    if (!button_prevent)
        TrialResponseTime = Date.now();

    return (
        <div
            className='pl_pattern-game-board'
            // className={(mode === 'CHECK' ? 'ct3-check-game-board-ver' : 'pl_pattern-game-board')}
            style={{
                gridTemplateRows: mode === 'CHECK'? 'max-content max-content 15% max-content 15%' : 'max-content 15% max-content 15%',
                rowGap: 20,
                // marginTop: mode === 'CHECK'? 20 : 0,
                padding: 50
            }}
        >
            {mode === 'CHECK' && (
                <div
                  style={{maxWidth: '90%', margin: 'auto'}}
                  className={'ct3-pl-check'}
                >
                    {header}
                </div>
            )}


            <button
                className={left_class + ' ct3-game-board-btn ct3-btn-size ' + (button_prevent ? 'prevent-events' : '')}
                value='LEFT'
                onClick={e => button_click(e, 'LEFT')}
                onKeyDown={e => e.preventDefault()}
            >
                {left_value}
            </button>

            {
                // mode !== 'CHECK' && (
                <label className={'pl_pattern-game-board-message feedback ' + (msg === null || mode === 'CHECK' ? 'hide-me' : '')}>
                    {msg !== null && msg}
                </label>
                // )
            }

            <button
                className={right_class + ' ct3-game-board-btn ct3-btn-size ' + (button_prevent ? 'prevent-events' : '')}
                value='RIGHT'
                onClick={e => button_click(e, 'RIGHT')}
                onKeyDown={e => e.preventDefault()}
            >
                {right_value}
            </button>

            <label
              style={{
                  alignSelf: 'center'
              }}
                className={'game-board-space ' + (show_space_bar ? '' : 'hide-me')}
            >

                {spaceBarText()}
            </label>
        </div>
    )
}

const Horizontal_Template = ({header, mode, left_class, right_class, msg, left_value, right_value, button_click, button_prevent, show_space_bar}) => {
    if (!button_prevent)
        TrialResponseTime = Date.now();

    return (
        <div
          className='dfe-game-board'
            // className={(mode === 'CHECK' ? 'ct3-check-game-board-hor' : 'dfe-game-board')}
        >
            {mode === 'CHECK' && (
                <div
                  style={{maxWidth: '90%', margin: 'auto'}}
                    className={'ct3-pl-check'}
                >
                    {header}
                </div>
            )}

            <div
                className={(mode === 'CHECK' ? 'ct3-check-game-board-hor-btns' : 'dfe-game-board-btns')}
            >
                <button
                    className={left_class + ' ct3-game-board-btn ct3-btn-size ' + (button_prevent ? 'prevent-events' : '')}
                    value='LEFT'
                    onClick={e => button_click(e, 'LEFT')}
                    onKeyDown={e => e.preventDefault()}
                >
                    {left_value}
                </button>

                <button
                    className={right_class + ' ct3-game-board-btn ct3-btn-size ' + (button_prevent ? 'prevent-events' : '')}
                    value='RIGHT'
                    onClick={e => button_click(e, 'RIGHT')}
                    onKeyDown={e => e.preventDefault()}
                >
                    {right_value}
                </button>
            </div>

            {
                // mode !== 'CHECK' && (
                <div className={'pl_pattern-game-board-message ' + (mode !== 'CHECK' ? ' dfe-game-board-message ' : '') + (msg === null || mode === 'CHECK'? 'hide-me' : '')}>
                    {
                        msg !== null ? msg :
                            (
                                <Fragment>
                                    <label>--</label>
                                    <label>--</label>
                                </Fragment>
                            )
                    }
                </div>
                // )
            }

            <label
              style={{
                  alignSelf: 'center'
              }}
                className={'game-board-space space_ver ' + (show_space_bar ? '' : 'hide-me')}
            >
                {spaceBarText()}
            </label>
        </div>
    )
}

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {

        return (
            <div
                className='sp-message-mode ct3-message-mode'
            >
                {this.props.Message}
                <button
                    onClick={() => this.props.Forward()}
                    onKeyDown={e => e.preventDefault()}
                    style={{margin: 'auto'}}
                >{this.props.Button}</button>
            </div>
        )
    }
}

class SupportTools extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            selected: null
        };

        this.Forward = this.props.Forward;
        this.select_answer = this.select_answer.bind(this);
        this.next = this.next.bind(this);
    }

    componentDidMount() {
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'S.T',   //start task
            type: 'LogGameType',
            more_params: {
                part: 'ST', //SupportTools
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
    }

    next() {
        let line = {
            Value: this.state.selected,
            Date: getTimeDate().date,
        };

        this.props.insertLineCustomTable('SupportTools', line, 'object');

        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'E.T',   //start task
            type: 'LogGameType',
            more_params: {
                part: 'ST', //SupportTools
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});

        this.Forward();
    }

    select_answer(answer){
        this.setState({
            selected: answer
        });
    }

    support_tools(){
        return (
            <div
                className='ct3-support-tools'
            >
                <label style={{fontSize: 'x-large', width: '100%', textAlign: 'center'}}>
                    {
                        GameSetting.language === 'German' ?
                          'Herzlichen Glückwunsch, Sie haben alle Aufgaben abgeschlossen! Bitte beantworten Sie noch eine letzte Frage:' :
                          'Congratulations, you finished the tasks! Please answer one last question'
                    }
                </label>
                <div
                    className='ct2-support-tools-d1'
                >
                    <div>
                        <label
                          style={{marginBottom: 30}}
                        >
                            {
                                GameSetting.language === 'German' ?
                                  'Haben Sie während der Studie irgendwelche Hilfsmittel (wie Stift und Papier) benutzt?' :
                                  'Did you use any support tools (such as paper and writing materials) during the study?'
                            }
                        </label>
                        <label>
                            {
                                GameSetting.language === 'German' ?
                                  'Bitte beantworten Sie diese Frage aufrichtig – Ihre Antwort wird sich nicht auf die Bezahlung auswirken.' :
                                  'Please respond earnestly – your responses will not affect your payment for the study.'
                            }
                        </label>
                    </div>
                </div>

                <div
                    className='ct2-support-tools-d2'
                >
                    <button
                        className={'ct2-support-tools-yes ' + (this.state.selected === 'YES' ? 'ct2-selected-value' : '')}
                        onClick={e => this.select_answer('YES')}
                        onKeyDown={e => e.preventDefault()}
                    >
                        {GameSetting.language === 'German'? 'Ja' : 'Yes'}
                    </button>

                    <button
                        className={'ct2-support-tools-no ' + (this.state.selected === 'NO' ? 'ct2-selected-value' : '')}
                        onClick={e => this.select_answer('NO')}
                        onKeyDown={e => e.preventDefault()}
                    >
                        {GameSetting.language === 'German'? 'Nein' : 'No'}
                    </button>
                </div>

                <div
                    className={'ct2-support-tools-d3 '}
                >
                    <button
                        className={'ct2-support-tools-d3-btn ' + (this.state.selected === null ? 'disabledElem' : '') }
                        onClick={e => this.next()}
                        onKeyDown={e => e.preventDefault()}
                    >
                        {GameSetting.language === 'German'? 'Weiter' : 'Next'}
                    </button>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Fragment>
                {this.support_tools()}
            </Fragment>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.Task = this.props.Task;
        this.Forward = this.props.Forward;
        this.endGame = this.props.endGame;

        this.CONSPIRACY_VALUES = (new Array(6)).fill('');
        this.GameBoard = this.Task.toLowerCase().includes('pl') ? Vertical_Template : Horizontal_Template;

        if (this.Task.toLowerCase().includes('pattern'))
            this.FeedBackDelay = this.props.game_settings.game.pattern_spacebar_time;
        else
            this.FeedBackDelay = this.props.game_settings.game[this.Task.toLowerCase() + '_feedback_sec'];

        let task_of = this.Task.toLowerCase().includes('pattern') ? 'pattern' : this.Task.toLowerCase();

        this.NumberOfTrials = Number(this.props.game_settings.game[task_of + '_number_of_trials']);

        if (this.Task === 'PL'){
            this.left_value = PL_LEFT_SIDE_PROB;
            this.right_value = PL_RIGHT_SIDE_PROB;
        }
        this.pattern = null;
        this.pattern_size = null;

        if (this.Task.includes('Pattern')){
            this.pattern = this.props.game_settings.game[this.Task.toLowerCase() + '_template'];
            this.pattern_size = this.pattern.length;
        }

        this.state = {
            trial: 1,
            no_action: false,
            button_prevent: false,
            show_space_bar: false,
            left_value_text: '',
            right_value_text: '',
            side_win: undefined,
            msg: null,
            rnd_number: '',
            left_class: '',
            right_class: '',
            isLoading: false
        };

        this.game = this.game.bind(this);
        this.nfc = this.nfc.bind(this);
        this.button_click = this.button_click.bind(this);
        this.go_next = this.go_next.bind(this);
        this.pl_task = this.pl_task.bind(this);
        this.rx_task = this.rx_task.bind(this);
        this.dfe_pattern_task = this.dfe_pattern_task.bind(this);
        this.pl_pattern_task = this.pl_pattern_task.bind(this);
        this.continueNFC = this.continueNFC.bind(this);

        this.isNowVisible = false;

        this.TasksLink = {
            PL: this.pl_task,
            RT: this.rx_task,
            RD: this.rx_task,
            DFE_Pattern: this.dfe_pattern_task,
            PL_Pattern: this.pl_pattern_task,
        }

        this.LoggerTimeOut = null;

        TaskScore = 0;
        TaskAnalysisParameter = 0;

        if (GameSetting.language === 'German'){
            this.PL_LooseMsg = ['Falsch! Die ', ' Schaltfläche hat sich blau gefärbt. Sie haben ', '0' ,'  Punkte verdient.'];
            this.PL_WinMsg = ['Richtig! Die ', ' Schaltfläche hat sich blau gefärbt. Sie haben ', '1' ,' Punkt verdient.'];
            this.RX_WinMsg = ['Sie haben die ', ' Schaltfläche gewählt und ', ' Punkt', ' Hätten Sie die andere Schaltfläche gewählt, hätten Sie ', ' Punkt'];
        }
        else {
            this.PL_LooseMsg = ['Wrong! The ', ' button turned blue. You got ', '0' ,' points.'];
            this.PL_WinMsg = ['Correct! The ', ' button turned blue. You got ', '1' ,' point.'];
            this.RX_WinMsg = ['You chose the ', ' button and got ', ' point', 'Had you selected the other key your payoff would have been ', ' point'];
        }
    }

    componentDidMount() {
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'S.T',   //start task
            type: 'LogGameType',
            more_params: {
                part: 'G', //task check
                task: this.Task,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.Task !== this.props.Task){
            this.Task = this.props.Task;
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'S.T',   //start task
                type: 'LogGameType',
                more_params: {
                    part: 'G', //task check
                    more: 'cdu', //componentDidUpdate
                    task: this.Task,
                    local_t: getTimeDate().time,
                    local_d: getTimeDate().date,
                },
            }).then((res) => {});
            this.setState({
                trial: 1,
                no_action: false,
                button_prevent: false,
                show_space_bar: false,
                left_value_text: '',
                right_value_text: '',
                msg: null,
                rnd_number: '',
                left_class: '',
                right_class: ''
            });
        }
    }

    pl_task(side_selected, rnd_number){
        let prob = this[side_selected.toLowerCase() + '_value'];

        let side_win = null;

        if (side_selected === 'LEFT'){
            if (this.left_value > this.right_value){
                if(prob>=rnd_number){
                    side_win = side_selected;
                }
            }
            else {
                if(rnd_number>=this.right_value){
                    side_win = side_selected;
                }
            }
        }
        else {
            if (this.right_value > this.left_value){
                if(prob>=rnd_number){
                    side_win = side_selected;
                }
            }
            else {
                if(rnd_number>=this.left_value){
                    side_win = side_selected;
                }
            }
        }

        let convert_sides = side_selected === 'LEFT' ? 'UP' : 'DOWN';

        let usr_choise = side_selected === 'LEFT' ? 0 : 1;

        let Frequent = PL_RND_COMMON_BTN === 0 ? 'UP' : 'DOWN';
        let Rare = PL_RND_COMMON_BTN === 0 ? 'DOWN' : 'UP';

        let Choice, TrueValue;

        if (convert_sides === 'UP') {
            if ( Frequent === 'UP'){
                Choice = 'F';
            }
            else {
                Choice = 'R';
            }
        }
        else {
            if ( Frequent === 'UP'){
                Choice = 'R';
            }
            else {
                Choice = 'F';
            }
        }

        let choice_ana = PL_RND_COMMON_BTN === usr_choise ? 1 : 0;

        if (choice_ana === 1)
            TaskAnalysisParameter++;


        let msg;
        let trial_score;
        if(side_win){
            trial_score = 1;
            if (convert_sides === Frequent)
                TrueValue = 'F';
            else if (convert_sides === Rare)
                TrueValue = 'R';

            TaskScore++;
            TotalScore++;
            let key = side_selected === 'LEFT' ? 'upper' : 'lower';
            msg = (
                <Fragment>
                    {/*pl_task*/}
                    <span className='correct_feedback'>{this.PL_WinMsg[0]} {upperLowerText(key)} {this.PL_WinMsg[1]} {this.PL_WinMsg[2]} {this.PL_WinMsg[3]}</span>
                </Fragment>
            );
        }
        else {
            trial_score = 0;
            if (convert_sides === Frequent)
                TrueValue = 'R';
            else if (convert_sides === Rare)
                TrueValue = 'F';

            let key = side_selected === 'LEFT' ? 'lower' : 'upper';

            msg = (
                <Fragment>
                    <span className='in_correct_feedback'>{this.PL_LooseMsg[0]} {upperLowerText(key)} {this.PL_LooseMsg[1]} {this.PL_LooseMsg[2]} {this.PL_LooseMsg[3]}</span>
                </Fragment>
            );
        }

        let t_res;

        let left_class, right_class;

        if(side_selected === 'LEFT') {
            if (side_win) {
                left_class = 'ct3-pl-correct';
                right_class = 'ct3-pl-not-correct';
                t_res = 1;
            }
            else {
                t_res = 0;
                left_class = 'ct3-pl-not-correct';
                right_class = 'ct3-pl-correct';
            }
        }
        else {
            if (side_win) {
                t_res = 1;
                left_class = 'ct3-pl-not-correct';
                right_class = 'ct3-pl-correct';
            }
            else {
                t_res = 0;
                left_class = 'ct3-pl-correct';
                right_class = 'ct3-pl-not-correct';
            }
        }

        let pl_trial = {
            TaskOrder: GameTasks.join('-'),
            TaskNum: this.props.TaskNum,
            Task: this.Task,
            TrialNum: this.state.trial,
            TotalTrials: this.NumberOfTrials,
            ProbCommonBtn: GameSetting.pl_prob_common_button,
            Selected: convert_sides,
            Payoff: trial_score,
            TrueValue,
            Rare,
            Frequent,
            UpFrequent: Frequent === 'UP' ? 'TRUE' : 'FALSE',
            Choice,
            // UserChoice: usr_choise,
            TrialResult: t_res,
            TaskScore,
            TaskAnalysisParameter: TaskAnalysisParameter,
            UserResponseTime: Date.now() - TrialResponseTime,
            ElapsedTimeMil: Date.now() - START_MIL,
            Time: getTimeDate().time,
            Date: getTimeDate().date,
        };

        return {
            data: pl_trial,
            left_value: '',
            right_value: '',
            side_win,
            msg,
            left_class,
            right_class,
        };
    }

    pl_pattern_task(side_selected, rnd_number){
        const index = (this.state.trial - 1) % this.pattern.length;
        const pt = this.pattern[index];

        let pt_val;

        let convert_sides = side_selected === 'LEFT' ? 'UP' : 'DOWN';

        let msg;
        let left_class, right_class;
        if(PL_PATTERN_FR_SIDES[pt] === convert_sides){
            let key = side_selected === 'LEFT' ? 'upper' : 'lower';
            msg = (
                <Fragment>
                    <span className='correct_feedback'>{this.PL_WinMsg[0]} {upperLowerText(key)} {this.PL_WinMsg[1]} {this.PL_WinMsg[2]} {this.PL_WinMsg[3]}</span>
                </Fragment>
            );

            pt_val = 1;

            if (side_selected === 'LEFT'){
                left_class = 'ct3-pl-correct';
                right_class = 'ct3-pl-not-correct';
            }
            else {
                left_class = 'ct3-pl-not-correct';
                right_class = 'ct3-pl-correct';
            }

        }
        else {
            let key = side_selected === 'LEFT' ? 'lower' : 'upper';
            msg = (
                <Fragment>
                    {/*{this.PL_LooseMsg[0]}<span style={{color:'red'}}>{key}</span>{this.PL_LooseMsg[1]}<span style={{color:'red'}}>{this.PL_LooseMsg[2]}</span>{this.PL_LooseMsg[3]}*/}
                    <span className='in_correct_feedback'>{this.PL_LooseMsg[0]} {upperLowerText(key)} {this.PL_LooseMsg[1]} {this.PL_LooseMsg[2]} {this.PL_LooseMsg[3]}</span>

                    {/*{this.PL_LooseMsg[0]}<span style={{color:'red'}}>{key}</span>{this.PL_LooseMsg[1]}*/}
                </Fragment>
            );
            pt_val = 0;

            if (side_selected === 'LEFT'){
                left_class = 'ct3-pl-not-correct';
                right_class = 'ct3-pl-correct';
            }
            else {
                left_class = 'ct3-pl-correct';
                right_class = 'ct3-pl-not-correct';
            }
        }

        TaskScore += pt_val;
        TotalScore += pt_val;

        let Choice;
        if (convert_sides === 'UP') {
            if ( PL_PATTERN_FREQUENT === 'UP'){
                Choice = 'F';
            }
            else {
                Choice = 'R';
            }
        }
        else {
            if ( PL_PATTERN_FREQUENT === 'UP'){
                Choice = 'R';
            }
            else {
                Choice = 'F';
            }
        }

        let TrueValue = PL_PATTERN_FR_SIDES[pt] === PL_PATTERN_FREQUENT ? 'F' : 'R';

        let pl_pattern_trial = {
            TaskOrder: GameTasks.join('-'),
            TaskNum: this.props.TaskNum,
            Task: this.Task,
            TrialNum: this.state.trial,
            TotalTrials: this.NumberOfTrials,
            PatternSize: this.pattern_size,
            PatternTemplate: this.pattern.join('-'),
            Selected: convert_sides,
            Payoff: pt_val,
            TrueValue,
            Choice,
            Rare: PL_PATTERN_RARE,
            Frequent: PL_PATTERN_FREQUENT,
            UpFrequent: PL_PATTERN_FREQUENT === 'UP' ? 'TRUE' : 'FALSE',
            TaskScore,
            UserResponseTime: Date.now() - TrialResponseTime,
            ElapsedTimeMil: Date.now() - START_MIL,
            Time: getTimeDate().time,
            Date: getTimeDate().date,
        };

        return {
            data: pl_pattern_trial,
            left_value: '',
            right_value: '',
            side_win: null,
            msg,
            left_class,
            right_class,
        };

    }

    rx_task(side_selected, rnd_number){

        let left_key, right_key, risk_key;

        if (this.props.game_settings.game[ this.Task.toLowerCase() + '_rare_prob'] >= rnd_number){
            risk_key = this.props.game_settings.game[ this.Task.toLowerCase() + '_risk_rare_value'];
        }
        else {
            risk_key = this.props.game_settings.game[ this.Task.toLowerCase() + '_risk_common_value'];
        }

        let SafeButton = this.Task === 'RT' ? RT_SAFE_BUTTON : RD_SAFE_BUTTON;

        let RightSafe;
        let Choice = side_selected === SafeButton ? 'SAFE' : 'RISK';

        let ObtainedPayoff = side_selected === SafeButton ? this.props.game_settings.game[ this.Task.toLowerCase() + '_safe_value'] : risk_key;
        let ForgonePayoff = side_selected === SafeButton ? risk_key : this.props.game_settings.game[ this.Task.toLowerCase() + '_safe_value'];

        if(SafeButton === 'LEFT'){
            left_key = this.props.game_settings.game[ this.Task.toLowerCase() + '_safe_value'];
            right_key = risk_key;

            RightSafe = 'FALSE';
        }
        else {
            right_key = this.props.game_settings.game[ this.Task.toLowerCase() + '_safe_value'];
            left_key = risk_key;

            RightSafe = 'TRUE';
        }

        right_key = Number(right_key);
        left_key = Number(left_key);

        let val, other_val;
        if( side_selected === 'LEFT'){
            TaskScore+=left_key;
            TotalScore+=left_key;
            val = left_key;
            other_val = right_key;
        }
        else {
            TaskScore+=right_key;
            TotalScore+=right_key;
            val = right_key;
            other_val = left_key;
        }

        let usr_choise = SafeButton === side_selected ? 0 : 1;

        if (usr_choise === 1)
            TaskAnalysisParameter++;

        let msg = (
            <Fragment>
                <label>
                    {this.RX_WinMsg[0]}
                    <span style={{color:'red'}}
                    >
                        {sidesText(side_selected)}
                    </span>
                    {this.RX_WinMsg[1]}
                    <span style={{color:'red'}}>{val}</span>
                    {(((Number(val) === 1) || (Number(val) === -1)) ?
                      (GameSetting.language === 'German'? `${this.RX_WinMsg[2]} verdient` : this.RX_WinMsg[2]) :
                      (this.RX_WinMsg[2]+(GameSetting.language === 'German'? 'e verdient' : 's')))}.<br/>
                </label>
                <label>
                    {this.RX_WinMsg[3]}
                    <span style={{color:'red'}}>{other_val}</span>
                    {(((Number(other_val) === 1) || (Number(other_val) === -1)) ? (GameSetting.language === 'German'? `${this.RX_WinMsg[4]} verdient` : this.RX_WinMsg[4]) : (this.RX_WinMsg[4]+(GameSetting.language === 'German'? 'e verdient' : 's')))}.
                </label>
            </Fragment>
        );

        let rx_trial = {
            TaskOrder: GameTasks.join('-'),
            TaskNum: this.props.TaskNum,
            Task: this.Task,
            TrialNum: this.state.trial,
            TotalTrials: this.NumberOfTrials,
            SafeOutcome: SafeButton,
            Selected: side_selected,
            RiskyPayoff: risk_key,
            RightSafe,
            Choice,
            ObtainedPayoff,
            ForgonePayoff,
            // CommonButton: -1,
            // UserChoice: usr_choise,
            // TrialResult: risk_key,
            TaskScore,
            TaskAnalysisParameter: TaskAnalysisParameter,
            UserResponseTime: Date.now() - TrialResponseTime,
            ElapsedTimeMil: Date.now() - START_MIL,
            Time: getTimeDate().time,
            Date: getTimeDate().date,
        };

        return {
            data: rx_trial,
            left_value: left_key,
            right_value: right_key,
            side_win: null,
            msg,
            left_class: side_selected === 'LEFT' ? 'ct3-rx-selected-btn' : 'ct3-rx-unselected-btn',
            right_class: side_selected === 'RIGHT' ? 'ct3-rx-selected-btn' : 'ct3-rx-unselected-btn',
        };
    }

    dfe_pattern_task(side_selected, rnd_number){
        const index = (this.state.trial - 1) % this.pattern.length;
        const pt = this.pattern[index];
        let pt_val = pt === 'H' ? this.props.game_settings.game.dfe_pattern_high_risky_value : this.props.game_settings.game.dfe_pattern_low_risky_value;

        pt_val = Number(pt_val);

        let left_value, right_value;

        if (side_selected === DFE_PATTERN_SIDE){
            TaskScore+= pt_val;
            TotalScore+= pt_val;
            if (side_selected === 'LEFT'){
                left_value = pt_val;
                right_value = Number(this.props.game_settings.game.dfe_pattern_safe_outcome);
            }
            else {
                left_value = Number(this.props.game_settings.game.dfe_pattern_safe_outcome);
                right_value = pt_val;
            }
        }
        else {
            TaskScore+= Number(this.props.game_settings.game.dfe_pattern_safe_outcome);
            TotalScore+= Number(this.props.game_settings.game.dfe_pattern_safe_outcome);
            if (side_selected === 'LEFT'){
                left_value = Number(this.props.game_settings.game.dfe_pattern_safe_outcome);
                right_value = pt_val;
            }
            else {
                left_value = pt_val;
                right_value = Number(this.props.game_settings.game.dfe_pattern_safe_outcome);
            }
        }

        let ChoiceWithPattern;

        let Choice = side_selected === DFE_PATTERN_SIDE ? 'RISK' : 'SAFE';

        let RightSafe = DFE_PATTERN_SIDE === 'LEFT' ? 'TRUE' : 'FALSE';
        let RiskyPayoff = pt_val;


        let ObtainedPayoff = side_selected === DFE_PATTERN_SIDE ? pt_val : this.props.game_settings.game.dfe_pattern_safe_outcome;
        let ForgonePayoff = side_selected === DFE_PATTERN_SIDE ? this.props.game_settings.game.dfe_pattern_safe_outcome : pt_val;

        if (Choice === 'RISK' && ObtainedPayoff === this.props.game_settings.game.dfe_pattern_high_risky_value) ChoiceWithPattern = 1;
        else if (Choice === 'RISK' && ObtainedPayoff === this.props.game_settings.game.dfe_pattern_low_risky_value) ChoiceWithPattern = 0;
        else if (Choice === 'SAFE' && ForgonePayoff === this.props.game_settings.game.dfe_pattern_high_risky_value) ChoiceWithPattern = 0;
        else if (Choice === 'SAFE' && ForgonePayoff === this.props.game_settings.game.dfe_pattern_low_risky_value) ChoiceWithPattern = 1;


        let val, other_val;
        if( side_selected === 'LEFT'){
            val = left_value;
            other_val = right_value;
        }
        else {
            val = right_value;
            other_val = left_value;
        }

        let msg = (
            <Fragment>
                <label>{this.RX_WinMsg[0]}<span style={{color:'red'}}>{sidesText(side_selected)}</span>{this.RX_WinMsg[1]}<span style={{color:'red'}}>{val}</span>{(((Number(val) === 1) || (Number(val) === -1)) ? (GameSetting.language === 'German'? `${this.RX_WinMsg[2]} verdient` : this.RX_WinMsg[2]) : (this.RX_WinMsg[2]+(GameSetting.language === 'German'? 'e verdient' : 's')))}.<br/></label>
                <label>{this.RX_WinMsg[3]}<span style={{color:'red'}}>{other_val}</span>{(((Number(other_val) === 1) || (Number(other_val) === -1)) ? (GameSetting.language === 'German'? `${this.RX_WinMsg[4]} verdient` : this.RX_WinMsg[4]) : (this.RX_WinMsg[4]+(GameSetting.language === 'German'? 'e verdient' : 's')))}.</label>
            </Fragment>
        );

        // ChoiceWithPattern: undefined
        // ForgonePayoff: undefined
        // RiskyPayoff: undefined

        let rx_trial = {
            TaskOrder: GameTasks.join('-'),
            TaskNum: this.props.TaskNum,
            Task: this.Task,
            TrialNum: this.state.trial,
            TotalTrials: this.NumberOfTrials,
            SafeOutcome: this.props.game_settings.game.dfe_pattern_safe_outcome,
            PatternSize: this.pattern_size,
            PatternTemplate: this.pattern.join('-'),
            Selected: side_selected,
            RiskyPayoff,
            RightSafe,
            Choice,
            ObtainedPayoff,
            ForgonePayoff,
            ChoiceWithPattern,
            H: this.props.game_settings.game.dfe_pattern_high_risky_value,
            L: this.props.game_settings.game.dfe_pattern_low_risky_value,
            TaskScore,
            UserResponseTime: Date.now() - TrialResponseTime,
            ElapsedTimeMil: Date.now() - START_MIL,
            Time: getTimeDate().time,
            Date: getTimeDate().date,
        };

        return {
            data: rx_trial,
            left_value,
            right_value,
            side_win: null,
            msg,
            left_class: side_selected === 'LEFT' ? 'ct3-rx-selected-btn' : 'ct3-rx-unselected-btn',
            right_class: side_selected === 'RIGHT' ? 'ct3-rx-selected-btn' : 'ct3-rx-unselected-btn',
        };

    }

    button_click(e, side) {
        e.preventDefault();

        $(e.target).blur();

        let rnd_number = Math.random();
        rnd_number = Math.floor(rnd_number * 1000) / 1000;
        let trial_info = this.TasksLink[this.Task](side, rnd_number);

        this.props.insertTaskGameLine(this.Task, trial_info.data);
        if (GAME_RECORDS[this.Task] === undefined)
            GAME_RECORDS[this.Task] = [];

        GAME_RECORDS[this.Task].push(trial_info.data);

        this.setState({
            button_prevent: true,
            left_value_text: trial_info.left_value,
            right_value_text: trial_info.right_value,
            msg: trial_info.msg,
            side_win: trial_info.side_win,
            rnd_number,
            left_class: trial_info.left_class,
            right_class: trial_info.right_class,

        }, () => {
            setTimeout(() => {
                this.setState({
                    show_space_bar: true
                });

                document.onkeydown = this.go_next;
            }, this.FeedBackDelay * 1000);
        })
    }

    go_next(event) {
        if (event.keyCode === 32) {
            document.onkeydown = null;
            if (this.NumberOfTrials === this.state.trial) {
                clearInterval(this.LoggerTimeOut);
                NewLogs({
                    user_id: UserId,
                    exp: ThisExperiment,
                    running_name: RunningName,
                    action: 'F.T',   //start task
                    type: 'LogGameType',
                    more_params: {
                        part: 'G', //Game
                        task: this.Task,
                        local_t: getTimeDate().time,
                        local_d: getTimeDate().date,
                    },
                }).then((res) => {});
                let sc = this.state;
                sc.isLoading = true;
                this.setState(sc, () => {
                    this.props.sendGameDataToDB().then(
                        () => {
                            NewLogs({
                                user_id: UserId,
                                exp: ThisExperiment,
                                running_name: RunningName,
                                action: 'T.S',
                                type: 'LogGameType',
                                more_params: {
                                    part: this.Task,
                                    local_t: getTimeDate().time,
                                    local_d: getTimeDate().date,
                                },
                            }).then((res) => {});

                            this.Forward();
                        }
                    );
                });
            } else {
                let sc = this.state;
                sc.trial++;
                sc.button_prevent = false;
                sc.show_space_bar = false;
                sc.left_value_text = '';
                sc.right_value_text = '';
                sc.msg = null;
                sc.side_win = null;
                sc.rnd_number = '';
                sc.left_class = '';
                sc.right_class = '';
                this.setState(sc);
            }
        }
    }

    game() {
        this.needToCheck = true;
        return (
            <Fragment>
                {this.GameBoard({
                    header: null,
                    total_points: TaskScore,
                    button_click: this.button_click,
                    button_prevent: this.state.button_prevent,
                    show_space_bar: this.state.show_space_bar,
                    left_value: this.state.left_value_text,
                    right_value: this.state.right_value_text,
                    msg: this.state.msg,
                    side_win: this.state.side_win,
                    left_class: this.state.left_class,
                    right_class: this.state.right_class,
                    mode: 'GAME'
                })}
            </Fragment>
        )
    }

    SelectAnswer(e, ques_number) {
        // DB_RECORDS.game.CONSPIRACY[ques_number - 1] = e.target.value;
        this.CONSPIRACY_VALUES[ques_number - 1] = e.target.value;
    }

    continueNFC() {
        let error = false;
        for (let i=0; i<this.CONSPIRACY_VALUES.length; i++){
            if (this.CONSPIRACY_VALUES[i] === ''){
                error = true;
                break;
            }
        }

        if (error)
            window.alert('Please answer all questions')
        else {

            let nfc_rec = {
                TaskOrder: GameTasks.join('-'),
                TaskNum: this.props.TaskNum,
                Task: this.Task,
            }


            for (let i=0; i<this.CONSPIRACY_VALUES.length; i++){
                nfc_rec['q'+ (i+1)] = this.CONSPIRACY_VALUES[i];
            }

            nfc_rec['Time'] = getTimeDate().time;
            nfc_rec['Date'] = getTimeDate().date;

            this.props.insertTaskGameLine('Conspiracy', nfc_rec);

            this.Forward();
        }

    }

    QuesBar = (ques_number, ques) => {
        return (
            <div
                className='ct3-ques-bar'
            >
                <label>{ques_number}{ques}</label>
                <table>
                    <thead>
                    <tr>
                        <th>
                            <input type="radio" value={0} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                        <th>
                            <input type="radio" value={10} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                        <th>
                            <input type="radio" value={20} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                        <th>
                            <input type="radio" value={30} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                        <th>
                            <input type="radio" value={40} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                        <th>
                            <input type="radio" value={50} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                        <th>
                            <input type="radio" value={60} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                        <th>
                            <input type="radio" value={70} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                        <th>
                            <input type="radio" value={80} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                        <th>
                            <input type="radio" value={90} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                        <th>
                            <input type="radio" value={100} name={ques_number}
                                   style={{textAlign: 'center'}}
                                   onChange={e => this.SelectAnswer(e, ques_number)}
                            />
                        </th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <div>
                                <label>0%</label>
                                <label>certainly not</label>
                            </div>
                        </td>
                        <td>
                            <div>
                                <label>10%</label>
                                <label>extremely unlikely</label>
                            </div>
                        </td>
                        <td>
                            <div>
                                <label>20%</label>
                                <label>very unlikely</label>
                            </div>
                        </td>
                        <td>
                            <div>
                                <label>30%</label>
                                <label>unlikely</label>
                            </div>
                        </td>
                        <td>
                            <div>
                                <label>40%</label>
                                <label>somewhat unlikely</label>
                            </div>
                        </td>
                        <td>
                            <div>
                                <label>50%</label>
                                <label>undecided</label>
                            </div>
                        </td>
                        <td>
                            <div>
                                <label>60%</label>
                                <label>somewhat likely</label>
                            </div>
                        </td>

                        <td>
                            <div>
                                <label>70%</label>
                                <label>likely</label>
                            </div>
                        </td>

                        <td>
                            <div>
                                <label>80%</label>
                                <label>very likely</label>
                            </div>
                        </td>

                        <td>
                            <div>
                                <label>90%</label>
                                <label>extremely likely</label>
                            </div>
                        </td>

                        <td>
                            <div>
                                <label>100%</label>
                                <label>certain</label>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    };

    nfc() {
        return (
            <div className='ct3-nfc-task'>
                <label className='ct3-nfc-task-head'>Questionnaire</label>
                <label className='ct3-nfc-task-l1'>For each of the statements below, please use the respective rating scale to indicate how likely it is in your opinion that the statement is true. There are no “objectively” right or wrong answers and we are interested in your personal opinion. Your responses cannot be linked to you during the analysis and will be used only for the purpose of the current study.</label>
                <label className='ct3-nfc-task-l2'>I think that…</label>
                {this.QuesBar(1, '… many very important things happen in the world, which the public is never informed about.')}
                {this.QuesBar(2, '… politicians usually do not tell us the true motives for their decisions.')}
                {this.QuesBar(3, '… government agencies closely monitor all citizens.')}
                {this.QuesBar(4, '… events which superficially seem to lack a connection are often the result of secret activities.')}
                {this.QuesBar(5, '… there are secret organizations that greatly influence political decisions.')}
                {this.QuesBar(6, '… the virus that causes COVID-19 was created in the laboratory on purpose.')}

                <button
                    onClick={() => this.continueNFC()}
                    onKeyDown={e => e.preventDefault()}
                >
                    {GameSetting.language === 'German'? 'Weiter' : 'Continue'}
                </button>
            </div>
        );
    }

    render() {
        if (this.state.isLoading)
            return <WaitForAction2 />;

        return (
            <div
                className='ct3-game-mode'
            >
                {this.Task.toLowerCase() === 'conspiracy' ? this.nfc() : this.game()}
            </div>
        )
    }
}

class TaskCheck extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.Task = this.props.Task;
        this.Forward = this.props.Forward;
        this.endGame = this.props.endGame;

        if (this.Task.toLowerCase().includes('pl')){
            this.left_value = 1;
            this.right_value = 0;
            this.GameBoard = Vertical_Template;
        }
        else {
            if (GameSetting.language === 'German'){
                this.left_value = 0;
                this.right_value = -10;
            }
            else {
                this.left_value = 28;
                this.right_value = 16;
            }

            this.GameBoard = Horizontal_Template;
        }

        this.state = {
            no_action: false,
            button_prevent: true,
            show_space_bar: false,
            left_value_text: '',
            right_value_text: '',
            msg: null,
            left_class: 'disabledElem',
            right_class: 'disabledElem'
        };

        this.button_click = this.button_click.bind(this);
        this.go_next = this.go_next.bind(this);
        this.pl_task = this.pl_task.bind(this);
        this.rx_task = this.rx_task.bind(this);

        TaskScore = 0;

        this.isNowVisible = false;

        this.TasksLink = {
            PL: this.pl_task,
            RD: this.rx_task,
        }


        this.getLangMessages();

        this.RT_MSG =(
            <Fragment>
                <label>Note:</label>
                <label>In this round, the left button will earn you 28 points and the right button will earn you 16 points.</label>
                <label>Please make your choice.</label>
            </Fragment>
        );
    }

    getLangMessages(){
        const PL_MSG_ENG = (<p>Note: In this round, the upper button will turn blue and earn you 1 point, the lower button will earn you 0 points. Please make your choice.</p>);

        const PL_MSG_DE = (<p>
              Bitte beachten Sie: In diesem Durchgang wird sich die obere Schaltfläche blau färben und durch
              klicken auf diese obere Schaltfläche verdienen Sie 1 Punkt; durch klicken auf die untere Schaltfläche
              verdienen Sie 0 Punkte. Bitte treffen Sie eine Entscheidung.
          </p>);

        const RD_MSG_ENG =(<p>Note: In this round, the left button will earn you 28 points and the right button will earn you 16 points. Please make your choice.</p>);

        const RD_MSG_DE =(<p>Bitte beachten Sie: In diesem Durchgang wird die linke Schaltfläche 0 Punkte und die rechte -10 Punkte auszahlen. Bitte treffen Sie eine Entscheidung.</p>);

        if (GameSetting.language === 'German'){
            this.PL_MSG = PL_MSG_DE;
            this.RD_MSG = RD_MSG_DE;
        }
        else {
            this.PL_MSG = PL_MSG_ENG;
            this.RD_MSG = RD_MSG_ENG;
        }
    }

    componentDidMount() {
        NewLogs({
            user_id: UserId,
            exp: ThisExperiment,
            running_name: RunningName,
            action: 'S.T',   //start task
            type: 'LogGameType',
            more_params: {
                part: 'T_C', //task check
                task: this.Task,
                local_t: getTimeDate().time,
                local_d: getTimeDate().date,
            },
        }).then((res) => {});

        setTimeout(() => {
            this.setState({
                button_prevent: false,
                left_class: '',
                right_class: ''
            });
        }, 3500);
    }

    pl_task(side_selected, rnd_number){
        let prob = this[side_selected.toLowerCase() + '_value'];

        let side_win = null;

        if (side_selected === 'LEFT'){
            if (this.left_value > this.right_value){
                if(prob>=rnd_number){
                    side_win = side_selected;
                }
            }
            else {
                if(rnd_number>=this.right_value){
                    side_win = side_selected;
                }
            }
        }
        else {
            if (this.right_value > this.left_value){
                if(prob>=rnd_number){
                    side_win = side_selected;
                }
            }
            else {
                if(rnd_number>=this.left_value){
                    side_win = side_selected;
                }
            }
        }


        let usr_choise = side_selected === 'LEFT' ? 0 : 1;

        let choice_ana = PL_RND_COMMON_BTN === usr_choise ? 1 : 0;

        if (choice_ana === 1)
            TaskAnalysisParameter++;


        let msg;
        if(side_win){
            TaskScore++;
            let key = side_selected === 'LEFT' ? 'upper' : 'lower';
            msg = (
                <Fragment>
                    {/*pl_task*/}
                    {this.PL_WinMsg[0]}<span style={{color:'red'}}>{upperLowerText(key)}</span>{this.PL_WinMsg[1]}
                </Fragment>
            );
        }
        else {
            let key = side_selected === 'LEFT' ? 'lower' : 'upper';
            msg = (
                <Fragment>
                    {this.PL_LooseMsg[0]}<span style={{color:'red'}}>{upperLowerText(key)}</span>{this.PL_LooseMsg[1]}
                </Fragment>
            );
        }

        let t_res;

        let left_class, right_class;

        if(side_selected === 'LEFT') {
            if (side_win) {
                left_class = 'ct3-pl-correct';
                right_class = 'ct3-pl-not-correct';
                t_res = 1;
            }
            else {
                t_res = 0;
                left_class = 'ct3-pl-not-correct';
                right_class = 'ct3-pl-correct';
            }
        }
        else {
            if (side_win) {
                t_res = 0;
                left_class = 'ct3-pl-not-correct';
                right_class = 'ct3-pl-correct';
            }
            else {
                t_res = 1;
                left_class = 'ct3-pl-correct';
                right_class = 'ct3-pl-not-correct';
            }
        }


        let trial_score = t_res === usr_choise ? 1 : 0;

        let Frequent = PL_RND_COMMON_BTN === 0 ? 'UP' : 'DOWN';
        let Rare = PL_RND_COMMON_BTN === 0 ? 'DOWN' : 'UP';

        let pl_trial = {
            TaskOrder: GameTasks.join('-'),
            TaskNum: this.props.TaskNum,
            Frequent,
            Rare,
            TrialNum: this.state.trial,
            TotalTrials: this.NumberOfTrials,
            TaskAnalysisParameter: TaskAnalysisParameter,
            UserChoice: usr_choise,
            TrialResult: t_res,
            TrialScore: trial_score,
            TaskScore,
            UserResponseTime: Date.now() - TrialResponseTime,
            ElapsedTimeMil: Date.now() - START_MIL,
            Date: getTimeDate().date,
            Time: getTimeDate().time,
        };

        return {
            data: pl_trial,
            left_value: '',
            right_value: '',
            side_win,
            msg,
            left_class,
            right_class,
        };
    }

    rx_task(side_selected, rnd_number){

        let left_key, right_key, risk_key;

        if (this.props.game_settings.game[ this.Task.toLowerCase() + '_rare_prob'] >= rnd_number){
            risk_key = this.props.game_settings.game[ this.Task.toLowerCase() + '_risk_rare_value'];
        }
        else {
            risk_key = this.props.game_settings.game[ this.Task.toLowerCase() + '_risk_common_value'];
        }

        let SafeButton = this.Task === 'RT' ? RT_SAFE_BUTTON : RD_SAFE_BUTTON;

        if(SafeButton === 'LEFT'){
            left_key = this.props.game_settings.game[ this.Task.toLowerCase() + '_safe_value'];
            right_key = risk_key;

        }
        else {
            right_key = this.props.game_settings.game[ this.Task.toLowerCase() + '_safe_value'];
            left_key = risk_key;
        }

        let trial_score;

        left_key = Number(left_key);
        right_key = Number(right_key);
        risk_key = Number(risk_key);

        let val, other_val;
        if( side_selected === 'LEFT'){
            trial_score = left_key;
            TaskScore+=left_key;
            val = left_key;
            other_val = right_key;
        }
        else {
            trial_score = right_key;
            TaskScore+=right_key;
            val = right_key;
            other_val = left_key;
        }

        let usr_choise = SafeButton === side_selected ? 0 : 1;

        if (usr_choise === 1)
            TaskAnalysisParameter++;

        let msg = (
            <Fragment>
                <label>{this.RX_WinMsg[0]}<span style={{color:'red'}}>{sidesText(side_selected)}</span>{this.RX_WinMsg[1]}<span style={{color:'red'}}>{val}</span>{(((Number(val) === 1) || (Number(val) === -1)) ? (GameSetting.language === 'German'? `${this.RX_WinMsg[2]} verdient` : this.RX_WinMsg[2]) : (this.RX_WinMsg[2]+(GameSetting.language === 'German'? 'e verdient' : 's')))}.<br/></label>
                <label>{this.RX_WinMsg[3]}<span style={{color:'red'}}>{other_val}</span>{(((Number(other_val) === 1) || (Number(other_val) === -1)) ? (GameSetting.language === 'German'? `${this.RX_WinMsg[4]} verdient` : this.RX_WinMsg[4]) : (this.RX_WinMsg[4]+(GameSetting.language === 'German'? 'e verdient' : 's')))}.</label>
            </Fragment>
        );

        let rx_trial = {
            TaskOrder: GameTasks.join('-'),
            TaskNum: this.props.TaskNum,
            CommonButton: -1,
            TrialNum: '-',
            TotalTrials: '-',
            UserChoice: usr_choise,
            TrialResult: risk_key,
            TrialScore: trial_score,
            TaskAnalysisParameter: TaskAnalysisParameter,
            TaskScore,
            UserResponseTime: Date.now() - TrialResponseTime,
            ElapsedTimeMil: Date.now() - START_MIL,
            Date: getTimeDate().date,
            Time: getTimeDate().time,
        };

        return {
            data: rx_trial,
            left_value: left_key,
            right_value: right_key,
            side_win: null,
            msg,
            left_class: side_selected === 'LEFT' ? 'ct3-rx-selected-btn' : 'ct3-rx-unselected-btn',
            right_class: side_selected === 'RIGHT' ? 'ct3-rx-selected-btn' : 'ct3-rx-unselected-btn',
        };
    }

    button_click(e, side) {
        e.preventDefault();

        $(e.target).blur();

        let user_choice = side === 'LEFT' ? 1 : 2;
        let trial_score = user_choice === 1 ? 1 : 0;
        CHECKS_TASK_SCORE+=trial_score;

        let line = {
            Task: this.Task,
            UserChoice: user_choice,
            TrialScore: this[side.toLowerCase() + '_value'],
            TaskScore: CHECKS_TASK_SCORE,
            Time: getTimeDate().time,
            Date: getTimeDate().date,
        };

        this.props.insertLineCustomTable('ComprehensionChecks', line, 'array');

        let left_value = this.Task === 'PL' ? '' : this.left_value;
        let right_value = this.Task === 'PL' ? '' : this.right_value;

        let left_class, right_class;

        if (this.Task === 'PL'){
            left_class = 'ct3-pl-correct';
            right_class = 'ct3-pl-not-correct';
        }
        else {
            if (side === 'LEFT'){
                left_class = 'ct3-rx-selected-btn';
                right_class = 'ct3-rx-unselected-btn';
            }
            else {
                right_class = 'ct3-rx-selected-btn';
                left_class = 'ct3-rx-unselected-btn';
            }
        }

        this.setState({
            button_prevent: true,
            left_value_text: left_value,
            right_value_text: right_value,
            msg: null,
            side_win: null,
            rnd_number: null,
            left_class,
            right_class,

        }, () => {
            setTimeout(() => {
                this.setState({
                    show_space_bar: true
                });

                document.onkeydown = this.go_next;
            }, this.FeedBackDelay * 1000);
        })
    }

    go_next(event) {
        if (event.keyCode === 32) {
            document.onkeydown = null;
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'F.T',  //finish task
                type: 'LogGameType',
                more_params: {
                    task: this.Task,
                    part: 'T_C', //task check
                    local_t: getTimeDate().time,
                    local_d: getTimeDate().date,
                },
            }).then((res) => {});
            this.Forward();
        }
    }

    render() {
        return (
            <div
                className='ct3-game-mode'
            >
                {
                    this.GameBoard({
                        header: this[this.Task + '_MSG'],
                        total_points: TaskScore,
                        button_click: this.button_click,
                        button_prevent: this.state.button_prevent,
                        show_space_bar: this.state.show_space_bar,
                        left_value: this.state.left_value_text,
                        right_value: this.state.right_value_text,
                        msg: this.state.msg,
                        side_win: this.state.side_win,
                        left_class: this.state.left_class,
                        right_class: this.state.right_class,
                        mode: 'CHECK'
                    })
                }
            </div>
        )
    }
}

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        // ResetAll();

        this.insertGameLine = props.insertGameLine;
        this.game_settings = props.game_settings;
        GameSetting = this.game_settings.game;

        UserId = props.user_id;
        RunningName = props.running_name;
        GAME_RECORDS = {};
        this.state = {
            isa: props.isa,
            game_counter: 0,
            game_tasks_error: false,
            loading: true
        };

        this.props.SetLimitedTime(false);

        this.Forward = this.Forward.bind(this);
        this.initializeGame = this.initializeGame.bind(this);
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
        }).then((res) => this.initializeGame());
    }

    pl_init() {
        PL_RND_COMMON_BTN = Math.floor(Math.random() * 2);
        let high_prob = this.game_settings.game.pl_prob_common_button;
        let low_prob = 1 - high_prob;

        if(PL_RND_COMMON_BTN === 0){
            PL_LEFT_SIDE_PROB = Math.floor(high_prob * 1000) / 1000;
            PL_RIGHT_SIDE_PROB = Math.floor(low_prob * 1000) / 1000;
        }
        else {
            PL_LEFT_SIDE_PROB = Math.floor(low_prob * 1000) / 1000;
            PL_RIGHT_SIDE_PROB = Math.floor(high_prob * 1000) / 1000;
        }
    }

    rx_init(){
        RD_SAFE_BUTTON = Math.floor(Math.random() * 2) === 0 ? 'LEFT' : 'RIGHT';
        RT_SAFE_BUTTON = Math.floor(Math.random() * 2) === 0 ? 'LEFT' : 'RIGHT';
    }

    pattern_init(){
        if(PL_RND_COMMON_BTN === 0){
            PL_PATTERN_RND_COMMON_BTN = 1;
        }
        else {
            PL_PATTERN_RND_COMMON_BTN = 0;
        }
        // FREQUENT === COMMON
        if (PL_PATTERN_RND_COMMON_BTN === 0) {
            PL_PATTERN_RARE = 'DOWN';
            PL_PATTERN_FREQUENT = 'UP';
            PL_PATTERN_SIDES['UP'] = 'F';
            PL_PATTERN_SIDES['DOWN'] = 'R';
            PL_PATTERN_FR_SIDES['R'] = 'DOWN';
            PL_PATTERN_FR_SIDES['F'] = 'UP';
        } else {
            PL_PATTERN_RARE = 'UP';
            PL_PATTERN_FREQUENT = 'DOWN';
            PL_PATTERN_SIDES['UP'] = 'R';
            PL_PATTERN_SIDES['DOWN'] = 'F';
            PL_PATTERN_FR_SIDES['R'] = 'UP';
            PL_PATTERN_FR_SIDES['F'] = 'DOWN';
        }

        DFE_PATTERN_RND_NUMBER = Math.random();
        DFE_PATTERN_RND_NUMBER = Math.floor(DFE_PATTERN_RND_NUMBER * 1000) / 1000;
        if (DFE_PATTERN_RND_NUMBER > 0.5) {
            DFE_PATTERN_SIDE = 'RIGHT';
        } else {
            DFE_PATTERN_SIDE = 'LEFT';
        }
    }

    initializeGame(){
        let game_template = [];
        let game_set = JSON.parse(JSON.stringify(this.game_settings.game));
        let tasks = [...game_set.tasks];
        if (tasks.length === 0) {
            let sc = this.state;
            sc.loading = false;
            sc.game_tasks_error = true;
            this.setState(sc);
            return;
        }

        this.pl_init();
        this.rx_init();
        this.pattern_init();

        game_template.push({
            Mode: 'Message',
            Message: GameWelcome,
            Button: GameSetting.language === 'German'? 'Weiter' : 'Continue',
            Args: {
                SignOfReward: this.game_settings.payments.sign_of_reward,
                ShowUpFee: this.game_settings.payments.show_up_fee,
                BonusEndowment: this.game_settings.payments.bonus_endowment,
                insertTextInput: this.props.insertTextInput
            }
        });

        let task_num = 1;
        let pattern_random = [], rx_random = [];
        let rx_counter = 0, pattern_counter = 0;

        GameRealTasks = [];

        while (tasks.length>0){
            let next_index, next_task;
            if (tasks.random_task_order === 'true')
                next_index = Math.floor(Math.random() * tasks.length);
            else
                next_index = 0;

            if (tasks[next_index] !== 'Conspiracy') {
                if (tasks[next_index] === 'RX'){
                    let pat = ['RD', 'RT'];

                    if (rx_random.length === 0){
                        let first = pat[Math.floor(Math.random() * pat.length)];
                        rx_random.push(first);
                        rx_random.push(first === 'RD' ? 'RT' : 'RD');
                    }

                    if (game_set.rx === 'first_always'){
                        next_task = rx_random[rx_counter];
                        rx_random = rx_random.filter(p => p !== next_task);
                    }
                    else if (game_set.rx === 'first_once'){
                        next_task = rx_random[rx_counter];
                    }
                    else if (game_set.rx === 'full'){
                        next_task = pat[Math.floor(Math.random() * pat.length)];
                    }

                    if (rx_counter === 0)
                        rx_counter = 1;
                    else if (rx_counter === 1)
                        rx_counter = 0;
                }
                else if (tasks[next_index] === 'Pattern'){
                    let pat = ['PL_Pattern', 'DFE_Pattern'];

                    if (pattern_random.length === 0){
                        let first = pat[Math.floor(Math.random() * pat.length)];
                        pattern_random.push(first);
                        pattern_random.push(first === 'PL_Pattern' ? 'DFE_Pattern' : 'PL_Pattern');
                    }

                    if (game_set.pattern === 'first_always'){
                        next_task = pattern_random[pattern_counter];
                        pattern_random = pattern_random.filter(p => p !== next_task);
                    }
                    else if (game_set.pattern === 'first_once'){
                        next_task = pattern_random[pattern_counter];
                    }
                    else if (game_set.pattern === 'full'){
                        next_task = pat[Math.floor(Math.random() * pat.length)];
                    }
                    if (pattern_counter === 0)
                        pattern_counter = 1;
                    else if (pattern_counter === 1)
                        pattern_counter = 0;
                }
                else
                    next_task = tasks[next_index];

                /*
                let message = null;
                if (next_task === 'RT' || next_task === 'RD') {
                    message = TasksMessages['RX_' + rx_msg_counter];
                    if (rx_msg_counter === 2) rx_msg_counter = 1;
                    else rx_msg_counter = 2;

                }
                else {
                    message = TasksMessages[next_task];
                }
                 */
                let message = TasksMessages[next_task];
                GameRealTasks.push(next_task);

                const Args = {
                    SignOfReward: this.game_settings.payments.sign_of_reward,
                    TaskNumber: task_num,
                    ActionTime: this.game_settings.general.action_time,
                    PL_Trials: this.game_settings.game.pl_number_of_trials,
                    RX_Trials: next_task === 'RT' ? this.game_settings.game.rt_number_of_trials : this.game_settings.game.rd_number_of_trials,
                    PATTERN_Trials: this.game_settings.game.pattern_number_of_trials,
                    RX_ExchangeRatio: next_task === 'RT' ? this.game_settings.payments.exchange_ratio_rt : this.game_settings.payments.exchange_ratio_rd,
                    PL_ExchangeRatio: this.game_settings.payments.exchange_ratio_pl,
                    PL_PATTERN_ExchangeRatio: this.game_settings.payments.exchange_ratio_pl_pattern,
                    DFE_PATTERN_ExchangeRatio: this.game_settings.payments.exchange_ratio_dfe_pattern,
                };

                game_template.push({
                    Mode: 'Message',
                    Message: message,
                    Button: GameSetting.language === 'German'? 'Weiter' : 'Continue',
                    TaskNum: task_num,
                    Args
                });

            }
            else {
                next_task = tasks[next_index];
            }

            if (!FIRST_TASK)
                FIRST_TASK = next_task;

            game_template.push({
                Mode: 'Game',
                Task: next_task,
                TaskNum: task_num
            });

            try{
                if (game_set[next_task.toLowerCase() + '_task_check']) {
                    game_template.push({
                        Mode: 'TaskCheck',
                        Task: next_task,
                        TaskNum: task_num
                    });
                }

            }
            catch (e) {}


            if (next_task !== 'Conspiracy')
                game_template.push({
                    Mode: 'Message',
                    Message: EndOfTask,
                    Button: GameSetting.language === 'German'? 'Weiter' : 'Continue',
                    TaskNum: task_num,
                });

            tasks = tasks.filter(
                (t, t_i) => t_i !== next_index
            );

            task_num++;
        }

        game_template.push({
            Mode: 'SupportTools',
        });

        TasksOrder = [...game_template];
        GameTasks = [...game_set.tasks];

        this.setState({loading: false}, () => START_MIL = Date.now());

    }

    Forward() {
        let sc = this.state;
        sc.game_counter++;
        if (sc.game_counter === (TasksOrder.length)) {
            let tasks_played = GameRealTasks.filter(task => {
                return !task.includes('Conspiracy')
            });
            let random_task = Math.floor(Math.random() * tasks_played.length);
            let task_selected = tasks_played[random_task];
            let game_records = GAME_RECORDS;

            let task_selected_score = game_records[task_selected][game_records[task_selected].length - 1].TaskScore;
            let task_exchange_rate = Number(this.game_settings.payments['exchange_ratio_' + task_selected.toLowerCase()]);

            let bonus_pay = (task_selected_score / task_exchange_rate) + Number(this.game_settings.payments.bonus_endowment);
            bonus_pay = Math.floor(bonus_pay * 100) / 100;

            let total_pay = Number(this.game_settings.payments.show_up_fee) + bonus_pay;
            total_pay = Math.floor(total_pay * 100) / 100;

            let payment_data = {
                ShowUpFee: this.game_settings.payments.show_up_fee,
                BonusEndowment: this.game_settings.payments.bonus_endowment,
                SignOfReward: this.game_settings.payments.sign_of_reward,
                ExchangeRatioPL: this.game_settings.payments.exchange_ratio_pl,
                ExchangeRatioRT: this.game_settings.payments.exchange_ratio_rt,
                ExchangeRatioRD: this.game_settings.payments.exchange_ratio_rd,
                ExchangeRatioPLPattern: this.game_settings.payments.exchange_ratio_pl_pattern,
                ExchangeRatioDFEPattern: this.game_settings.payments.exchange_ratio_dfe_pattern,
                TaskSelected: task_selected,
                TaskSelectedScore: task_selected_score,
                GameBonus: bonus_pay,
                TotalPay: total_pay
            };

            const current_time = getTimeDate();
            NewLogs({
                user_id: UserId,
                exp: ThisExperiment,
                running_name: RunningName,
                action: 'G.E',
                type: 'LogGameType',
                more_params: {
                    game_points: TotalScore,
                    bonus_pay,
                    total_payment: total_pay,
                    local_t: current_time.time,
                    local_d: current_time.date,
                },
            }).then((res) => {});

            this.props.insertPayment(payment_data);

            sc.loading = true;

            this.setState(sc, () => {
                this.props.callbackFunction('FinishGame', {need_summary: true, args: {
                        TotalScore, language: GameSetting.language
                    }});

                // this.props.sendGameDataToDB().then(
                //     () => {
                //         NewLogs({
                //             user_id: UserId,
                //             exp: ThisExperiment,
                //             running_name: RunningName,
                //             action: 'G.E.S',
                //             type: 'LogGameType',
                //             more_params: {
                //                 game_points: TotalScore,
                //                 bonus_pay,
                //                 total_payment: total_pay,
                //                 local_t: current_time.time,
                //                 local_d: current_time.date,
                //             },
                //         }).then((res) => {});
                //         this.props.callbackFunction('FinishGame', {need_summary: true, args: TotalScore});
                //     }
                // );
            });
            // this.props.callbackFunction('FinishGame', {need_summary: true, args: {game_points: TotalScore}});

            // sc.game_over = true;
            // this.setState(sc);
        }
        else {
            this.setState(sc, () => {
                if (TasksOrder[this.state.game_counter].Mode === 'Game' || TasksOrder[this.state.game_counter].Mode === 'TaskCheck')
                    this.props.SetLimitedTime(true);
                else
                    this.props.SetLimitedTime(false);
            });
        }
    }

    render() {
        if (this.state.loading)
            return <WaitForAction2/>;

        if (this.state.game_tasks_error)
            return (
                <ErrorWarning>
                    <div style={{display: 'grid', gridRowGap: '1rem', textAlign: 'center'}}>
                        <label>ERROR</label>
                        {this.state.isa && (
                            <>
                                <label>No tasks defined</label>
                                <label>Goto to Settings and add tasks</label>
                            </>
                        )}
                    </div>
                    {/*<button onClick={() => window.location.reload()}>OK</button>*/}
                </ErrorWarning>
            );

        return (
            <div
              style={{width: '100%', height: '100%'}}
                // className='cm-start-panel dfe-pl-panel'
            >
                {TasksOrder[this.state.game_counter].Mode === 'Message' && (
                    <Message
                        Message={TasksOrder[this.state.game_counter].Message(TasksOrder[this.state.game_counter].Args)}
                        Button={TasksOrder[this.state.game_counter].Button}
                        Forward={this.Forward}
                    />
                )}

                {TasksOrder[this.state.game_counter].Mode === 'Game' && (
                    <Game
                        Task={TasksOrder[this.state.game_counter].Task}
                        TaskNum={TasksOrder[this.state.game_counter].TaskNum}
                        Forward={this.Forward}
                        endGame={this.endGame}
                        game_settings={this.game_settings}
                        insertTaskGameLine={this.props.insertTaskGameLine}
                        sendGameDataToDB={this.props.sendGameDataToDB}
                        SetLimitedTime={this.props.SetLimitedTime}

                    />
                )}

                {TasksOrder[this.state.game_counter].Mode === 'TaskCheck' && (
                    <TaskCheck
                        Task={TasksOrder[this.state.game_counter].Task}
                        TaskNum={TasksOrder[this.state.game_counter].TaskNum}
                        Forward={this.Forward}
                        endGame={this.endGame}
                        game_settings={this.game_settings}
                        insertLineCustomTable={this.props.insertLineCustomTable}
                        SetLimitedTime={this.props.SetLimitedTime}
                    />
                )}

                {TasksOrder[this.state.game_counter].Mode === 'SupportTools' && (
                    <SupportTools
                        Forward={this.Forward}
                        insertLineCustomTable={this.props.insertLineCustomTable}
                    />
                )}

            </div>
        );

    }
}

export default Start;

const NumberToWords = number => {
    const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    try {
        return numbers[number];
    }
    catch (e) {
        return number;
    }
}

const GameWelcomeEnglish = ({SignOfReward, ShowUpFee, BonusEndowment}) => {
    return (
      <p>
          Welcome and thank you for choosing to take part in the "Repeated decisions”" study!<br/>
          This study is
          about decision-making and we will ask you to make a series of decisions in four separate tasks. You
          will receive {SignOfReward}{ShowUpFee} as compensation for your participation plus an additional bonus that is dependent
          on your decisions.
          <br/><br/>
          For your bonus payment, one task will be randomly selected at the end of the study. The sum of
          points you earned in this task will be converted to your bonus payment according to a conversion key
          that will be presented with the instructions for each task.
          <br/><br/>
          The money you earned will be added to or subtracted from a bonus endowment of {SignOfReward}{BonusEndowment}.
          <br/><br/>
          The quality of the data from this study is very important to us. Therefore, please read all instructions
          carefully and try to do the best you can. We will ask you several questions throughout the study that
          are meant to check your attention to the displayed information.
          <br/><br/>
          <b>
              If you fail multiple attention checks, your submission will not be accepted and we will not be able
              to include your data in our analyses.
          </b>
      </p>
    )
}

const GameWelcomeGerman = () => {
    return (
      <p>
          Herzlich Willkommen und vielen Dank für Ihre Teilnahme an der Studie „Wiederholtes Entscheiden.“
          In dieser Studie geht es um Entscheidungsverhalten und wir werden Sie bitten eine Reihe von
          Entscheidungen in vier separaten Aufgaben zu treffen. Für die Teilnahme zahlen wir Ihnen eine
          Aufwandsentschädigung von 15 Euro plus einen Bonus von bis zu 8 Euro, der von Ihren
          Entscheidungen in der Studie abhängt.
          <br/><br/>
          Für die Bonuszahlung wird eine der vier Entscheidungsaufgaben am Ende der Studie zufällig
          ausgewählt. Die Punkte, die Sie in dieser Aufgabe verdient haben, werden mit einem bestimmten
          Umrechnungsschlüssel in Euro umgerechnet und einem festen Bonusbetrag von 2 Euro hinzugefügt
          oder abgezogen. Den Umrechnungsschlüssel für die jeweilige Entscheidungsaufgabe nennen wir
          Ihnen in den Instruktionen zu dieser Aufgabe. Bitte versuchen Sie so viel Geld wie möglich zu
          verdienen.
          <br/><br/>
          Die Qualität der Untersuchungsdaten ist uns äußerst wichtig. Wir bitten Sie daher alle Instruktionen
          sorgfältig durchzulesen. Die Studie beinhaltet mehrere Fragen, die darauf abzielen Ihre
          Aufmerksamkeit auf die Aufgabenstellung zu prüfen.
          <b>
              Falls Sie mehrere dieser Fragen falsch
              beantworten, können wir Ihre Untersuchungsdaten leider nicht mit in unsere Auswertungen
              aufnehmen.
          </b>
      </p>
    )
}

const GameWelcome = (props) => {
   if (GameSetting.language === 'German')
       return <GameWelcomeGerman {...props}/>;
   return <GameWelcomeEnglish {...props}/>;
};

const EndOfTask = () => {

    return (
        <div className='ct3-end-task-msg'>
            {
               GameSetting.language === 'German' ? (
                 <>
                     <label>Die Aufgabe ist beendet,</label>
                     <label>bitte drücken Sie auf Weiter</label>
                 </>
               ): (
                 <>
                     <label>End of task.</label>
                     <label>Click continue.</label>
                 </>
               )
            }
        </div>
    )
};

const next_task_text = task => FIRST_TASK === task ? 'first' : 'next';

const PL_MSG_German = ({PL_Trials, }) => {

    return (
      <p>
          Die erste Entscheidungsaufgabe besteht aus {PL_Trials} Durchgängen. In jedem Durchgang bitten wir Sie
          vorherzusagen, welche von zwei auf dem Bildschirm präsentierten Schaltflächen sich blau färbt.
          Wenn Sie denken, dass sich die obere Schaltfläche als nächstes blau färbt, klicken Sie bitte auf diese
          obere Schaltfläche. Wenn Sie denken, dass sich die untere Schaltfläche als nächstes blau färbt,
          klicken Sie bitte auf die untere Schaltfläche. Nach jeder Entscheidung sehen Sie welche Schaltfläche
          sich tatsächlich blau gefärbt hat. Für jede richtige Vorhersage verdienen Sie 1 Punkt. Für jede falsche
          Vorhersage verdienen Sie 0 Punkte. In dieser Aufgabe entsprechen 100 Punkte = 2,50 Euro.
      </p>
    )
};

const PL_MSG_English = ({TaskNumber, PL_Trials, PL_ExchangeRatio, SignOfReward, ActionTime}) => {

    return (
        <p>
            <b>Task {TaskNumber}</b><br/>
            The {next_task_text('PL')} task includes {PL_Trials} rounds. In each round, your job is to predict which of two grey buttons
            presented on the screen will turn blue. If you think the upper button will turn blue next, click on this
            upper button. If you think the lower button will turn blue next, click on that lower button. After each
            choice, you will be shown which button actually turned blue. For each correct choice, you will earn 1
            point. For each incorrect choice, you will earn 0 points. In this task, {PL_ExchangeRatio} points = {SignOfReward}1.
            There is no time limit. However, once you start this task, please complete it without breaks. Note
            that if you will be idle for {ActionTime} seconds, the experimental screen will close and you will not be
            compensated.
        </p>
    )
};

const PL_MSG = (props) => {
    if (GameSetting.language === 'German')
        return <PL_MSG_German {...props}/>;
    return <PL_MSG_English {...props}/>;
};

const RT_MSG1_English = ({SignOfReward, TaskNumber, RX_Trials, RX_ExchangeRatio, ActionTime}) => {
    // SETTINGS.general.rd_number_of_trials
    return (
        <p>
            <b>Task {TaskNumber}</b><br/>
            The {next_task_text('RT')} task includes {RX_Trials} rounds.<br/>
            Your task, in each round, is to click on one of the two buttons
            presented on the screen. Following each choice, you will see how many points each button provided.
            That is, you will see how many points you earned for clicking on the button. You will also be able to
            see how many points you could have earned had you clicked the other button. The number of points
            you did not get will be presented in white on the button you did not click. In this task, {RX_ExchangeRatio} points = {SignOfReward}1
            <br/><br/>
            There is no time limit. However, once you start this task, please complete it without breaks. Note
            that if you will be idle for {ActionTime} seconds, the experimental screen will close and you will not be
            compensated.
        </p>
    )
};

const RT_MSG1_German = ({RX_Trials}) => {
    // SETTINGS.general.rd_number_of_trials
    return (
        <p>
            Die nächste Entscheidungsaufgabe besteht aus {RX_Trials} Durchgängen. In jedem Durchgang bitten wir Sie
            auf eine von zwei auf dem Bildschirm präsentierten Schaltflächen zu klicken. Nach jeder
            Entscheidung sehen Sie wie viele Punkte die beiden Schaltflächen auszahlen. Das heißt, es wird Ihnen
            angezeigt wie viele Punkte Sie durch Klicken auf eine der Schaltflächen verdient haben. Sie werden
            ebenfalls sehen wie viele Punkte Sie hätten verdienen können, wenn Sie die andere Schaltfläche
            angeklickt hätten. Die Punkte, die Sie nicht verdient haben, werden Ihnen in weiß auf der
            Schaltfläche, die Sie nicht betätigt haben, angezeigt. In dieser Aufgabe entsprechen 100 Punkte = 5
            Euro.
        </p>
    )
};

const RT_MSG1 = (props) => {
    if (GameSetting.language === 'German')
        return <RT_MSG1_German {...props}/>;
    return <RT_MSG1_English {...props}/>;
}

const RD_MSG2_English = ({SignOfReward, TaskNumber, RX_Trials, RX_ExchangeRatio, ActionTime}) => {
    // SETTINGS.general.rd_number_of_trials
    return (
      <p>
          <b>Task {TaskNumber}</b><br/>
          The {next_task_text('RT')} task includes {RX_Trials} rounds.<br/>
          The instructions are the same as in the previous task, but
          the number of points each key provides may be different. Note that the different tasks in this study
          are unrelated and that what you have learned in previous tasks may not apply to this task. In this task, {RX_ExchangeRatio} points = {SignOfReward}1
          <br/><br/>
          There is no time limit. However, once you start this task, please complete it without breaks. Note
          that if you will be idle for {ActionTime} seconds, the experimental screen will close and you will not be
          compensated.
      </p>
    )
};

const RD_MSG2_German = ({RX_Trials}) => {
    // SETTINGS.general.rd_number_of_trials
    return (
      <p>
          Die nächste Entscheidungsaufgabe besteht ebenfalls aus {RX_Trials} Durchgängen. Die Instruktionen bleiben
          dieselben wie in der vorherigen Entscheidungsaufgabe, aber die Anzahl der Punkte, die jede
          Schaltfläche auszahlt, kann anders sein. Bitte beachten Sie auch, dass die verschiedenen
          Entscheidungsaufgaben in dieser Studie nicht miteinander zusammenhängen und dass das was Sie in
          vorherigen Aufgaben gelernt haben, nicht auf diese Aufgabe zutreffen muss.
          <br/><br/>
          In dieser Aufgabe entsprechen 100 Punkte = 5 Euro
      </p>
    )
};

const RD_MSG2 = (props) => {
    if (GameSetting.language === 'German')
        return <RD_MSG2_German {...props}/>;
    return <RD_MSG2_English {...props}/>;
}

const PL_PATTERN_MSG = ({SignOfReward, TaskNumber, PATTERN_Trials, PL_PATTERN_ExchangeRatio, ActionTime}) => {

    return (
        <div
            className=''
        >
            <label className='rc-m-content-header'>Task {TaskNumber}</label>
            <label>
                The {next_task_text('PL_Pattern')} task includes {PATTERN_Trials} rounds. In each round, your job is to predict which of two grey buttons
                presented on the screen will turn blue. If you think the upper button will turn blue next, click on this
                upper button. If you think the lower button will turn blue next, click on that lower button. After each
                choice, you will be shown which button actually turned blue. For each correct choice, you will earn 1
                point. In this task, {PL_PATTERN_ExchangeRatio} points = {SignOfReward}1.
            </label>
            <label>There is no time limit. However, once you start this task, please complete it without breaks. Note
                that if you will be idle for {ActionTime} seconds, the experimental screen will close and you will not be
                compensated.
            </label>
        </div>
    )
};

const DFE_PATTERN_MSG_English = ({SignOfReward, TaskNumber, PATTERN_Trials, DFE_PATTERN_ExchangeRatio, ActionTime}) => {

    return (
        <p>
            <b>Task {TaskNumber}</b><br/>
            The {next_task_text('RT')} task includes {PATTERN_Trials} rounds.<br/>
            The instructions are the same as in the previous task, but the
            number of points each key provides may be different. Note that the different tasks in this study are
            unrelated and that what you have learned in previous tasks may not apply to this task. In this task,
            {DFE_PATTERN_ExchangeRatio} points = {SignOfReward}1.
            <br/><br/>
            There is no time limit. However, once you start this task, please complete it without breaks. Note
            that if you will be idle for {ActionTime} seconds, the experimental screen will close and you will not be
            compensated.
        </p>
    )
};

const DFE_PATTERN_MSG_German = ({PATTERN_Trials}) => {

    return (
        <p>
            Die nächste Entscheidungsaufgabe besteht aus {PATTERN_Trials} Durchgängen. Die Instruktionen bleiben
            dieselben wie in der vorherigen Entscheidungsaufgabe, aber die Anzahl der Punkte, die jede
            Schaltfläche auszahlt, kann anders sein. Bitte beachten Sie auch, dass die verschiedenen
            Entscheidungsaufgaben in dieser Studie nicht miteinander zusammenhängen und dass das was Sie in
            vorherigen Aufgaben gelernt haben, nicht auf diese Aufgabe zutreffen muss.
            <br/><br/>
            In dieser Aufgabe entsprechen 100 Punkte = 2,50 Euro.
        </p>
    )
};

const DFE_PATTERN_MSG = (props) => {
    if (GameSetting.language === 'German')
        return <DFE_PATTERN_MSG_German {...props}/>;
    return <DFE_PATTERN_MSG_English {...props}/>;
}

const TasksMessages = {
    PL: PL_MSG,
    RT: RT_MSG1,
    RD: RD_MSG2,
    PL_Pattern: PL_PATTERN_MSG,
    DFE_Pattern: DFE_PATTERN_MSG,
};

