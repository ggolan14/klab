import React from "react";
import PropTypes from 'prop-types';
import './logs.css';
import {connect} from "react-redux";
import {setGameMode, setWaitForAction} from "../../../actions/app_actions";
import {setAlert} from "../../../actions/alert";
import {toggleOpen} from "../dropdown/dropdown";
import {getExpsList} from "../../../actions/exp_actions";
import {getLogsOfUser, getLogsRuns, getOutSourceIPLogs, getUsersOfRunnerList} from "../../../actions/logger";
import {Header} from "../../layout/header/header";
import {preventPageGoBack, setCurrentExp} from "../../../utils/helpers";

/*
exp
description
version_of
status
messages
date_modified
last_modified
created_by
date_created
 */

let RedirectBack;

const Actions = {
    General: {
        'G.O': 'Go out',
        'G.S': 'Game start',
        'G.L': 'Game loaded',
        'G.E': 'Game end',
        'G.E.S': 'Game end summary',
        'G.D.R.S': 'Game records part saved',
        'G.D.R.N.S': 'Game records part not saved',
        'F.G': 'Finish game',
        'F.R.S': 'Finish records saved',
        'F.R.N.S': 'Finish records not saved',
        'F.C.H': 'Full screen changed',
        'N.P.W': 'Next puzzle WordsShow',
        'N.R.N.S': 'New user saved failed',
        'T.O': 'Try to go out',
        'R.D': 'Get redirect code',
        'R.N.S': 'Finish records Error',
        'U.R': 'User rejected',
        'U.L': 'User login',
        'V.C.H': 'Visibility HIDDEN',
        'V.C.V': 'Visibility VISIBLE',
        'v': 'On Full Screen',
        'g': 'User get finish code',
        'game_points': 'Game points',
        'local_t': 'User local time',
        'local_d': 'User local date',
        'reason': 'Reason',
        'stage': 'Stage',
        'game_end': 'Game end',
        'bonus': 'Bonus',
        'total_payment': 'Total payment',
        'id': 'Exp ID',
        'part': 'Part',
        'elapsed': 'Elapsed time',
    },
    WordPuzzle: {
        'C.T.P.G': 'Continue to puzzle game',
        'D.S': 'Demo start',
        'D.E': 'Demo end',
        'F.P': 'Finish puzzle',
        'W.F': 'Word found',
        'W.S': 'Word Show',
        'P': 'Puzzle',
        'p_type': 'Puzzle type',
        'puzzle_number': 'Puzzle number',
        'words_founded': 'Words founded',
        'words_founded_total': 'Words founded total',
        'word': 'Word',
    },
    MetaSampling: {
        'M.G': 'Game',
        'l': 'Level',
        'p': 'Practice round',
        't_t': 'Total trials',
        'irc': 'Round is correct',
        'r_r': 'Random round',
        'P': 'Practice',
        'R': 'Real'
    },
    ReversibleMatrices: {
        'M.G': 'Game',
        'l': 'Level',
        'p': 'Practice round',
        't_t': 'Total trials',
        'irc': 'Round is correct',
        'r_r': 'Random round',
        'P': 'Practice',
        'R': 'Real'
    },
    SignatureTimingEffect: {
        'M.G': 'Game',
        'F.S': 'Finish story',
        'F.Q': 'Finish questions',
        'l': 'Level',
        'p': 'Practice round',
        't_t': 'Total trials',
        'irc': 'Round is correct',
        'r_r': 'Random round',
        'P': 'Practice',
        'R': 'Real'
    },
    NoCupsGame: {
        'M.G': 'Game',
        'l': 'Level',
        'p': 'Practice round',
        't_t': 'Total trials',
        'irc': 'Round is correct',
        'r_r': 'Random round',
        'P': 'Practice',
        'R': 'Real'
    },
    RepeatedChoice: {
        'M.G': 'Game',
        'l': 'Level',
        'p': 'Practice round',
        't_t': 'Total trials',
        'irc': 'Round is correct',
        'r_r': 'Random round',
        'P': 'Practice',
        'R': 'Real'
    },
    AbstractAndDeclarationEffect: {
        'M.G': 'Game',
        'l': 'Level',
        'p': 'Practice round',
        't_t': 'Total trials',
        'irc': 'Round is correct',
        'r_r': 'Random round',
        'P': 'Practice',
        'R': 'Real'
    },
    SignatureAsReminder: {
        'M.G': 'Game',
        'l': 'Level',
        'p': 'Practice round',
        't_t': 'Total trials',
        'irc': 'Round is correct',
        'r_r': 'Random round',
        'P': 'Practice',
        'R': 'Real'
    },
};

const ActionCodeConvert = (exp, action) => {
    let r;
    try {
        if (Actions.General[action] !== undefined)
            r = Actions.General[action];
        else
            r = Actions[exp][action];
        if (!r) r = action;
    }
    catch (e) {
        r = action;
    }
    return r;
}

class LogsDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        let exp = undefined;
        try {
            exp = this.props.location.state.exp;
        }
        catch (e){
        }

        setCurrentExp(exp);

        this.state = {
            auth: props.auth,
            isAuthenticated: props.isAuthenticated,
            experiment_list: [],
            exp_selected: exp,
            experiment_list_dropdown: false,
            AllExperiments: [],
            runs_list: [],
            users_list: [],
            user_logs: [],
            selected_run: undefined,
            selected_user: null,
            selected_log: null,
            selected_log_out: null,
        };

        this.select_drop_item = this.select_drop_item.bind(this);
        this.onClickOnForm = this.onClickOnForm.bind(this);
        this.getLists = this.getLists.bind(this);
        this.onChangeRunning = this.onChangeRunning.bind(this);
        this.onSelectUser = this.onSelectUser.bind(this);
    }

    componentDidMount() {
        this.props.setGameMode(false);
        this.props.setWaitForAction(true);
        preventPageGoBack();

        getExpsList().then(
            res => {
                try {
                    let sc = this.state;
                    sc.AllExperiments = res.data.exps_list;
                    sc.isAuthenticated = this.props.isAuthenticated;
                    sc.auth = this.props.auth;
                    this.setState(sc, () => this.props.setWaitForAction(false));
                }
                catch (e) {

                }
            }
        )

        if (this.state.exp_selected)
            this.getLists();

    }

    getLists() {
        this.props.setWaitForAction(true);
        getLogsRuns(this.state.exp_selected).then(
            res => {
                let sc = this.state;
                sc.users_list = [];
                sc.selected_run = undefined;
                sc.selected_user = null;
                sc.selected_log = null;
                sc.selected_log_out = null;
                sc.user_logs = [];
                try {
                    sc.runs_list = res.data.runs.filter(run => run !== '');
                }
                catch (e) {
                    sc.runs_list = [];
                }
                this.setState(sc, () => this.props.setWaitForAction(false));
            }
        )
    }

    select_drop_item(item, tag) {
        if (tag === 'EXP') {
            let sc = this.state;
            sc.exp_selected = item;
            setCurrentExp(item);
            this.setState(sc, () => this.getLists());
        }
    }

    onChangeRunning(running) {
        this.props.setWaitForAction(true);

        getUsersOfRunnerList(this.state.exp_selected, running).then(
            res => {
                try {
                   let sc = this.state;
                   sc.users_list = res.data.users;
                   sc.selected_run = running;
                   sc.selected_user = null;
                   sc.selected_log = null;
                   sc.selected_log_out = null;
                   sc.user_logs = [];
                   this.setState(sc, () => this.props.setWaitForAction(false));
                }
                catch (e) {
                    this.props.setWaitForAction(false);
                }
            }
        )
    }

    onSelectUser(user) {
        this.props.setWaitForAction(true);

        getLogsOfUser(this.state.exp_selected, this.state.selected_run, user).then(
            res => {
                try {
                   let sc = this.state;
                   sc.user_logs = res.data.logs;
                   sc.selected_user = user;
                   sc.selected_log = null;
                   sc.selected_log_out = null;
                    this.setState(sc, () => this.props.setWaitForAction(false));
                }
                catch (e) {
                    this.props.setWaitForAction(false);
                }
            }
        )
    }

    onClickOnForm(e) {
        try {
            let tag = e.target.attributes.group.value;
            if (tag !== 'DROPDOWN_TAG')
                toggleOpen.bind(this)('ALL');
        }
        catch (e) {
            toggleOpen.bind(this)('ALL');
        }
    }

    // more_params: {elapsed: 948272, local_t: '12:10:43', local_d: '10-12-2021'}

    render() {
        try {

            return (
                <>
                    <div
                        className={'logs_display ' + (this.state.selected_log ? 'dimming-page' : '')}
                        onClick={this.onClickOnForm}
                    >
                        <Header
                            item_selected={this.state.exp_selected}
                            list_open={this.state.experiment_list_dropdown}
                            optionsList={this.state.auth.user.Experiments}
                            select_item={this.select_drop_item}
                            reference={this}
                        />

                        <div
                            className='exp_logs'
                        >
                            <div
                                className={'runs_select ' + (this.state.selected_run === 'Select' || this.state.selected_run === undefined ? 'non' : '')}
                            >
                                <label>Select run:</label>
                                <select
                                    onChange={e => this.onChangeRunning(e.target.value)}
                                    value={this.state.selected_run || 'Select'}
                                >
                                    <option disabled value='Select'>Select...</option>
                                    {this.state.runs_list.length > 0 && <option disabled={this.state.selected_run === 'All'}>All</option>}
                                    {
                                        this.state.runs_list.map(
                                            run_item => (
                                                <option
                                                    disabled={this.state.selected_run === run_item}
                                                    key={run_item}
                                                    value={run_item}
                                                >
                                                    {run_item}
                                                </option>
                                            )
                                        )
                                    }
                                </select>
                            </div>

                            <div
                                className='lists'
                            >
                                <div
                                    className='user_list_con'
                                >
                                    <div
                                        className='users_list'
                                    >
                                        {
                                            this.state.users_list.map(
                                                usr => (
                                                    <label
                                                        key={usr}
                                                        onClick={() => this.onSelectUser(usr)}
                                                        className={this.state.selected_user === usr? 'selected_user' : ''}
                                                    >
                                                        {usr}
                                                    </label>
                                                )
                                            )
                                        }
                                    </div>
                                </div>

                                <div
                                    className='user_logs_con'
                                >
                                    <div
                                        className='user_logs'
                                    >
                                        {
                                            this.state.user_logs.map(
                                                (usr_log, index) => (
                                                    <label
                                                        className={(this.state.selected_log && this.state.selected_log._id === usr_log._id ? 'selected_log' : '')}
                                                        onClick={() =>{
                                                            let sc = this.state;
                                                            sc.selected_log = usr_log;
                                                            this.setState(sc, () => {
                                                                getOutSourceIPLogs(usr_log.exp, usr_log.ip, usr_log.user_id).then(
                                                                    res => {
                                                                        let sc = this.state;
                                                                        try {
                                                                            sc.selected_log_out = res.data.out_logs;
                                                                        }
                                                                        catch (e) {
                                                                            sc.selected_log_out = undefined;
                                                                        }
                                                                        this.setState(sc);
                                                                    }
                                                                )
                                                            });
                                                        }}
                                                    >
                                                        <span className='index'>{index}. </span>
                                                        <span className='date'>{usr_log.date}</span>
                                                        <span className='time'>{usr_log.time}</span>
                                                        <span className='ip'>{usr_log.ip}</span>
                                                        <span className='action'>{ActionCodeConvert(usr_log.exp, usr_log.action)}</span>
                                                    </label>
                                                )

                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        this.state.selected_log && (
                            <div className='selected_log_info'>
                                <label onClick={() => this.setState({selected_log: null})}>X</label>
                                <div>
                                    <div className='selected_log_info_more'>
                                        {
                                            Object.keys(this.state.selected_log.more_params).map(
                                                key => (
                                                    <>
                                                    <label>
                                                        {ActionCodeConvert(this.state.exp_selected, key)}:
                                                    </label>
                                                        <label>
                                                            {ActionCodeConvert(this.state.exp_selected, this.state.selected_log.more_params[key].toString())}
                                                    </label>
                                                    </>
                                                )
                                            )
                                        }
                                    </div>
                                    {
                                        this.state.selected_log_out === null ? (
                                            <div>
                                                Loading
                                            </div>
                                        ): (
                                            this.state.selected_log_out === undefined ? (<></>) : (
                                                <div
                                                    className='selected_log_info_out'
                                                >
                                                    {
                                                        this.state.selected_log_out.ByIp.length > 0 && (
                                                            <div>
                                                                <label>Same IP</label>
                                                                <div>
                                                                    {
                                                                        this.state.selected_log_out.ByIp.map(
                                                                            by_ip => (
                                                                                <div>
                                                                                    <label>Date:</label>
                                                                                    <label>{by_ip.date}</label>
                                                                                    <label>Time:</label>
                                                                                    <label>{by_ip.time}</label>
                                                                                    <label>Type:</label>
                                                                                    <label>{by_ip.type}</label>
                                                                                    <label>UserID:</label>
                                                                                    <label>{by_ip.userId}</label>
                                                                                </div>
                                                                            )
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                    {
                                                        this.state.selected_log_out.ById.length > 0 && (
                                                            <div>
                                                                <label>Same ID</label>
                                                                <div>
                                                                    {
                                                                        this.state.selected_log_out.ById.map(
                                                                            by_id => (
                                                                                <div>
                                                                                    <label>Date:</label>
                                                                                    <label>{by_id.date}</label>
                                                                                    <label>Time:</label>
                                                                                    <label>{by_id.time}</label>
                                                                                    <label>Type:</label>
                                                                                    <label>{by_id.type}</label>
                                                                                    <label>IP:</label>
                                                                                    <label>{by_id.ip}</label>
                                                                                </div>
                                                                            )
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </>
            );
        }
        catch (e) {
            return <></>
        }
    };
}

LogsDisplay.propTypes = {
    isAuthenticated: PropTypes.bool,
    setGameMode: PropTypes.func.isRequired,
    setWaitForAction: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    auth: state.auth
});

export default connect(mapStateToProps, {setGameMode, setWaitForAction, setAlert})(LogsDisplay);


