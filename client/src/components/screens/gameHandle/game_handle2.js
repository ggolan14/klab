import React, {Fragment, useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {connect} from "react-redux";
import {Link, Navigate} from "react-router-dom";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";

import TryOrGiveUpStart from "../../content/try_or_give_up/Start";
import TryOrGiveUpSummary from "../../content/try_or_give_up/Summary";

import PointsGameStart from "../../content/points_game/Start";
import PointsGameSummary from "../../content/points_game/Summary";


import PointsGameShStart from "../../content/points_game_sh/Start";

import WordPuzzleStart from "../../content/word_puzzle/Start";
import WordPuzzleSummary from "../../content/word_puzzle/Summary";

import AbstractAndDeclarationEffectStart from "../../content/abstract_and_declaration_effect/Start";
import AbstractAndDeclarationEffectSummary from "../../content/abstract_and_declaration_effect/Summary";

import SignatureAsReminderStart from "../../content/signature_as_reminder/Start";
import SignatureAsReminderSummary from "../../content/signature_as_reminder/Summary";

import CognitiveTaskStart from "../../content/cognitive_task/Start";
import CognitiveTask2Start from "../../content/cognitive_task2/Start";

import RepeatedChoiceStart from "../../content/repeated_choice/Start";
import RepeatedChoiceSummary from "../../content/repeated_choice/Summary";

import MetaSamplingStart from "../../content/meta_sampling/Start";
import MetaSamplingSummary from '../../content/meta_sampling/Summary';
import SPStart from "../../content/sp/Start";
import SPSummary from '../../content/sp/Summary';

import ReversibleMatricesStart from "../../content/reversible_matrices/Start";
import ReversibleMatricesSummary from '../../content/reversible_matrices/Summary';

import SignatureTimingEffectStart from "../../content/signature_timing_effect/Start";
import SignatureTimingEffectSummary from '../../content/signature_timing_effect/Summary';

import CupsGameStart from "../../content/cups_game/Start";
// import CupsGameSummary from '../../content/cups_game/Summary';

import NoCupsGameStart from "../../content/no_cups_game/Start";
import NoCupsGameSummary from '../../content/no_cups_game/Summary';

import DFEStart from "../../content/dfe/Start";
import PLPatternStart from "../../content/pl_pattern/Start";
import {getTimeDate} from "../../../utils/app_utils";
import ConsentForm from "../consentForms/consent_form";
import {getGameConsentForm, getGameVersion, getExpState, getEndCode, RecordGame, OpenNewRecord, FinishRecordGame} from "../../../actions/exp_actions";
import ExpLogin from "../expLogin/exp_login";
import './game_handle.css';
import {NewLogs} from "../../../actions/logger";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
// import { Beforeunload } from 'react-beforeunload';

import { stringify } from 'zipson';
// import {AppUrl} from "../../../data/constants";
import CodeError from "../../layout/error";
import {preventPageGoBack} from "../../../utils/helpers";
import {GetExperimentName} from "../../../data/experiments";
import {CURRENT_URL} from "../../../utils/current_url";

let DB_RECORDS = null;
let LIMITED_TIME = false;
let ActionTime = null;
let SecondWarning = null;
let ActionTimeLast = null;
let SecondWarningShow = false;
// let FullScreenMode = false;
let FullScreenState = false;
let EntranceTime = Date.now();
let EXP_ID = null;
let CurrentExperiments = null;
let SAVE_PART = 1;
let VisibilityStatus = null;
let FirstFullScreenChange = false;
let mousePosition = {x: 0, y: 0};
let offset = [0,0];
let DebuggerRef = null;
let DebuggerRefDown = false;

const getGameType = game => game === 'RepeatedChoice' ? DB_RECORDS.Game = {} : DB_RECORDS.Game = [];

function ResetNewGame(){
    DB_RECORDS.Game = [];
    DB_RECORDS.MoreRec = {};
    DB_RECORDS.Payment = {};
    DB_RECORDS.Summary = {
        TextInput: '',
        StartTime: null,
        EndTime: null,
        EndTimeMil: null,
        UserFinalComments: '',
        Date: ''
    };
    DB_RECORDS.KeyTable = {
        ID: '',
        ProlificID: '',
        RunningName: '',
        Version: '',
        Mode: '',
        Date: ''
    };
    ActionTimeLast = null;
    SAVE_PART = 1;
}

function ResetAll() {
    DB_RECORDS = {
        Game: [],
        Payment: {},
        UserDetails: {
            UserId: '',
            Age: '',
            Gender: '',
            TimeZone: '',
            GMT: '',
            EDT: '',
            Lang: '',
            Langs: [],
            ScreenH: '',
            ScreenW: '',
            PixelRatio: '',
        },
        KeyTable: {
            ID: '',
            ProlificID: '',
            RunningName: '',
            Version: '',
            Mode: '',
            Date: ''
        },
        Summary: {
            TextInput: '',
            StartTime: null,
            EndTime: null,
            EndTimeMil: null,
            UserFinalComments: '',
            Date: ''
        },
    };
    LIMITED_TIME = false;
    ActionTime = null;
    SecondWarning = null;
    SecondWarningShow = false;
    // FullScreenMode = false;
    FullScreenState = false;
    EXP_ID = null;
    CurrentExperiments = null;
    VisibilityStatus = null;
    FirstFullScreenChange = false;
    DebuggerRefDown = false;
    DebuggerRef = null;
    ResetNewGame();
    getGameType(CurrentExperiments);
}


function insertMoreRecords(key, data){
    DB_RECORDS.MoreRec[key] = data;
}

export const getFullScreenState = () => {
    return FullScreenState;
}

export const KeyTableID = () => {
    return DB_RECORDS.KeyTable.ID;
}

const OnBeforeUnload = beforeunload => {

    // T.O Try to go out
    // G.O Go out

    if (beforeunload){
        window.onbeforeunload = function(){
            let log = {
                user_id: DB_RECORDS.UserDetails.UserId,
                exp: CurrentExperiments,
                running_name: DB_RECORDS.KeyTable.RunningName,
                action: 'T.O',
                type: 'LogGameType',
                more_params: {
                    id: EXP_ID
                },
            };

            NewLogs(log).then();
            return '';
        };
        window.addEventListener('unload', () => {
            const body = {
                logs: {
                    user_id: DB_RECORDS.UserDetails.UserId,
                    exp: CurrentExperiments,
                    running_name: DB_RECORDS.KeyTable.RunningName,
                    action: 'G.O',
                    type: 'LogGameType',
                    more_params: {
                        id: EXP_ID
                    },
                }
            };
            const headers = {
                type: 'application/json',
            };
            const blob = new Blob([JSON.stringify(body)], headers);
            navigator.sendBeacon(CURRENT_URL() + '/api/logger', blob);
        });

        document.addEventListener("visibilitychange", function() {
            if (document.visibilityState === 'hidden' && VisibilityStatus !== 'hidden') {

                let log = {
                    user_id: DB_RECORDS.UserDetails.UserId,
                    exp: CurrentExperiments,
                    running_name: DB_RECORDS.KeyTable.RunningName,
                    action: 'V.C.H',
                    type: 'LogGameType',
                    more_params: {
                        id: EXP_ID
                    },
                };

                NewLogs(log).then();

                VisibilityStatus = document.visibilityState;
            }
            else if (document.visibilityState !== 'hidden' && VisibilityStatus === 'hidden'){

                let log = {
                    user_id: DB_RECORDS.UserDetails.UserId,
                    exp: CurrentExperiments,
                    running_name: DB_RECORDS.KeyTable.RunningName,
                    action: 'V.C.V',
                    type: 'LogGameType',
                    more_params: {
                        id: EXP_ID
                    },
                };

                NewLogs(log).then();
                VisibilityStatus = document.visibilityState;

            }

        });
    }
    else {
        window.onbeforeunload = null;
        window.onunload = null;
        window.onvisibilitychange = null;
    }
};

function SetLimitedTime(status){
    LIMITED_TIME = status;
}

const sendGameDataToDB = async () => {

    RecordGame({
        Exp: CurrentExperiments,
        ExpID: EXP_ID,
        Records: stringify(DB_RECORDS.Game),
    }).then(
        res => {
            try {
                NewLogs({
                    user_id: DB_RECORDS.UserDetails.UserId,
                    exp: CurrentExperiments,
                    running_name: DB_RECORDS.KeyTable.RunningName,
                    action: 'G.D.R.S',
                    type: 'LogGameType',
                    more_params: {
                        part: SAVE_PART,
                        id: EXP_ID
                    },
                }).then((res) => {});
                SAVE_PART++;
                getGameType(CurrentExperiments);
                return true;
            }
            catch (e) {
                NewLogs({
                    user_id: DB_RECORDS.UserDetails.UserId,
                    exp: CurrentExperiments,
                    action: 'G.D.R.N.S',
                    type: 'LogGameType',
                    more_params: {
                        part: SAVE_PART,
                        id: EXP_ID,
                        error: 'catch'
                    },
                }).then((res) => {});
                this.props.setWaitForAction(false);
                return false;
            }
        }
    )
};

function getGameRecords(){
    return [...DB_RECORDS.Game];
}

const insertGameLine = (line) => {
    if (!Array.isArray(DB_RECORDS.Game))
        DB_RECORDS.Game = [];
    DB_RECORDS.Game.push(line);
};

const insertGameArray = (rec_arr) => {
    DB_RECORDS.Game = rec_arr;
};

const insertTextInput = (input_key, value) => {
    DB_RECORDS.Summary[input_key] = value;
};

const getTextInput = (input_key) => {
    return DB_RECORDS.Summary[input_key];
};

const getTable = table => {
    return DB_RECORDS[table];
};

const insertTaskGameLine = (task, line) => {
    if (Array.isArray(DB_RECORDS.Game))
        DB_RECORDS.Game = {};

    if (DB_RECORDS.Game[task] === undefined){
        DB_RECORDS.Game[task] = [];
    }

    DB_RECORDS.Game[task].push(line);
};

const insertLineCustomTable = (table, line, type) => {
    if (DB_RECORDS.MoreRec[table] === undefined){
        if (type === 'array')
            DB_RECORDS.MoreRec[table] = [];
    }

    if (type === 'array')
        DB_RECORDS.MoreRec[table].push(line);
    else
        DB_RECORDS.MoreRec[table] = line;
};

const insertPayment = (payment) => {
    DB_RECORDS.Payment = payment;
};

const getGame = ({exp, game_settings, more, isa, callbackFunction, setWaitForAction, dmr}) => {
    const game_props = {
        SetLimitedTime,
        dmr,
        running_name: DB_RECORDS.KeyTable.RunningName,
        getTable,
        insertGameLine,
        insertGameArray,
        insertMoreRecords,
        sendGameDataToDB,
        insertTextInput,
        getTextInput,
        insertTaskGameLine,
        insertPayment,
        insertLineCustomTable,
        getGameRecords,
        setWaitForAction: setWaitForAction,
        game_settings,
        more,
        isa,
        user_id: DB_RECORDS.UserDetails.UserId,
        callbackFunction
    };
    const game_list = {
        TryOrGiveUp: <TryOrGiveUpStart {...game_props}/>,
        PointsGame: <PointsGameStart {...game_props}/>,
        PointsGameSh: <PointsGameShStart/>,
        WordPuzzle: <WordPuzzleStart {...game_props}/>,
        AbstractAndDeclarationEffect: <AbstractAndDeclarationEffectStart {...game_props}/>,
        SignatureAsReminder: <SignatureAsReminderStart {...game_props}/>,
        CognitiveTask: <CognitiveTaskStart/>,
        CognitiveTask2: <CognitiveTask2Start/>,
        RepeatedChoice: <RepeatedChoiceStart {...game_props}/>,
        SP: <SPStart {...game_props}/>,
        DFE: <DFEStart/>,
        PL_PATTERN: <PLPatternStart/>,
        MetaSampling: <MetaSamplingStart {...game_props}/>,
        ReversibleMatrices: <ReversibleMatricesStart {...game_props}/>,
        SignatureTimingEffect: <SignatureTimingEffectStart {...game_props}/>,
        CupsGame: <CupsGameStart {...game_props}/>,
        NoCupsGame: <NoCupsGameStart {...game_props}/>,
    };

    return game_list[exp];
};

const getSummary = ({exp, summary_args}) => {
    const game_list = {
        RepeatedChoice: {
            label: 'Repeated Choice',
            element: () => (
                <RepeatedChoiceSummary
                    SignOfReward={DB_RECORDS.Payment.SignOfReward}
                    ShowUpFee={DB_RECORDS.Payment.ShowUpFee}
                    GameBonus={DB_RECORDS.Payment.GameBonus}
                />
            )
        },
        MetaSampling: {
            label: 'Choice challenge',
            element: () => (
                <MetaSamplingSummary
                    SignOfReward={DB_RECORDS.Payment.sign_of_reward}
                    ShowUpFee={DB_RECORDS.Payment.show_up_fee}
                    GameBonus={DB_RECORDS.Payment.bonus}
                    RandomRound={DB_RECORDS.Payment.random_round}
                    IsCorrect={DB_RECORDS.Payment.is_round_correct}
                />
            )
        },
        SP: {
            label: 'The Cards Game',
            element: () => (
                <SPSummary
                    SignOfReward={DB_RECORDS.Payment.sign_of_reward}
                    ShowUpFee={DB_RECORDS.Payment.show_up_fee}
                    SummaryArgs={summary_args}
                />
            )
        },
        PointsGame: {
            label: 'Points game',
            element: () => (
                <PointsGameSummary
                    SignOfReward={DB_RECORDS.Payment.sign_of_reward}
                    ShowUpFee={DB_RECORDS.Payment.show_up_fee}
                />
            )
        },
        ReversibleMatrices: {
            label: 'Game of Matrices',
            element: () => (
                <ReversibleMatricesSummary
                    SignOfReward={DB_RECORDS.Payment.sign_of_reward}
                    ShowUpFee={DB_RECORDS.Payment.show_up_fee}
                    GameBonus={DB_RECORDS.Payment.bonus}
                    SummaryArgs={summary_args}
                />
            )
        },
        SignatureTimingEffect: {
            label: 'Subjective story',
            element: () => (
                <SignatureTimingEffectSummary
                    SignOfReward={DB_RECORDS.Payment.sign_of_reward}
                    ShowUpFee={DB_RECORDS.Payment.show_up_fee}
                    GameBonus={DB_RECORDS.Payment.bonus}
                />
            )
        },
        NoCupsGame: {
            label: 'No Cups Game',
            element: () => (
                <NoCupsGameSummary
                    SignOfReward={DB_RECORDS.Payment.sign_of_reward}
                    ShowUpFee={DB_RECORDS.Payment.show_up_fee}
                    GameBonus={DB_RECORDS.Payment.bonus}
                    SummaryArgs={summary_args}
                />
            )
        },
        WordPuzzle: {
            label: 'Word Puzzle',
            element: () => (
                <WordPuzzleSummary
                    SignOfReward={DB_RECORDS.Payment.sign_of_reward}
                    ShowUpFee={DB_RECORDS.Payment.show_up_fee}
                    GameBonus={DB_RECORDS.Payment.bonus}
                />
            )
        },
        AbstractAndDeclarationEffect: {
            label: 'Abstract and declaration effect',
            element: () => (
                <AbstractAndDeclarationEffectSummary
                    SignOfReward={DB_RECORDS.Payment.sign_of_reward}
                    ShowUpFee={DB_RECORDS.Payment.show_up_fee}
                    GameBonus={DB_RECORDS.Payment.bonus}
                />
            )
        },
        SignatureAsReminder: {
            label: 'Subjective story study',
            element: () => (
                <SignatureAsReminderSummary
                    SignOfReward={DB_RECORDS.Payment.sign_of_reward}
                    ShowUpFee={DB_RECORDS.Payment.show_up_fee}
                    GameBonus={DB_RECORDS.Payment.bonus}
                />
            )
        },
        TryOrGiveUp: {
            label: 'Try Or Give Up',
            element: () => (
                <TryOrGiveUpSummary
                    SummaryArgs={summary_args}
                />
            )
        }
    };

    return game_list[exp];
};
/*
<ConsentForm
                            consent_form={this.state.experiment_form_data.consent_form}
                            callback={() => this.buttonsOnClick('PreviewHide')}
                            mode='DEMO'
                        />
                        <ExpLogin
                            exp={this.state.experiment_selected}
                            callback={() => this.buttonsOnClick('PreviewHide')}
                            user={{
                                id: '',
                                age: '',
                                gender: '',
                            }}
                            // mode='DEMO'
                            // user={{
                            //     id: this.state.auth.user.email,
                            //     age: this.state.auth.user.age,
                            //     gender: this.state.auth.user.gender,
                            // }}

                        />
 */

const HandleFullScreen = (props) => {
    const handle = useFullScreenHandle();
    useEffect(() => {
        if (props.action_time_alert)
            handle.exit();
    }, [handle, props.action_time_alert]);

    return (
        <Fragment>
            <div>
                {props.children[0]}
                <div
                    className='full-screen-alert-msg'
                >
                    <label>This game is played on <span>Full Screen</span> mode.</label>
                    <label>Click on the button to enter full screen</label>
                    <button
                        onClick={handle.enter}
                    >
                        Enter Full Screen
                    </button>
                </div>
            </div>

            <FullScreen handle={handle} onChange={(state, handle) => {

                if (FirstFullScreenChange){
                    let log = {
                        user_id: DB_RECORDS.UserDetails.UserId,
                        exp: CurrentExperiments,
                        running_name: DB_RECORDS.KeyTable.RunningName,
                        action: 'F.C.H',
                        type: 'LogGameType',
                        more_params: {
                            id: EXP_ID,
                            v: state
                        },
                    };

                    NewLogs(log).then();
                }
                if (state === true && !FirstFullScreenChange) FirstFullScreenChange = true;

                FullScreenState = state;
            }}>
                {props.children && props.children}
            </FullScreen>
        </Fragment>
    )
};

const UnMoveComponent = ({callback}) => {
    const second_warning = useRef(null);

    useEffect(() => {
        const timer=setInterval(() => {
            let old_val = Number(second_warning.current.innerText);
            if (old_val > 0)
                second_warning.current.innerText = old_val - 1;
            else {
                clearInterval(timer);
                callback('END_TIME');
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [callback]);

    return (
        <div className='game-handle_panel-UnMoveComponent'>
            <div>
                <label>
                    If no response is received in <span ref={second_warning}>{SecondWarning}</span> seconds,<br/>
                    you will be <span>removed</span> from the study.<br/>
                </label>
                <button
                    onClick={() => callback('RESTART_TIME')}
                >OK</button>
            </div>
        </div>

    )
};

const BackToMain = ({pathname}) => {
    return (
        <Link
            className='game-handle_back_to_main'
            to={pathname}
        >
            <span>&#9664;</span>
        </Link>
    )
};

const Summary = ({exp, finishCallback, summary_args}) => {
    const [expSummary, setExpSummary] = useState(null);

    useEffect(() => {
        setExpSummary(getSummary({exp, summary_args}));
    }, [exp, summary_args]);

    if (!expSummary) return <></>;

    return (
        <div
            className='exp-summary'
        >
            <div>
                <label className='exp-summary-h'>Congratulations!</label>
                <label className='exp-summary-h2'>You finished the study!</label>
                {expSummary.element()}
                <label className='exp-summary-h2'>Thank you for participating in the <span>{expSummary.label}</span> study! 😀</label>
                <div>
                    <label className='exp-summary-h2'>If you have comments please write it below:</label>
                    <textarea onChange={e => insertTextInput('UserFinalComments', e.target.value)}/>
                </div>
                <label className='exp-summary-h3'>To get your completion code, please press the button below without closing the window.</label>
                <button onClick={() => finishCallback()}>Get completion code!</button>
            </div>
        </div>
    )
};

const PlayError = ({state, exp}) => {

    return (
        <div
            className='play_error'
        >
            <label>Thank you for you participation!</label>
            <label>Game <span>Ends</span> now.</label>
            <label>You may now close the tab</label>

            {
                state && state.isAuthenticated && (
                    <Link
                        className='button-item'
                        to={{
                            pathname:  `${exp}/main`,
                            // state: {exp}
                        }}
                    >
                        Return to main
                    </Link>
                )
            }

            {
                state && ((state.active_settings && state.active_settings.mode !== 'Real') || state.isAuthenticated) && (
                    <button
                        className='button-item'
                        onClick={() => window.location.reload()}
                    >
                        Play again
                    </button>
                )
            }

        </div>
    );
};

const NoActionRejected = ({state, exp}) => {

    return (
        <div
            className='time_end'
        >
            <label>Your session has <span className='b1'>ended</span> because there was no response in the last {ActionTime} seconds.</label>
            <label><span className='b2'>Sadly you will not be compensated</span>, as explained in the instructions.</label>
            <label>You may now close the tab.</label>
            <label><span className='b3'>Thank you</span></label>

            <div>
                {
                    state && state.isAuthenticated && (
                        <Link
                            className='button-item'
                            to={{
                                pathname:  `${exp}/main`,
                                // state: {exp}
                            }}
                        >
                            Return to main
                        </Link>
                    )
                }

                {
                    state && ((state.active_settings && state.active_settings.mode !== 'Real') || state.isAuthenticated) && (
                        <button
                            className='button-item'
                            onClick={() => window.location.reload()}
                        >
                            Play again
                        </button>
                    )
                }
            </div>

        </div>
    );
};

const RunningError = () => {
    return (
        <div
            className='play_error'
        >
            <label>Its was some error!</label>
            <label></label>
            <label>You may now close the tab</label>
        </div>
    );
};

const NotReady = ({exp}) => {
    return (
        <>
            <label>Not ready</label>

            <Link
                className='button-item'
                to={{
                    pathname:  `${exp}/main`,
                    // state: {exp}
                }}
            >
                Return to main
            </Link>
        </>
    );
};

const RedirectingWait = () => {
    return (
        <div
            className='redirect-stage'
        >
            <label>Redirecting please wait...</label>
            <div className="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export class DebuggerModalView extends React.Component {
    constructor(props) {
        super(props);
        this.modalRoot = document.getElementById('debugger-mode-body');
        if (!this.modalRoot) return;
        this.el = document.createElement('div');
        this.el.setAttribute("id", "DebuggerContent");
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentDidMount() {
        if (!this.modalRoot) return;
        this.modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        if (!this.modalRoot) return;
        this.modalRoot.removeChild(this.el);
    }

    render() {
        if (!this.modalRoot) return <></>;

        return ReactDOM.createPortal(
            this.props.children,
            this.el
        );
    }
}

const DebuggerSize = {
    width: 0,
    height: 0
}

const DebuggerWindows = () => {
    DebuggerRef = useRef(null);

    const [show, setShow] = useState(true);

    useEffect(() => {
        const element = DebuggerRef.current;
        function checkResize(mutations) {
            const w = DebuggerRef.current.style.width;
            const h = DebuggerRef.current.style.height;

            const isChange = DebuggerSize.width !== w || DebuggerSize.height !== h;

            if (!isChange) { return; }
            DebuggerSize.width = w;
            DebuggerSize.height = h;
            DebuggerRefDown = false;
            // const event = new CustomEvent('resize', { detail: { width: w, height: h } });
            // el.dispatchEvent(event);
        }
        const observer = new MutationObserver(checkResize);
        observer.observe(element, { attributes: true, attributeOldValue: true, attributeFilter: ['style'] });
    }, []);

    return (
        <div
            onDoubleClick={() => setShow(!show)}
            className='debugger-mode unselectable'
            // ref={DebuggerRef}
            ref={DebuggerRef}
            onMouseUp={() => DebuggerRefDown = false}
            onMouseDown={e => {
                const {top, left} = DebuggerRef.current.getBoundingClientRect();

                offset = [
                    left - e.clientX,
                    top - e.clientY
                ];
                DebuggerRefDown = true;
            }}
        >
            <label
                className='debugger-mode-header unselectable'
                // onMouseUp={() => DebuggerRefDown = false}
            >
                Move
            </label>

            <div
                className={'unselectable ' + (show ? '' : 'hide-elem')}
                id='debugger-mode-body'
            >
            </div>
        </div>
    )
}

class GameHandle extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        ResetAll();

        let exp_;

        try {
            exp_ = this.props.location.state.exp;
        }
        catch (e){
            exp_ = undefined;
        }


        if (!exp_) {
            try {
                exp_ = GetExperimentName(window.location.pathname.replace('/', ''));
            }
            catch (e){
                exp_ = undefined;
            }


            if (!exp_) {
                this.state = {
                    not_found: true, isLoading: false,
                };
                return;
            }
        }

        this.exp = exp_;
        CurrentExperiments = exp_;

        getGameType(CurrentExperiments);

        preventPageGoBack();

        this.debuggerMode = localStorage.getItem(this.exp + '_debugger_mode') || false;

        this.game_handle = ['Load', 'ConsentForm', 'ExpLogin', 'Game', 'Summary'];

        this.state = {
            auth: props.auth,
            isAuthenticated: props.isAuthenticated,
            isLoading: true,
            debuggerModeRunning: this.debuggerMode && props.isAuthenticated,
            game_index: 0,
            consent_form: null,
            game_settings: null,
            running_error: false,
            user_rejected: false,
            no_action_rejected: false,
            user_finish_game: false,
            not_ready: null,
            play_error: false,
            force_full_screen: false,
            action_time_alert: false,
            redirect_to: null,
            not_found: false,
            summary_args: null,
        };

        this.callbackFunction = this.callbackFunction.bind(this);
        this.actionTimerOptions = this.actionTimerOptions.bind(this);
        this.finishGame = this.finishGame.bind(this);
        this.getEndCode = this.getEndCode.bind(this);
        this.recordsFinishGame = this.recordsFinishGame.bind(this);

        this.need_new_game = false;

        this.DEV_ALREADY_RUN = false;
    }

    componentDidMount() {
        if (this.DEV_ALREADY_RUN) return;
        this.DEV_ALREADY_RUN = true;
        // window.onresize = function() {
        //     if ((window.outerHeight - window.innerHeight) > 100) {
        //         log('Docked inspector was opened');
        //     }
        // }
        this.props.setWaitForAction(true);
        let current_exp = this.exp;

        getExpState(current_exp).then(
            exp_state_res => {
                let sc = this.state;

                try {
                    if (exp_state_res.data.error)
                        throw new CodeError('err', 404);

                    sc.not_ready = exp_state_res.data.msg;

                    if (exp_state_res.data.msg === 'Y'){
                        this.props.setGameMode(true);
                        getGameConsentForm(current_exp).then(
                            res => {
                                try {
                                    if (res.data.error)
                                        throw new CodeError('err', 404);


                                    if (res.data.cf === 'N')
                                        sc.game_index += 2;
                                    else{
                                        sc.consent_form = res.data.cf_b;
                                        sc.game_index += 1;
                                    }
                                }
                                catch (e) {
                                    sc.not_ready = 'N';
                                    sc.running_error = true;
                                }
                                sc.isLoading = false;
                                this.setState(sc, () => this.props.setWaitForAction(false));
                            }
                        )
                    }
                    else {
                        sc.isLoading = false;
                        this.setState(sc, () => this.props.setWaitForAction(false));
                    }
                }
                catch (e) {
                    sc.not_found = true;
                    sc.isLoading = false;
                    this.setState(sc, () => this.props.setWaitForAction(false));
                }
            }
        );

        ActionTimeLast = Date.now();
        this.ActionTimerInterval = setInterval(() => {
            if (ActionTime !== null && SecondWarning !== null){
                if (LIMITED_TIME && !SecondWarningShow){
                    let NowAction = Date.now();
                    if ((NowAction - ActionTimeLast) >= ActionTime*1000){
                        this.setState(() => {
                            return {
                                action_time_alert: true
                            }
                        })
                    }
                }
            }
        }, 1000);
    }

    componentWillUnmount() {
        window.onbeforeunload = null;
        window.onunload = null;
        window.onvisibilitychange = null;
    }

    actionTimerOptions(option) {
        SecondWarningShow = false;
        ActionTimeLast = Date.now();
        let sc = this.state;
        sc.action_time_alert = false;
        if (option === 'END_TIME'){
            NewLogs({
                user_id: DB_RECORDS.UserDetails.UserId,
                exp: this.exp,
                running_name: sc.active_settings.running_name,
                action: 'U.R',
                type: 'LogGameType',
                more_params: {
                    reason: 'S.W',
                    elapsed: Date.now() - EntranceTime,
                    local_t: getTimeDate().time,
                    local_d: getTimeDate().date,
                },
            }).then((res) => {});
            sc.no_action_rejected = true;
        }
        // else if (option === 'RESTART_TIME'){}
        this.setState(sc);
    }

    getEndCode(){
        this.props.setWaitForAction(true);

        getEndCode({
            ex: this.exp,
            ve: this.state.game_settings.version,
            ex_id: EXP_ID,
            user_id: DB_RECORDS.UserDetails.UserId,
        }).then(
            res => {
                // this.props.setWaitForAction(false);

                let redirect = res.data.rdc;
                NewLogs({
                    user_id: DB_RECORDS.UserDetails.UserId,
                    exp: this.exp,
                    running_name: this.state.active_settings.running_name,
                    action: 'R.D',
                    type: 'LogGameType',
                    more_params: {
                        g: 'y',
                        elapsed: Date.now() - EntranceTime,
                        local_t: getTimeDate().time,
                        local_d: getTimeDate().date,
                    },
                }).then((res) => {});
                if (redirect && !redirect.startsWith('http'))
                    redirect = 'https://' + redirect;
                this.setState({redirect_to: redirect}, this.props.setWaitForAction(false));
            }
        )
    }

    finishGame(new_game) {
        this.props.setWaitForAction(true);
        let sc = this.state;
        if (new_game){
            ResetNewGame();
            getGameType(CurrentExperiments);
            sc.game_index = 2;
        }
        else {
            sc.loading = false;
            sc.user_finish_game = true;
        }

        this.setState(sc, () => {
            this.props.setWaitForAction(false);

            if (new_game)
                return;
            //     return this.callbackFunction('ExpLogin', DB_RECORDS.UserDetails, true);

            if (this.state.active_settings.mode === 'Real' && !this.state.isAuthenticated) {
                this.props.setWaitForAction(false);
                this.getEndCode();
            }
        });
    }

    recordsFinishGame = (params) => {
        this.props.setWaitForAction(true);

        let game_points;
        try {
            game_points = params.args.game_points;
        }
        catch (e) {
            game_points = '-';
        }

        FinishRecordGame({
            Exp: CurrentExperiments,
            ExpID: EXP_ID,
            Date: getTimeDate().time + ' | ' + getTimeDate().date,
            Records: stringify({
                Summary: DB_RECORDS.Summary,
                Payment: DB_RECORDS.Payment,
                MoreRec: DB_RECORDS.MoreRec,
            }),
        }).then(
            res => {
                try {
                    let new_game = false;
                    try {
                        new_game = params.new_game;
                    }
                    catch (e) {}

                    if (res.data.msg === 'RecordSaved'){
                        NewLogs({
                            user_id: DB_RECORDS.UserDetails.UserId,
                            exp: CurrentExperiments,
                            running_name: this.state.active_settings.running_name,
                            action: 'F.R.S',
                            type: 'LogGameType',
                            more_params: {
                                game_points: game_points,
                            },
                        }).then((res) => {
                            this.finishGame(new_game);
                        });
                        DB_RECORDS.Game = [];
                        DB_RECORDS.Payment = {};
                        DB_RECORDS.Summary = {
                            TextInput: '',
                            StartTime: null,
                            EndTime: null,
                            EndTimeMil: null,
                            UserFinalComments: '',
                            Date: ''
                        };
                        EntranceTime = Date.now();
                    }
                    else {
                        NewLogs({
                            user_id: DB_RECORDS.UserDetails.UserId,
                            exp: CurrentExperiments,
                            running_name: this.state.active_settings.running_name,
                            action: 'F.R.N.S',
                            type: 'LogGameType',
                            more_params: {
                                game_points: game_points,
                                error: 'msg'
                            },
                        }).then((res) => {
                            this.props.setWaitForAction(false);
                            this.finishGame(new_game);
                        });
                    }
                }
                catch (e) {
                    NewLogs({
                        user_id: DB_RECORDS.UserDetails.UserId,
                        exp: CurrentExperiments,
                        running_name: this.state.active_settings.running_name,
                        action: 'R.N.S',
                        type: 'LogGameType',
                        more_params: {
                            game_points: game_points,
                            error: 'catch'
                        },
                    }).then((res) => this.props.setWaitForAction(false));
                }
            }
        )
    }

    // ng = 'NewGame
    callbackFunction(option, params){
        if (option === 'ConsentForm'){
            let sc = this.state;
            if (params === 'user_not_consent') {
                sc.user_rejected = true;
            }
            else {
                sc.game_index++;
            }
            this.setState(sc);

        }
        else if (option === 'UserRequestToQuit'){
            let sc = this.state;
            sc.user_rejected = true;
            this.setState(sc);
        }
        else if (option === 'ExpLogin'){
            this.props.setWaitForAction(true);
            const isAuth = this.state.isAuthenticated;
            DB_RECORDS.UserDetails = params;
            try {
                let date = new Date();
                DB_RECORDS.UserDetails.TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                DB_RECORDS.UserDetails.GMT = date.toString().match(/([A-Z]+[-][0-9]+)/)[1];
                DB_RECORDS.UserDetails.EDT = date.toString().match(/\(([A-Za-z\s].*)\)/)[1];
                DB_RECORDS.UserDetails.Lang = window.navigator.language;
                DB_RECORDS.UserDetails.Langs = navigator.languages.join(' | ');
                DB_RECORDS.UserDetails.ScreenH = window.screen.height;
                DB_RECORDS.UserDetails.ScreenW = window.screen.width;
                DB_RECORDS.UserDetails.PixelRatio = window.devicePixelRatio;
            }
            catch (e) {

            }

            this.setState({isLoading: true}, () => {
                getGameVersion(this.exp, DB_RECORDS.UserDetails.UserId, isAuth, this.need_new_game).then(
                    res => {
                        try {
                            if (res.data.error){
                                 return this.setState({
                                    isLoading: false,
                                    play_error: true,
                                }, () => this.props.setWaitForAction(false));
                            }
                            DB_RECORDS.KeyTable.ID = res.data.run_id;
                            DB_RECORDS.KeyTable.ProlificID = DB_RECORDS.UserDetails.UserId;
                            DB_RECORDS.KeyTable.RunningName = res.data.active_settings.running_name;
                            DB_RECORDS.KeyTable.Version = res.data.active_settings.version;
                            DB_RECORDS.KeyTable.Mode = res.data.active_settings.mode;
                            DB_RECORDS.KeyTable.Date = getTimeDate().date;

                            let force_full_screen;
                            try {
                                force_full_screen = res.data.version.game.force_full_screen;
                                if (force_full_screen === 'true' || force_full_screen === true) {
                                    force_full_screen = true;
                                    // FullScreenMode = true;
                                }
                                else {
                                    force_full_screen = false;
                                    // FullScreenMode = false;
                                }
                            }
                            catch (e) {
                                force_full_screen = false;
                                // FullScreenMode = false;
                            }

                            ActionTime = Number(res.data.version.general.action_time);
                            SecondWarning = Number(res.data.version.general.second_warning);

                            OpenNewRecord({
                                Exp: CurrentExperiments,
                                UserId: DB_RECORDS.UserDetails.UserId,
                                ISA: isAuth,
                                Records: stringify(DB_RECORDS),
                                RunningName: DB_RECORDS.KeyTable.RunningName,
                                Mode: DB_RECORDS.KeyTable.Mode,
                                Version: DB_RECORDS.KeyTable.Version,
                                Date: getTimeDate().time + ' | ' + getTimeDate().date
                            }).then(
                                new_record_res => {
                                    try {
                                        EXP_ID = new_record_res.data.msg;
                                        NewLogs({
                                            user_id: DB_RECORDS.UserDetails.UserId,
                                            exp: CurrentExperiments,
                                            running_name: res.data.active_settings.running_name,
                                            action: 'U.L',
                                            type: 'LogGameType',
                                            more_params: {
                                                local_t: getTimeDate().time,
                                                local_d: getTimeDate().date,
                                            },
                                        }).then((log_res) => {
                                            this.setState(state => {
                                                return {
                                                    active_settings: res.data.active_settings,
                                                    isLoading: false,
                                                    game_settings: res.data.version,
                                                    more: res.data.more,
                                                    game_index: state.game_index + 1,
                                                    force_full_screen
                                                }
                                            }, () => {

                                                this.props.setWaitForAction(false);
                                            });
                                        });
                                    }
                                    catch (e) {
                                        NewLogs({
                                            user_id: DB_RECORDS.UserDetails.UserId,
                                            exp: CurrentExperiments,
                                            running_name: DB_RECORDS.KeyTable.RunningName,
                                            action: 'N.R.N.S',
                                            type: 'LogGameType',
                                            more_params: {
                                                // game_points: params.args.game_points || 0,
                                                error: 'catch'
                                            },
                                        }).then((res) => {});
                                        this.props.setWaitForAction(false);
                                    }
                                }
                            )
                        }
                        catch (e) {

                            this.setState({
                                isLoading: false,
                                running_error: true,
                            }, () => this.props.setWaitForAction(false));
                        }
                        this.need_new_game = false;
                    }
                )
            });
        }
        else if (option === 'ReturnToConsent'){
            let sc = this.state;
            sc.game_index--;
            this.setState(sc);
        }
        else if (option === 'FinishGame'){
            this.props.setWaitForAction(true);
            let end_time = getTimeDate().time;
            let elapsed = Date.now() - EntranceTime;

            let game_points = '-';
            try {
                game_points = params.args.game_points;
            }
            catch (e) {
                game_points = 0;
            }
            NewLogs({
                user_id: DB_RECORDS.UserDetails.UserId,
                exp: CurrentExperiments,
                running_name: this.state.active_settings.running_name,
                action: 'F.G',
                type: 'LogGameType',
                more_params: {
                    game_points,
                    elapsed,
                    local_t: end_time,
                    local_d: getTimeDate().date,
                },
            }).then((res) => {});

            // DB_RECORDS.Summary.TextInput = params.args.text_input || '';
            DB_RECORDS.Summary.StartTime = getTimeDate(EntranceTime).time;
            DB_RECORDS.Summary.EndTime = end_time;
            DB_RECORDS.Summary.EndTimeMil = elapsed;
            DB_RECORDS.Summary.Date = getTimeDate(EntranceTime).date;

            this.need_new_game = params.new_game;

            if (params.need_summary === true){
                let sc = this.state;
                sc.game_index++;
                sc.summary_args = params.args;
                this.setState(sc, () => this.props.setWaitForAction(false));
            }
            else {
                this.recordsFinishGame(params);
            }
        }
    }

    game_stages(){
        let stage = this.game_handle[this.state.game_index];
        let user;
        try {
            if (this.state.isAuthenticated)
                user =  {
                    id: this.state.auth.user.email,
                    age: this.state.auth.user.age,
                    gender: this.state.auth.user.gender,
                };
            else
                user =  {
                    id: '',
                    age: '',
                    gender: '',
                };
        }
        catch (e) {
           user =  {
               id: '',
               age: '',
               gender: '',
           };
        }

        switch (stage){
            case 'ConsentForm':
                return (
                    <>
                        {this.state.isAuthenticated && <BackToMain pathname={`${this.exp}/main`}/>}
                        <ConsentForm consent_form={this.state.consent_form} callback={this.callbackFunction} mode={this.state.isAuthenticated ? 'DEMO' : 'GAME'}/>
                    </>
                );
            case 'ExpLogin':
                return (
                    <>
                        {this.state.isAuthenticated && <BackToMain pathname={`${this.exp}/main`}/>}
                        <ExpLogin have_consent={this.state.consent_form !== null} callback={this.callbackFunction} mode={'GAME'} exp={this.exp} user={user} isAdmin={this.state.isAuthenticated}/>
                    </>
                );
            case 'Game':
                OnBeforeUnload(true);
                if (this.state.force_full_screen)
                    return (
                        <HandleFullScreen
                            action_time_alert={this.state.action_time_alert}
                        >
                            {this.state.isAuthenticated && <BackToMain pathname={`${this.exp}/main`}/>}
                            {
                                getGame({
                                    exp: this.exp,
                                    game_settings: this.state.game_settings,
                                    more: this.state.more,
                                    isa: this.state.isAuthenticated,
                                    callbackFunction: this.callbackFunction,
                                    setWaitForAction: this.props.setWaitForAction,
                                    dmr: this.state.debuggerModeRunning
                                })
                            }

                            {
                                this.state.debuggerModeRunning && <DebuggerWindows/>
                            }
                        </HandleFullScreen>
                    );

                return (
                    <>
                        {this.state.isAuthenticated && <BackToMain pathname={`${this.exp}/main`}/>}
                        {
                            getGame({
                                exp: this.exp,
                                game_settings: this.state.game_settings,
                                more: this.state.more,
                                isa: this.state.isAuthenticated,
                                callbackFunction: this.callbackFunction,
                                setWaitForAction: this.props.setWaitForAction,
                                dmr: this.state.debuggerModeRunning
                            })
                        }

                        {
                            this.state.debuggerModeRunning && <DebuggerWindows/>
                        }
                    </>
                )
            case 'Summary':
                return (
                    <>
                        <Summary summary_args={this.state.summary_args} exp={this.exp} finishCallback={this.recordsFinishGame}/>
                        {
                            this.state.debuggerModeRunning && <DebuggerWindows/>
                        }
                    </>
                )
            default: return <></>
                // return <div>Game running</div>
        }
    }

    render() {

        if (!this.state || this.state.isLoading)
            return <></>;

        if (this.state.redirect_to !== null && this.state.redirect_to) {
            OnBeforeUnload(false);
            return window.location = this.state.redirect_to;
        }

        if ((this.state.redirect_to !== null && !this.state.redirect_to) || this.state.play_error || this.state.user_rejected || (this.state.user_finish_game && this.state.active_settings.mode !== 'Real') || (this.state.user_finish_game && this.state.isAuthenticated)) {
            OnBeforeUnload(false);
            return <PlayError state={this.state} exp={this.exp}/>;
        }

        if (this.state.no_action_rejected) {
            OnBeforeUnload(false);
            return <NoActionRejected state={this.state} exp={this.exp}/>;
        }

        if (this.state.user_finish_game)
            return <RedirectingWait />;

        if (this.state.running_error) {
            OnBeforeUnload(false);
            return <RunningError/>;
        }

        if (this.state.not_found || (this.state.not_ready === 'N' && !this.state.isAuthenticated)) {
            OnBeforeUnload(false);
            return <Navigate to='/not_found'/>;
        }

        if (this.state.not_ready === 'N' && this.state.isAuthenticated) {
            OnBeforeUnload(false);
            return <NotReady exp={this.exp}/>;
        }


        return (
            <>
                { this.state.action_time_alert && <UnMoveComponent callback={this.actionTimerOptions}/> }
                <div
                    className={'game-handle_panel ' + (this.state.action_time_alert ? 'dimming-page' : '')}
                    onMouseUp={() => DebuggerRefDown = false}
                    onMouseMove={(event) => {
                        ActionTimeLast = Date.now();
                        if (this.state.debuggerModeRunning){
                            if (DebuggerRef && DebuggerRefDown){
                                event.preventDefault();
                                mousePosition = {
                                    x : event.clientX,
                                    y : event.clientY

                                };

                                DebuggerRef.current.style.left = (mousePosition.x + offset[0]) + 'px';
                                DebuggerRef.current.style.top  = (mousePosition.y + offset[1]) + 'px';
                            }
                        }
                    }}
                    onMouseDown={() => ActionTimeLast = Date.now()}
                    onKeyDown={() => ActionTimeLast = Date.now()}
                >
                    {this.game_stages()}
                </div>
            </>
        );
    };
}

GameHandle.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    auth: PropTypes.object,
};

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction})(GameHandle);



